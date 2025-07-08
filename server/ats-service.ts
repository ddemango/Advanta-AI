import multer from 'multer';
import { createWorker } from 'tesseract.js';
import mammoth from 'mammoth';
import OpenAI from 'openai';
import { db } from './db';
import { resumeAnalyses } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for file uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'jobImage' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.fieldname === 'resume' && (
      file.mimetype === 'application/pdf' ||
      file.mimetype.includes('document') ||
      file.mimetype.includes('word') ||
      file.mimetype === 'text/plain'
    )) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Extract text from uploaded image using OCR
async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  const worker = await createWorker();
  
  try {
    const { data: { text } } = await worker.recognize(imageBuffer);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}

// Extract text from uploaded resume file
async function extractTextFromResume(file: Express.Multer.File): Promise<string> {
  const buffer = file.buffer;
  
  if (file.mimetype === 'application/pdf') {
    try {
      // Simple approach: try basic text extraction first
      const pdfText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
      
      // If we got reasonable text length, use it
      if (pdfText.length > 100) {
        return pdfText;
      }
      
      // Otherwise try binary approach
      const binaryText = buffer.toString('binary');
      const extractedText = binaryText.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
      
      if (extractedText.length > 50) {
        return extractedText;
      }
      
      // Last fallback - return a message asking for text input
      return 'PDF text extraction failed. Please copy and paste your resume text into the job description field, or use a Word document instead.';
      
    } catch (error) {
      console.error('PDF parsing error:', error);
      return 'PDF parsing failed. Please copy and paste your resume text or use a Word document.';
    }
  } else if (file.mimetype.includes('document') || file.mimetype.includes('word')) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      console.error('Word document parsing error:', error);
      throw new Error('Word document parsing failed. Please try a different file format.');
    }
  } else if (file.mimetype === 'text/plain') {
    // Handle plain text files for testing
    return buffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file format. Please upload a PDF, Word document, or text file.');
  }
}

// Analyze and tailor resume using OpenAI
async function analyzeAndTailorResume(
  resumeText: string,
  jobDescriptionText: string
): Promise<{
  tailoredResumeText: string;
  changes: Array<{
    type: 'added' | 'removed' | 'modified';
    content: string;
    original?: string;
    suggestion?: string;
  }>;
  atsScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string[];
}> {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert ATS (Applicant Tracking System) optimization specialist and resume writer. Your task is to analyze a resume against a job description and provide:

1. A tailored version of the resume optimized for the specific job
2. Detailed changes made to improve ATS compatibility
3. An ATS compatibility score (0-100)
4. Keyword analysis and suggestions

Focus on:
- Adding relevant keywords from the job description
- Optimizing formatting for ATS parsing
- Highlighting relevant experience and skills
- Maintaining authenticity while maximizing relevance
- Using action verbs and quantifiable achievements

Respond with JSON in this exact format:
{
  "tailoredResumeText": "complete tailored resume text",
  "changes": [
    {
      "type": "added|removed|modified",
      "content": "what was changed",
      "original": "original text (for modified)",
      "suggestion": "reasoning for change"
    }
  ],
  "atsScore": 85,
  "keywordMatches": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`
      },
      {
        role: "user",
        content: `Please analyze and tailor this resume for the following job description:

JOB DESCRIPTION:
${jobDescriptionText}

CURRENT RESUME:
${resumeText}

Provide a comprehensive ATS optimization with detailed analysis.`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  
  // Ensure arrays are properly parsed (OpenAI sometimes returns them as strings)
  const parseArray = (field: any): any[] => {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };
  
  return {
    tailoredResumeText: result.tailoredResumeText || resumeText,
    changes: parseArray(result.changes),
    atsScore: Math.min(100, Math.max(0, result.atsScore || 50)),
    keywordMatches: parseArray(result.keywordMatches),
    missingKeywords: parseArray(result.missingKeywords),
    suggestions: parseArray(result.suggestions)
  };
}

// Main ATS analysis function
export async function processATSAnalysis(
  resumeFile: Express.Multer.File,
  jobDescription?: string,
  jobImageFile?: Express.Multer.File,
  userId?: number
) {
  try {
    // Extract resume text
    const resumeText = await extractTextFromResume(resumeFile);
    
    // Extract job description text
    let jobDescriptionText = jobDescription || '';
    if (jobImageFile && !jobDescriptionText) {
      jobDescriptionText = await extractTextFromImage(jobImageFile.buffer);
    }
    
    if (!jobDescriptionText.trim()) {
      throw new Error('No job description provided');
    }
    
    // Analyze and tailor the resume
    const analysis = await analyzeAndTailorResume(resumeText, jobDescriptionText);
    
    // Save to database
    const analysisId = uuidv4();
    // Debug: Log the data types being saved
    console.log('Analysis data types:', {
      changes: typeof analysis.changes,
      keywordMatches: typeof analysis.keywordMatches,
      missingKeywords: typeof analysis.missingKeywords,
      suggestions: typeof analysis.suggestions
    });
    console.log('Analysis data values:', {
      changes: analysis.changes,
      keywordMatches: analysis.keywordMatches
    });
    
    const analysisData = {
      id: analysisId,
      userId: userId || null,
      originalResumeText: resumeText,
      jobDescriptionText: jobDescriptionText,
      tailoredResumeText: analysis.tailoredResumeText,
      changes: analysis.changes,
      atsScore: analysis.atsScore,
      keywordMatches: analysis.keywordMatches,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions
    };
    
    // Save to database - use proper JSONB format
    try {
      await db.insert(resumeAnalyses).values(analysisData);
      console.log('Successfully saved analysis to database');
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue without failing the entire request
      console.log('Analysis completed successfully, but database save failed');
    }
    
    return {
      id: analysisId,
      ...analysis
    };
    
  } catch (error) {
    console.error('ATS Analysis Error:', error);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}