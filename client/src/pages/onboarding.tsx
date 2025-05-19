import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';

// Possible assistant types
const assistantTypes = [
  {
    id: 'customer-service',
    name: 'Customer Service Assistant',
    description: 'Handles inquiries, resolves issues, and provides support',
    icon: 'headset'
  },
  {
    id: 'sales',
    name: 'Sales Assistant',
    description: 'Qualifies leads, answers product questions, and aids in conversions',
    icon: 'dollar-sign'
  },
  {
    id: 'content',
    name: 'Content Creation Assistant',
    description: 'Generates blog posts, social media content, and marketing copy',
    icon: 'pen-fancy'
  },
  {
    id: 'research',
    name: 'Research Assistant',
    description: 'Analyzes data, compiles information, and generates reports',
    icon: 'magnifying-glass-chart'
  }
];

// Tone options
const toneOptions = [
  { id: 'professional', name: 'Professional', description: 'Formal, business-oriented communication' },
  { id: 'friendly', name: 'Friendly', description: 'Warm, conversational, approachable' },
  { id: 'technical', name: 'Technical', description: 'Detailed, precise, industry-specific' },
  { id: 'casual', name: 'Casual', description: 'Relaxed, colloquial, informal' }
];

// Integration options
const integrationOptions = [
  { name: 'Website Chat Widget', id: 'website' },
  { name: 'Slack', id: 'slack' },
  { name: 'Email', id: 'email' },
  { name: 'Microsoft Teams', id: 'teams' },
  { name: 'Mobile App', id: 'mobile' },
  { name: 'CRM (Salesforce, HubSpot)', id: 'crm' },
  { name: 'WhatsApp', id: 'whatsapp' },
  { name: 'Facebook Messenger', id: 'messenger' }
];

// Knowledge base types
const knowledgeBaseTypes = [
  { name: 'Company Website', id: 'website' },
  { name: 'Product Documentation', id: 'docs' },
  { name: 'FAQ Documents', id: 'faq' },
  { name: 'Support Tickets', id: 'tickets' },
  { name: 'Internal Wiki', id: 'wiki' },
  { name: 'Custom Documents', id: 'custom' },
  { name: 'Training Material', id: 'training' }
];

export default function Onboarding() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    assistantType: '',
    assistantName: '',
    assistantDescription: '',
    tone: '',
    knowledgeBases: [] as string[],
    customInstructions: '',
    integrations: [] as string[],
    responsiveness: 50, // 0-100 scale
    creativityLevel: 50, // 0-100 scale
  });
  
  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Handle checkbox arrays
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    if (checked) {
      updateFormData(field, [...formData[field as keyof typeof formData] as string[], value]);
    } else {
      updateFormData(
        field,
        (formData[field as keyof typeof formData] as string[]).filter(item => item !== value)
      );
    }
  };
  
  // Handle next step
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  // Submit form
  const handleSubmit = () => {
    toast({
      title: "AI Assistant Created",
      description: "Your new AI assistant has been configured and is ready to use.",
    });
    
    // Redirect to dashboard
    setTimeout(() => {
      setLocation('/dashboard');
    }, 1500);
  };
  
  // Calculate progress percentage
  const progressPercentage = (currentStep / 5) * 100;
  
  return (
    <>
      <Helmet>
        <title>AI Assistant Onboarding | Advanta AI</title>
        <meta name="description" content="Create your custom AI assistant in minutes with our step-by-step wizard." />
      </Helmet>
      
      <Header />
      
      <main className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-8 text-center"
          >
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              Create Your <span className="gradient-text">AI Assistant</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow our simple step-by-step process to set up a custom AI assistant tailored to your business needs.
            </motion.p>
          </motion.div>
          
          {/* Progress Bar */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="max-w-3xl mx-auto mb-10"
          >
            <div className="mb-2 flex justify-between text-sm">
              <span>Step {currentStep} of 5</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </motion.div>
          
          {/* Step Content */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="max-w-3xl mx-auto"
          >
            <Card className="p-6 bg-muted border-border">
              {/* Step 1: Choose Assistant Type */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Choose Assistant Type</h2>
                  <p className="text-muted-foreground mb-6">
                    Select the type of AI assistant that best matches your business needs.
                  </p>
                  
                  <RadioGroup 
                    value={formData.assistantType} 
                    onValueChange={(value) => updateFormData('assistantType', value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                  >
                    {assistantTypes.map((type) => (
                      <div key={type.id} className="relative">
                        <RadioGroupItem
                          value={type.id}
                          id={type.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={type.id}
                          className="flex flex-col h-full p-6 bg-background hover:bg-background/70 border border-border rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                        >
                          <div className="mb-4 h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <i className={`fas fa-${type.icon} text-primary text-xl`}></i>
                          </div>
                          <span className="text-lg font-bold text-white">{type.name}</span>
                          <span className="text-sm text-muted-foreground mt-2">{type.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleNextStep}
                      disabled={!formData.assistantType}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Basic Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
                  <p className="text-muted-foreground mb-6">
                    Provide essential details about your AI assistant.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="assistant-name">Assistant Name</Label>
                      <Input 
                        id="assistant-name"
                        placeholder="e.g., SalesBot, Support Assistant, etc."
                        value={formData.assistantName}
                        onChange={(e) => updateFormData('assistantName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="assistant-description">Description</Label>
                      <Textarea 
                        id="assistant-description"
                        placeholder="What is the purpose of this assistant? What tasks will it handle?"
                        value={formData.assistantDescription}
                        onChange={(e) => updateFormData('assistantDescription', e.target.value)}
                        className="mt-1 h-24"
                      />
                    </div>
                    
                    <div>
                      <Label>Communication Tone</Label>
                      <RadioGroup 
                        value={formData.tone} 
                        onValueChange={(value) => updateFormData('tone', value)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                      >
                        {toneOptions.map((tone) => (
                          <div key={tone.id} className="relative">
                            <RadioGroupItem
                              value={tone.id}
                              id={tone.id}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={tone.id}
                              className="flex flex-col h-full p-3 bg-background hover:bg-background/70 border border-border rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                            >
                              <span className="font-medium">{tone.name}</span>
                              <span className="text-xs text-muted-foreground mt-1">{tone.description}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      disabled={!formData.assistantName || !formData.tone}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Knowledge Base */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Knowledge Base</h2>
                  <p className="text-muted-foreground mb-6">
                    Select sources of information your AI assistant should use to provide accurate responses.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base mb-2 block">Information Sources</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {knowledgeBaseTypes.map((source) => (
                          <div key={source.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={`kb-${source.id}`}
                              checked={formData.knowledgeBases.includes(source.id)}
                              onCheckedChange={(checked) => {
                                handleCheckboxChange('knowledgeBases', source.id, checked as boolean);
                              }}
                            />
                            <Label 
                              htmlFor={`kb-${source.id}`}
                              className="font-normal text-sm cursor-pointer"
                            >
                              {source.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="bg-background p-4 rounded-md border border-dashed border-border">
                        <div className="text-center py-8">
                          <i className="fas fa-cloud-upload-alt text-3xl text-muted-foreground mb-3"></i>
                          <p className="mb-2">Upload knowledge base documents</p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Drag and drop files here, or click to browse
                          </p>
                          <Button variant="outline" size="sm">
                            <i className="fas fa-folder-open mr-2"></i>
                            Browse Files
                          </Button>
                          <p className="text-xs text-muted-foreground mt-3">
                            Accepts PDF, DOCX, TXT, CSV, and more (max 50MB)
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-instructions">Custom Instructions</Label>
                      <Textarea 
                        id="custom-instructions"
                        placeholder="Add specific instructions, guidelines, or information for your AI assistant..."
                        value={formData.customInstructions}
                        onChange={(e) => updateFormData('customInstructions', e.target.value)}
                        className="mt-1 h-24"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      disabled={formData.knowledgeBases.length === 0}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 4: Integrations */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Integrations & Deployment</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose where and how your AI assistant will be available to users.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base mb-2 block">Integration Channels</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {integrationOptions.map((integration) => (
                          <div key={integration.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={`int-${integration.id}`}
                              checked={formData.integrations.includes(integration.id)}
                              onCheckedChange={(checked) => {
                                handleCheckboxChange('integrations', integration.id, checked as boolean);
                              }}
                            />
                            <Label 
                              htmlFor={`int-${integration.id}`}
                              className="font-normal text-sm cursor-pointer"
                            >
                              {integration.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Response Style Configuration</Label>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Response Speed</span>
                          <span>
                            {formData.responsiveness < 33 ? 'Thoughtful' : 
                             formData.responsiveness < 66 ? 'Balanced' : 'Fast'}
                          </span>
                        </div>
                        <Slider
                          value={[formData.responsiveness]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => updateFormData('responsiveness', value[0])}
                          className="mb-6"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>More careful, detailed answers</span>
                          <span>Faster, concise responses</span>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Creativity Level</span>
                          <span>
                            {formData.creativityLevel < 33 ? 'Conservative' : 
                             formData.creativityLevel < 66 ? 'Balanced' : 'Creative'}
                          </span>
                        </div>
                        <Slider
                          value={[formData.creativityLevel]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => updateFormData('creativityLevel', value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Stick closely to facts</span>
                          <span>Allow more creative responses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      disabled={formData.integrations.length === 0}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 5: Review & Finalize */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Review & Finalize</h2>
                  <p className="text-muted-foreground mb-6">
                    Review your AI assistant settings before creating it.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-background rounded-md border border-border">
                      <h3 className="font-medium mb-3">Assistant Details</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">
                            {assistantTypes.find(t => t.id === formData.assistantType)?.name || 'Custom'}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{formData.assistantName}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Tone:</span>
                          <span className="font-medium capitalize">
                            {toneOptions.find(t => t.id === formData.tone)?.name || 'Standard'}
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-background rounded-md border border-border">
                      <h3 className="font-medium mb-3">Knowledge Sources</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.knowledgeBases.map((kb) => (
                          <div key={kb} className="px-2 py-1 bg-muted rounded-md text-sm">
                            {knowledgeBaseTypes.find(t => t.id === kb)?.name || kb}
                          </div>
                        ))}
                      </div>
                      
                      {formData.customInstructions && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Custom Instructions:</h4>
                          <p className="text-sm text-muted-foreground">
                            {formData.customInstructions.substring(0, 120)}
                            {formData.customInstructions.length > 120 ? '...' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-background rounded-md border border-border">
                      <h3 className="font-medium mb-3">Deployment</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.integrations.map((int) => (
                          <div key={int} className="px-2 py-1 bg-muted rounded-md text-sm">
                            {integrationOptions.find(t => t.id === int)?.name || int}
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Response Style:</span>
                            <span>
                              {formData.responsiveness < 33 ? 'Thoughtful' : 
                               formData.responsiveness < 66 ? 'Balanced' : 'Fast'}
                            </span>
                          </div>
                          <Progress value={formData.responsiveness} className="h-1.5" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Creativity Level:</span>
                            <span>
                              {formData.creativityLevel < 33 ? 'Conservative' : 
                               formData.creativityLevel < 66 ? 'Balanced' : 'Creative'}
                            </span>
                          </div>
                          <Progress value={formData.creativityLevel} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-primary/10 border border-primary/30 rounded-md p-4 text-sm">
                      <div className="flex items-start gap-3">
                        <i className="fas fa-info-circle text-primary mt-0.5"></i>
                        <div>
                          <p>
                            Your AI assistant will be created with these settings. You can always modify them later
                            from your dashboard.
                          </p>
                          <p className="mt-2">
                            Initial training may take 15-30 minutes depending on the amount of knowledge base data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Back
                    </Button>
                    <Button onClick={handleSubmit}>
                      Create Assistant
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}