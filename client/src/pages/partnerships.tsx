import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { NewHeader } from '@/components/redesign/NewHeader';
import { Helmet } from 'react-helmet';
import { 
  Upload, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  Star,
  FileText,
  Link as LinkIcon,
  Award,
  Target,
  Handshake
} from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

interface PartnershipFormData {
  email: string;
  automationName: string;
  shortDescription: string;
  problemSolved: string;
  industry: string;
  platform: string[];
  pricingModel: string;
  tags: string;
  automationFile: File | null;
  automationLink: string;
  setupGuide: File | null;
  setupGuideLink: string;
  agreementAccepted: boolean;
  whiteLabelOptIn: boolean;
}

export default function Partnerships() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PartnershipFormData>({
    email: '',
    automationName: '',
    shortDescription: '',
    problemSolved: '',
    industry: '',
    platform: [],
    pricingModel: '',
    tags: '',
    automationFile: null,
    automationLink: '',
    setupGuide: null,
    setupGuideLink: '',
    agreementAccepted: false,
    whiteLabelOptIn: false,
  });

  const industries = [
    'Customer Support',
    'Sales & Marketing', 
    'Finance & Risk',
    'Human Resources',
    'Operations',
    'Cybersecurity',
    'Healthcare',
    'Manufacturing',
    'Legal & Compliance',
    'Retail & E-commerce',
    'Education & Training',
    'Energy & Utilities'
  ];

  const platforms = [
    'Make.com',
    'Zapier',
    'Microsoft Power Automate',
    'Integromat',
    'IFTTT',
    'Custom API',
    'Replit',
    'N8N'
  ];

  const pricingModels = [
    'Free',
    'One-time Purchase',
    'Monthly Subscription',
    'Usage-based',
    'Tiered Pricing',
    'Enterprise Only'
  ];

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platform: checked 
        ? [...prev.platform, platform]
        : prev.platform.filter(p => p !== platform)
    }));
  };

  const handleFileChange = (field: 'automationFile' | 'setupGuide', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreementAccepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept the partnership agreement to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email || !formData.automationName || !formData.shortDescription || !formData.problemSolved) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'platform') {
          submitData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          submitData.append(key, value);
        } else if (typeof value === 'boolean') {
          submitData.append(key, value.toString());
        } else if (value) {
          submitData.append(key, value.toString());
        }
      });

      const response = await fetch('/api/partner-automation-submit', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      toast({
        title: "Submission Successful!",
        description: "Your automation has been submitted for review. We'll contact you within 24-48 hours.",
      });

      // Reset form
      setFormData({
        email: '',
        automationName: '',
        shortDescription: '',
        problemSolved: '',
        industry: '',
        platform: [],
        pricingModel: '',
        tags: '',
        automationFile: null,
        automationLink: '',
        setupGuide: null,
        setupGuideLink: '',
        agreementAccepted: false,
        whiteLabelOptIn: false,
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your automation. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Partner With Us - Earn 90% Revenue | Advanta AI</title>
        <meta name="description" content="Join Advanta AI's partner program and earn 90% revenue from your automation sales. Submit your automations and reach thousands of potential customers." />
        <meta property="og:title" content="Partner With Advanta AI - 90% Revenue Share" />
        <meta property="og:description" content="Monetize your automations with our marketplace. Keep 90% of revenue while we handle marketing, sales, and support." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <NewHeader />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  <Handshake className="w-4 h-4 mr-2" />
                  Partner Program
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Earn <span className="text-primary">90% Revenue.</span><br />
                  We Handle the Rest.
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Turn your automation expertise into a profitable business. Submit your automations to our marketplace 
                  and earn 90% of every sale while we handle marketing, customer support, and payment processing.
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="#submit-automation">Submit Your Automation</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#benefits">Learn More</a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
                Why Publish on Advanta AI?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join a thriving ecosystem of automation experts and grow your business with our comprehensive support.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: DollarSign,
                  title: "90% Revenue Share",
                  description: "Keep 90% of every sale. We only take 10% to cover platform costs and marketing.",
                  color: "text-green-500"
                },
                {
                  icon: Users,
                  title: "Built-in Audience",
                  description: "Access thousands of businesses actively looking for automation solutions.",
                  color: "text-blue-500"
                },
                {
                  icon: TrendingUp,
                  title: "Performance Analytics",
                  description: "Track sales, views, and performance with detailed analytics dashboard.",
                  color: "text-purple-500"
                },
                {
                  icon: Shield,
                  title: "Payment Security",
                  description: "Secure payment processing through Stripe with automated monthly payouts.",
                  color: "text-red-500"
                },
                {
                  icon: Zap,
                  title: "Marketing Support",
                  description: "We promote your automations through our channels, SEO, and paid advertising.",
                  color: "text-yellow-500"
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  description: "Sell to customers worldwide with multi-currency support and localization.",
                  color: "text-cyan-500"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <Card className="h-full border-muted/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                    <CardHeader>
                      <benefit.icon className={`w-12 h-12 ${benefit.color} mb-4`} />
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-16">
                Partner Success Stats
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { number: "500+", label: "Active Partners", icon: Users },
                  { number: "$2.5M+", label: "Partner Revenue", icon: DollarSign },
                  { number: "15k+", label: "Automations Sold", icon: TrendingUp },
                  { number: "98%", label: "Partner Satisfaction", icon: Star }
                ].map((stat, index) => (
                  <motion.div key={index} variants={fadeInUp} className="text-center">
                    <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Submission Form */}
        <section id="submit-automation" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Submit Your Automation
                </h2>
                <p className="text-xl text-muted-foreground">
                  Fill out the form below to get your automation reviewed and published on our marketplace.
                </p>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="border-muted/20">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Automation Details
                    </CardTitle>
                    <CardDescription>
                      Provide information about your automation to help customers understand its value.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your.email@company.com"
                            className="mt-1"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="automationName">Automation Name *</Label>
                          <Input
                            id="automationName"
                            value={formData.automationName}
                            onChange={(e) => setFormData(prev => ({ ...prev, automationName: e.target.value }))}
                            placeholder="e.g., Customer Support AI Assistant"
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="industry">Industry *</Label>
                          <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="shortDescription">Short Description *</Label>
                        <Textarea
                          id="shortDescription"
                          value={formData.shortDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                          placeholder="Brief description of what your automation does..."
                          className="mt-1"
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="problemSolved">Problem Solved *</Label>
                        <Textarea
                          id="problemSolved"
                          value={formData.problemSolved}
                          onChange={(e) => setFormData(prev => ({ ...prev, problemSolved: e.target.value }))}
                          placeholder="Describe the specific business problem your automation solves..."
                          className="mt-1"
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label>Platforms Supported *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                          {platforms.map((platform) => (
                            <div key={platform} className="flex items-center space-x-2">
                              <Checkbox
                                id={platform}
                                checked={formData.platform.includes(platform)}
                                onCheckedChange={(checked) => handlePlatformChange(platform, !!checked)}
                              />
                              <Label htmlFor={platform} className="text-sm">{platform}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="pricingModel">Pricing Model *</Label>
                          <Select value={formData.pricingModel} onValueChange={(value) => setFormData(prev => ({ ...prev, pricingModel: value }))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select pricing model" />
                            </SelectTrigger>
                            <SelectContent>
                              {pricingModels.map((model) => (
                                <SelectItem key={model} value={model}>{model}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="tags">Tags/Keywords</Label>
                          <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="e.g., CRM, automation, customer service"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Files & Links</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="automationFile">Automation File</Label>
                            <Input
                              id="automationFile"
                              type="file"
                              onChange={(e) => handleFileChange('automationFile', e.target.files?.[0] || null)}
                              className="mt-1"
                              accept=".json,.zip,.txt"
                            />
                          </div>

                          <div>
                            <Label htmlFor="automationLink">Or Automation Link</Label>
                            <Input
                              id="automationLink"
                              value={formData.automationLink}
                              onChange={(e) => setFormData(prev => ({ ...prev, automationLink: e.target.value }))}
                              placeholder="https://make.com/..."
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="setupGuide">Setup Guide (Optional)</Label>
                            <Input
                              id="setupGuide"
                              type="file"
                              onChange={(e) => handleFileChange('setupGuide', e.target.files?.[0] || null)}
                              className="mt-1"
                              accept=".pdf,.doc,.docx,.txt"
                            />
                          </div>

                          <div>
                            <Label htmlFor="setupGuideLink">Or Setup Guide Link</Label>
                            <Input
                              id="setupGuideLink"
                              value={formData.setupGuideLink}
                              onChange={(e) => setFormData(prev => ({ ...prev, setupGuideLink: e.target.value }))}
                              placeholder="https://docs.google.com/..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="agreement"
                            checked={formData.agreementAccepted}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreementAccepted: !!checked }))}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="agreement" className="text-sm leading-relaxed cursor-pointer">
                              I agree to the 90/10 revenue split and grant Advanta AI the rights to distribute my automation
                            </Label>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="whiteLabel"
                            checked={formData.whiteLabelOptIn}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whiteLabelOptIn: !!checked }))}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="whiteLabel" className="text-sm leading-relaxed cursor-pointer">
                              Allow white-labeling for enterprise customers (additional revenue opportunity)
                            </Label>
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Submit Automation
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-12">
                Frequently Asked Questions
              </motion.h2>
              
              <div className="space-y-6">
                {[
                  {
                    question: "How do payments work?",
                    answer: "We process payments through Stripe and automatically transfer 90% of your earnings to your account monthly. You'll receive detailed analytics and payment reports."
                  },
                  {
                    question: "What types of automations can I submit?",
                    answer: "We accept automations for any major platform including Make.com, Zapier, Power Automate, and custom APIs. Focus on business value and clear documentation."
                  },
                  {
                    question: "How long does the review process take?",
                    answer: "Most submissions are reviewed within 24-48 hours. We'll contact you with feedback or approval, and help optimize your listing for maximum sales."
                  },
                  {
                    question: "Do you provide marketing support?",
                    answer: "Yes! We actively promote partner automations through our blog, social media, email campaigns, and paid advertising to drive more sales to your listings."
                  }
                ].map((faq, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="border-muted/20">
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}