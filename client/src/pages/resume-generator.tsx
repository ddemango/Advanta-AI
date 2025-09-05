import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Sparkles, User, Briefcase, GraduationCap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { NewHeader } from "@/components/redesign/NewHeader";
import { Helmet } from "react-helmet";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
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

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    website: string;
  };
  professionalSummary: string;
  targetRole: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
  certifications: string[];
}

const INDUSTRY_TEMPLATES = {
  'software-engineer': 'Software Engineer',
  'data-scientist': 'Data Scientist',
  'product-manager': 'Product Manager',
  'marketing-manager': 'Marketing Manager',
  'sales-representative': 'Sales Representative',
  'business-analyst': 'Business Analyst',
  'project-manager': 'Project Manager',
  'ux-designer': 'UX/UI Designer',
  'financial-analyst': 'Financial Analyst',
  'operations-manager': 'Operations Manager'
};

export default function ResumeGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      website: ''
    },
    professionalSummary: '',
    targetRole: '',
    experience: [{ company: '', position: '', duration: '', achievements: [''] }],
    education: [{ institution: '', degree: '', year: '' }],
    skills: [],
    certifications: []
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleExperienceChange = (index: number, field: string, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '', achievements: [''] }]
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '' }]
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate a professional, ATS-optimized resume based on this information:

Personal Information:
- Name: ${resumeData.personalInfo.fullName}
- Email: ${resumeData.personalInfo.email}
- Phone: ${resumeData.personalInfo.phone}
- Location: ${resumeData.personalInfo.location}
- LinkedIn: ${resumeData.personalInfo.linkedIn}
- Website: ${resumeData.personalInfo.website}

Target Role: ${resumeData.targetRole}
Professional Summary: ${resumeData.professionalSummary}

Experience:
${resumeData.experience.map(exp => `
- ${exp.position} at ${exp.company} (${exp.duration})
  Achievements: ${exp.achievements.join(', ')}`).join('\n')}

Education:
${resumeData.education.map(edu => `- ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n')}

Skills: ${resumeData.skills.join(', ')}
Certifications: ${resumeData.certifications.join(', ')}

Please create a professional resume with proper formatting, strong action verbs, quantified achievements, and ATS-friendly structure. Include relevant keywords for the target role.`,
          type: 'resume_generation'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Raw API response:', data.response);
        
        // Clean up markdown formatting if present
        let cleanedResume = data.response;
        if (cleanedResume.startsWith('```plaintext\n')) {
          cleanedResume = cleanedResume.replace(/^```plaintext\n/, '');
        }
        if (cleanedResume.startsWith('```\n')) {
          cleanedResume = cleanedResume.replace(/^```\n/, '');
        }
        if (cleanedResume.endsWith('\n```')) {
          cleanedResume = cleanedResume.replace(/\n```$/, '');
        }
        if (cleanedResume.endsWith('```')) {
          cleanedResume = cleanedResume.replace(/```$/, '');
        }
        
        console.log('Cleaned resume:', cleanedResume);
        console.log('Setting current step to 4');
        setGeneratedResume(cleanedResume);
        setCurrentStep(4);
      } else {
        throw new Error('Failed to generate resume');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResume = () => {
    const blob = new Blob([generatedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    placeholder="john.doe@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={resumeData.personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                  <Input
                    value={resumeData.personalInfo.linkedIn}
                    onChange={(e) => handlePersonalInfoChange('linkedIn', e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website/Portfolio</label>
                  <Input
                    value={resumeData.personalInfo.website}
                    onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                    placeholder="johndoe.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Role *</label>
                <Select onValueChange={(value) => setResumeData(prev => ({ ...prev, targetRole: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INDUSTRY_TEMPLATES).map(([key, label]) => (
                      <SelectItem key={key} value={label}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Professional Summary</label>
                <Textarea
                  value={resumeData.professionalSummary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, professionalSummary: e.target.value }))}
                  placeholder="Brief overview of your professional background and career objectives..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <Input
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Position</label>
                      <Input
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <Input
                      value={exp.duration}
                      onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                      placeholder="Jan 2020 - Present"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Key Achievements</label>
                    <Textarea
                      value={exp.achievements.join('\n')}
                      onChange={(e) => handleExperienceChange(index, 'achievements', e.target.value.split('\n'))}
                      placeholder="• Led team of 5 developers&#10;• Increased efficiency by 30%&#10;• Managed $1M budget"
                      rows={4}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addExperience} variant="outline" className="w-full">
                Add Another Position
              </Button>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education & Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Institution</label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          placeholder="University Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Year</label>
                        <Input
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                          placeholder="2020"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={addEducation} variant="outline" className="w-full mb-6">
                  Add Education
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resumeData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer"
                           onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addSkill((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <Button onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addSkill(input.value);
                    input.value = '';
                  }}>
                    Add
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                <Textarea
                  value={resumeData.certifications.join('\n')}
                  onChange={(e) => setResumeData(prev => ({ 
                    ...prev, 
                    certifications: e.target.value.split('\n').filter(cert => cert.trim()) 
                  }))}
                  placeholder="AWS Certified Developer&#10;Google Analytics Certified&#10;PMP Certification"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        console.log('Rendering step 4, generatedResume length:', generatedResume.length);
        console.log('Resume content preview:', generatedResume.substring(0, 100));
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Your Generated Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-6 min-h-[400px] border">
                <pre className="whitespace-pre-wrap text-sm font-mono text-black dark:text-white">
                  {generatedResume || 'No resume content available'}
                </pre>
              </div>
              <div className="flex gap-4">
                <Button onClick={downloadResume} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Resume
                </Button>
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Create Another Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Free AI Resume Generator | Professional Resume Builder</title>
        <meta name="description" content="Create professional, ATS-optimized resumes with AI. Free resume generator with industry templates, keyword optimization, and instant download." />
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
                <FileText className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  AI Resume Generator
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Create professional, ATS-optimized resumes that get you noticed. Our AI analyzes job requirements and crafts compelling resumes tailored to your target role.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">100% Free</Badge>
                <Badge variant="outline">ATS Optimized</Badge>
                <Badge variant="outline">Industry Templates</Badge>
              </div>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 4 && (
                      <div className={`h-1 w-24 mx-2 ${
                        currentStep > step ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Personal Info</span>
                <span>Experience</span>
                <span>Education</span>
                <span>Generated</span>
              </div>
            </motion.div>

            {/* Form Steps */}
            <motion.div variants={fadeInUp}>
              {renderStep()}
            </motion.div>

            {/* Navigation */}
            <motion.div variants={fadeInUp} className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 && (!resumeData.personalInfo.fullName || !resumeData.personalInfo.email || !resumeData.targetRole)}
                  className="flex items-center gap-2"
                >
                  Next
                </Button>
              ) : currentStep === 3 ? (
                <Button
                  onClick={generateResume}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Resume
                    </>
                  )}
                </Button>
              ) : null}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}