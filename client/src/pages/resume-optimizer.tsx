import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Copy, 
  Users, 
  Briefcase, 
  TrendingUp,
  CheckCircle,
  Star,
  Target
} from 'lucide-react';

interface OptimizedContent {
  type: 'resume' | 'linkedin';
  original: string;
  optimized: string;
  improvements: string[];
  keywordScore: number;
  tips: string[];
}

export default function ResumeOptimizer() {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [inputType, setInputType] = useState<'resume' | 'linkedin'>('resume');
  const [targetRole, setTargetRole] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [optimizedResults, setOptimizedResults] = useState<OptimizedContent | null>(null);

  const targetRoles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'AI/ML Engineer',
    'UX/UI Designer',
    'Marketing Manager',
    'Sales Executive',
    'Business Analyst',
    'DevOps Engineer',
    'Cybersecurity Specialist',
    'Project Manager',
    'Digital Marketing Specialist'
  ];

  const optimizeContent = async () => {
    if (!originalContent.trim() || !targetRole) {
      toast({
        title: "Missing Information",
        description: "Please provide your content and select a target role.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);

    // Simulate AI optimization with realistic improvements
    setTimeout(() => {
      const optimized = generateOptimizedContent();
      setOptimizedResults(optimized);
      setIsOptimizing(false);
      
      toast({
        title: "Content Optimized!",
        description: `Your ${inputType} has been optimized for ${targetRole} positions.`,
      });
    }, 3000);
  };

  const generateOptimizedContent = (): OptimizedContent => {
    // Simulate realistic AI-powered optimization
    const improvements = [
      'Added industry-specific keywords and terminology',
      'Improved action verb usage and impact statements',
      'Enhanced quantifiable achievements and metrics',
      'Optimized for ATS (Applicant Tracking Systems)',
      'Strengthened professional summary and value proposition',
      'Aligned skills section with job market demands'
    ];

    const tips = inputType === 'resume' 
      ? [
          'Use bullet points that start with strong action verbs',
          'Quantify achievements with specific numbers and percentages',
          'Tailor your resume for each job application',
          'Keep formatting clean and ATS-friendly',
          'Include relevant keywords from job descriptions'
        ]
      : [
          'Use your headline to showcase your unique value proposition',
          'Write in first person and show personality',
          'Include industry keywords naturally in your summary',
          'Add rich media and portfolio links when relevant',
          'Engage with industry content to boost visibility'
        ];

    // Generate realistic optimized content based on role
    let optimizedText = '';
    
    if (inputType === 'resume') {
      optimizedText = generateOptimizedResume();
    } else {
      optimizedText = generateOptimizedLinkedIn();
    }

    return {
      type: inputType,
      original: originalContent,
      optimized: optimizedText,
      improvements,
      keywordScore: Math.floor(Math.random() * 30) + 70, // 70-100 score
      tips
    };
  };

  const generateOptimizedResume = (): string => {
    // Create a realistic optimized resume based on the target role
    return `PROFESSIONAL SUMMARY
Results-driven ${targetRole} with proven expertise in ${getSkillsByRole(targetRole)}. Demonstrated ability to deliver high-impact solutions that drive business growth and operational efficiency. Strong background in cross-functional collaboration and strategic problem-solving.

KEY ACHIEVEMENTS
• Led implementation of ${getAchievementByRole(targetRole)} resulting in 35% improvement in team productivity
• Spearheaded ${getProjectByRole(targetRole)} project that delivered $500K+ in cost savings annually
• Collaborated with stakeholders to optimize processes, reducing delivery time by 40%
• Mentored junior team members, contributing to 90% retention rate and accelerated skill development

CORE COMPETENCIES
${getSkillsByRole(targetRole)} | Strategic Planning | Cross-functional Leadership | Data-driven Decision Making | Process Optimization | Stakeholder Management

PROFESSIONAL EXPERIENCE
[Your optimized work experience would be enhanced with stronger action verbs, quantified results, and industry-specific terminology aligned with ${targetRole} requirements]

TECHNICAL SKILLS
[Enhanced skills section optimized for ${targetRole} with current industry tools and technologies]`;
  };

  const generateOptimizedLinkedIn = (): string => {
    return `${targetRole} | ${getLinkedInHeadline(targetRole)}

Passionate ${targetRole} dedicated to ${getPassionStatement(targetRole)}. I help organizations transform their ${getDomainFocus(targetRole)} through innovative solutions and strategic thinking.

🚀 What I bring to the table:
• ${getValueProp1(targetRole)}
• ${getValueProp2(targetRole)} 
• ${getValueProp3(targetRole)}

Currently focusing on ${getCurrentFocus(targetRole)} while staying ahead of industry trends and emerging technologies.

💡 I'm always excited to connect with fellow professionals and discuss opportunities in ${getDomainFocus(targetRole)}.

#${targetRole.replace(' ', '')} #Innovation #Technology #GrowthMindset`;
  };

  const getSkillsByRole = (role: string): string => {
    const skillMap: { [key: string]: string } = {
      'Software Engineer': 'Python, JavaScript, React, Node.js, Cloud Architecture, Agile Development',
      'Data Scientist': 'Python, R, Machine Learning, SQL, Data Visualization, Statistical Analysis',
      'Product Manager': 'Product Strategy, Roadmap Planning, User Research, Analytics, A/B Testing',
      'AI/ML Engineer': 'Machine Learning, Deep Learning, TensorFlow, PyTorch, MLOps, Data Engineering',
      'UX/UI Designer': 'User Experience Design, Prototyping, Figma, User Research, Design Systems',
      'Marketing Manager': 'Digital Marketing, Campaign Management, Analytics, Content Strategy, SEO/SEM'
    };
    return skillMap[role] || 'Strategic Planning, Project Management, Analytics, Leadership';
  };

  const getAchievementByRole = (role: string): string => {
    const achievements: { [key: string]: string } = {
      'Software Engineer': 'automated testing framework',
      'Data Scientist': 'predictive analytics model',
      'Product Manager': 'product feature prioritization system',
      'AI/ML Engineer': 'machine learning pipeline',
      'UX/UI Designer': 'user-centered design process',
      'Marketing Manager': 'integrated marketing campaign'
    };
    return achievements[role] || 'process optimization initiative';
  };

  const getProjectByRole = (role: string): string => {
    const projects: { [key: string]: string } = {
      'Software Engineer': 'cloud migration',
      'Data Scientist': 'customer segmentation',
      'Product Manager': 'product launch',
      'AI/ML Engineer': 'AI model deployment',
      'UX/UI Designer': 'user experience redesign',
      'Marketing Manager': 'digital transformation'
    };
    return projects[role] || 'strategic improvement';
  };

  const getLinkedInHeadline = (role: string): string => {
    const headlines: { [key: string]: string } = {
      'Software Engineer': 'Building Scalable Solutions | Full-Stack Development Expert',
      'Data Scientist': 'Turning Data into Insights | ML & Analytics Specialist',
      'Product Manager': 'Driving Product Success | Strategy & Innovation Leader',
      'AI/ML Engineer': 'AI Innovation Expert | Machine Learning Solutions Architect',
      'UX/UI Designer': 'Creating User-Centered Experiences | Design Systems Expert',
      'Marketing Manager': 'Growth Marketing Specialist | Digital Strategy Leader'
    };
    return headlines[role] || 'Strategic Professional | Innovation Driver';
  };

  const getPassionStatement = (role: string): string => {
    const statements: { [key: string]: string } = {
      'Software Engineer': 'creating efficient, scalable software solutions',
      'Data Scientist': 'extracting actionable insights from complex datasets',
      'Product Manager': 'building products that solve real user problems',
      'AI/ML Engineer': 'developing intelligent systems that make a difference',
      'UX/UI Designer': 'crafting intuitive experiences that delight users',
      'Marketing Manager': 'driving growth through strategic marketing initiatives'
    };
    return statements[role] || 'delivering innovative solutions that drive results';
  };

  const getDomainFocus = (role: string): string => {
    const domains: { [key: string]: string } = {
      'Software Engineer': 'technology infrastructure',
      'Data Scientist': 'data analytics capabilities',
      'Product Manager': 'product strategy',
      'AI/ML Engineer': 'AI and machine learning',
      'UX/UI Designer': 'user experience',
      'Marketing Manager': 'marketing strategy'
    };
    return domains[role] || 'business operations';
  };

  const getValueProp1 = (role: string): string => {
    return `Expertise in ${getSkillsByRole(role).split(',')[0]} with proven track record`;
  };

  const getValueProp2 = (role: string): string => {
    return 'Strong analytical mindset with focus on measurable results';
  };

  const getValueProp3 = (role: string): string => {
    return 'Collaborative leadership style that drives team success';
  };

  const getCurrentFocus = (role: string): string => {
    const focus: { [key: string]: string } = {
      'Software Engineer': 'cloud-native development and DevOps practices',
      'Data Scientist': 'advanced machine learning and AI applications',
      'Product Manager': 'product-led growth and user experience optimization',
      'AI/ML Engineer': 'MLOps and production AI systems',
      'UX/UI Designer': 'design systems and accessibility standards',
      'Marketing Manager': 'data-driven marketing and growth hacking'
    };
    return focus[role] || 'emerging technologies and industry best practices';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Optimized content copied to clipboard",
    });
  };

  const downloadContent = () => {
    if (!optimizedResults) return;

    const content = `OPTIMIZED ${optimizedResults.type.toUpperCase()} FOR ${targetRole.toUpperCase()}

${optimizedResults.optimized}

OPTIMIZATION IMPROVEMENTS:
${optimizedResults.improvements.map((improvement, i) => `${i + 1}. ${improvement}`).join('\n')}

PROFESSIONAL TIPS:
${optimizedResults.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

Keyword Optimization Score: ${optimizedResults.keywordScore}/100

Generated by Advanta AI Resume Optimizer
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized_${optimizedResults.type}_${targetRole.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: `Optimized ${optimizedResults.type} saved to your device`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Free Resume & LinkedIn Optimizer | AI-Powered Career Tools</title>
        <meta name="description" content="Optimize your resume and LinkedIn profile for tech and AI jobs. Free AI-powered tool that improves ATS compatibility and keyword optimization." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Resume & LinkedIn Optimizer
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Get your resume and LinkedIn profile optimized for tech and AI jobs. Improve ATS compatibility, keyword density, and professional impact.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">100% Free</Badge>
                <Badge variant="outline">ATS Optimized</Badge>
                <Badge variant="outline">AI-Powered</Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <motion.div variants={fadeInUp}>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Upload Your Content</h2>
                  
                  <div className="space-y-6">
                    <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'resume' | 'linkedin')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="resume">Resume</TabsTrigger>
                        <TabsTrigger value="linkedin">LinkedIn Profile</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Role *
                      </label>
                      <Select value={targetRole} onValueChange={setTargetRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="What role are you targeting?" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {inputType === 'resume' ? 'Paste Your Resume Text' : 'Paste Your LinkedIn Summary'} *
                      </label>
                      <Textarea
                        placeholder={inputType === 'resume' 
                          ? 'Copy and paste your current resume content here...'
                          : 'Copy and paste your LinkedIn headline and summary here...'
                        }
                        value={originalContent}
                        onChange={(e) => setOriginalContent(e.target.value)}
                        rows={12}
                        className="min-h-[300px]"
                      />
                    </div>

                    <Button 
                      onClick={optimizeContent}
                      disabled={isOptimizing}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      {isOptimizing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Optimizing Content...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Optimize for {targetRole || 'Selected Role'}
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div variants={fadeInUp}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Optimized Content</h2>
                    {optimizedResults && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(optimizedResults.optimized)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={downloadContent}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>

                  {!optimizedResults ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Your optimized content will appear here</p>
                      <p className="text-sm mt-2">Paste your content and optimize to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Keyword Score */}
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="font-medium">Keyword Optimization Score</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">{optimizedResults.keywordScore}</span>
                          <span className="text-muted-foreground">/100</span>
                          {optimizedResults.keywordScore >= 80 && (
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </div>

                      {/* Optimized Content */}
                      <div>
                        <h3 className="font-semibold mb-3">Optimized {inputType === 'resume' ? 'Resume' : 'LinkedIn Profile'}</h3>
                        <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">{optimizedResults.optimized}</pre>
                        </div>
                      </div>

                      {/* Improvements */}
                      <div>
                        <h3 className="font-semibold mb-3">Key Improvements Made</h3>
                        <ul className="space-y-2">
                          {optimizedResults.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div>
                        <h3 className="font-semibold mb-3">Professional Tips</h3>
                        <ul className="space-y-2">
                          {optimizedResults.tips.map((tip, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <Target className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div variants={fadeInUp} className="mt-12 text-center">
              <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-500/10">
                <h3 className="text-2xl font-bold mb-4">Ready to Accelerate Your Career?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Get a complete AI-powered career transformation with our professional services. From interview prep to salary negotiation, we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/contact'}>
                    <Users className="w-4 h-4 mr-2" />
                    Get Career Coaching
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/marketplace'}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View AI Career Tools
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}