import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { NewHeader } from "@/components/redesign/NewHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  FileText, 
  Image, 
  Target, 
  CheckCircle, 
  Download,
  Eye,
  BarChart3,
  Sparkles,
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";

interface ChangeHighlight {
  type: 'added' | 'removed' | 'modified';
  content: string;
  original?: string;
  suggestion?: string;
}

interface ATSAnalysis {
  id: string;
  originalResumeText: string;
  jobDescriptionText: string;
  tailoredResumeText: string;
  changes: ChangeHighlight[];
  atsScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ATSResumeTailor() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobImageFile, setJobImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  
  const resumeFileRef = useRef<HTMLInputElement>(null);
  const jobImageRef = useRef<HTMLInputElement>(null);

  const handleJobImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setJobImageFile(file);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      setResumeFile(file);
    }
  };

  const processATSAnalysis = async () => {
    if (!resumeFile || (!jobDescription && !jobImageFile)) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      if (jobImageFile) {
        formData.append('jobImage', jobImageFile);
      } else {
        formData.append('jobDescription', jobDescription);
      }

      const response = await fetch('/api/ats/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze resume');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const analysisData: ATSAnalysis = {
          id: result.data.id,
          originalResumeText: result.data.originalResumeText,
          jobDescriptionText: result.data.jobDescriptionText,
          tailoredResumeText: result.data.tailoredResumeText,
          changes: result.data.changes,
          atsScore: result.data.atsScore,
          keywordMatches: result.data.keywordMatches,
          missingKeywords: result.data.missingKeywords,
          suggestions: result.data.suggestions
        };
        setAnalysis(analysisData);
        setCurrentStep(3);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTailoredResume = () => {
    if (!analysis) return;
    
    const blob = new Blob([analysis.tailoredResumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tailored_resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Screenshot Upload */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Upload Screenshot
                  </h3>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => jobImageRef.current?.click()}
                  >
                    {jobImageFile ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-sm font-medium">{jobImageFile.name}</p>
                        <p className="text-xs text-gray-500">Screenshot uploaded successfully</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Image className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm font-medium">Upload job description screenshot</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={jobImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleJobImageUpload}
                    className="hidden"
                  />
                </div>

                {/* OR Divider */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-medium text-gray-600">OR</span>
                    </div>
                    <p className="text-xs text-gray-500">Choose one method</p>
                  </div>
                </div>

                {/* Manual Text Entry */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Paste Text
                  </h3>
                  <Textarea
                    placeholder="Paste the job description text here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!jobDescription && !jobImageFile}
                  className="flex items-center gap-2"
                >
                  Next: Upload Resume
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Your Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => resumeFileRef.current?.click()}
              >
                {resumeFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-lg font-medium">{resumeFile.name}</p>
                    <p className="text-sm text-gray-500">Resume uploaded successfully</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-lg font-medium">Upload your current resume</p>
                    <p className="text-sm text-gray-500">PDF or DOCX files up to 10MB</p>
                    <Button variant="outline" className="mt-4">
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
              <input
                ref={resumeFileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />

              {/* Helper text for requirements */}
              {(!resumeFile || (!jobDescription && !jobImageFile)) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    {!resumeFile ? "Please upload your resume file above." : 
                     "Please go back and upload a job description image or enter job description text."}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  onClick={processATSAnalysis}
                  disabled={!resumeFile || (!jobDescription && !jobImageFile) || isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze & Tailor
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        if (!analysis) return null;
        
        return (
          <div className="space-y-6">
            {/* ATS Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  ATS Compatibility Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">
                    {analysis.atsScore}/100
                  </span>
                  <Badge variant="outline" className={getScoreColor(analysis.atsScore)}>
                    {getScoreLabel(analysis.atsScore)}
                  </Badge>
                </div>
                <Progress value={analysis.atsScore} className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600">Matched Keywords</p>
                    <p className="text-2xl font-bold">{analysis.keywordMatches.length}</p>
                  </div>
                  <div>
                    <p className="font-medium text-red-600">Missing Keywords</p>
                    <p className="text-2xl font-bold">{analysis.missingKeywords.length}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600">Improvements</p>
                    <p className="text-2xl font-bold">{analysis.changes.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tailored Resume */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Your Tailored Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 mb-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-black">
                    {analysis.tailoredResumeText}
                  </pre>
                </div>
                <div className="flex gap-4">
                  <Button onClick={downloadTailoredResume} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Resume
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Analyze Another
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Changes Highlight */}
            {analysis.changes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Changes Made
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.changes.map((change, index) => (
                      <div key={index} className="p-3 rounded-lg border">
                        {change.type === 'added' && (
                          <div>
                            <Badge className="bg-green-100 text-green-800 mb-2">Added</Badge>
                            <p className="text-sm font-medium text-green-700">{change.content}</p>
                          </div>
                        )}
                        {change.type === 'removed' && (
                          <div>
                            <Badge className="bg-red-100 text-red-800 mb-2">Removed</Badge>
                            <p className="text-sm line-through text-red-700">{change.content}</p>
                          </div>
                        )}
                        {change.type === 'modified' && (
                          <div>
                            <Badge className="bg-blue-100 text-blue-800 mb-2">Modified</Badge>
                            {change.original && (
                              <p className="text-sm line-through text-red-700 mb-1">{change.original}</p>
                            )}
                            <p className="text-sm font-medium text-green-700">{change.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Additional Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>ATS Resume Tailor | AI-Powered Resume Optimization Tool</title>
        <meta name="description" content="Upload your resume and job description to get AI-powered ATS optimization. Increase your chances of getting through applicant tracking systems." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  ATS Resume Tailor
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Upload a job description screenshot and your resume to get AI-powered optimization. 
                Increase your ATS score and get past applicant tracking systems.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-blue-500">OCR Powered</Badge>
                <Badge variant="outline">ATS Optimized</Badge>
                <Badge variant="outline">Instant Analysis</Badge>
              </div>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`h-1 w-24 mx-2 ${
                        currentStep > step ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Job Description</span>
                <span>Resume Upload</span>
                <span>Analysis Results</span>
              </div>
            </motion.div>

            {/* Form Steps */}
            <motion.div variants={fadeInUp}>
              {renderStep()}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}