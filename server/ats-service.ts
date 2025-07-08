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
      file.mimetype.includes('word')
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
      // Dynamic import to prevent startup issues
      const pdfParseModule = await import('pdf-parse');
      const pdfParse = pdfParseModule.default || pdfParseModule;
      
      // If pdfParse is still not a function, fallback
      if (typeof pdfParse !== 'function') {
        throw new Error('PDF parsing library not available');
      }
      
      const data = await pdfParse(buffer);
      return data.text || 'Unable to extract text from PDF. Please try a Word document.';
    } catch (error) {
      console.error('PDF parsing error:', error);
      // Return a more helpful error message
      throw new Error('PDF text extraction failed. Please try uploading your resume as a Word document (.docx) instead.');
    }
  } else if (file.mimetype.includes('document') || file.mimetype.includes('word')) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error('Word document parsing failed. Please try a different file format.');
    }
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or Word document.');
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
  
  return {
    tailoredResumeText: result.tailoredResumeText || resumeText,
    changes: result.changes || [],
    atsScore: Math.min(100, Math.max(0, result.atsScore || 50)),
    keywordMatches: result.keywordMatches || [],
    missingKeywords: result.missingKeywords || [],
    suggestions: result.suggestions || []
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
    const analysisData = {
      id: analysisId,
      userId: userId || null,
      originalResumeText: resumeText,
      jobDescriptionText: jobDescriptionText,
      tailoredResumeText: analysis.tailoredResumeText,
      changes: JSON.stringify(analysis.changes),
      atsScore: analysis.atsScore,
      keywordMatches: JSON.stringify(analysis.keywordMatches),
      missingKeywords: JSON.stringify(analysis.missingKeywords),
      suggestions: JSON.stringify(analysis.suggestions)
    };
    
    await db.insert(resumeAnalyses).values(analysisData);
    
    return {
      id: analysisId,
      ...analysis
    };
    
  } catch (error) {
    console.error('ATS Analysis Error:', error);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}