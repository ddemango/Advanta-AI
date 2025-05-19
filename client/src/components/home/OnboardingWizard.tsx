import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientText } from '@/components/ui/gradient-text';
import { DigitalRain } from '@/components/ui/digital-rain';
import { AIBrain } from '@/components/ui/ai-brain';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

interface StepProps {
  onNext: () => void;
  onPrev?: () => void;
}

// Step 1: Choose industry + use case
const Step1 = ({ onNext }: StepProps) => {
  const [industry, setIndustry] = useState<string>('');
  const [useCase, setUseCase] = useState<string>('');
  
  const industries = [
    'Real Estate', 'eCommerce', 'Healthcare', 'Legal', 'Education',
    'Finance', 'Marketing', 'Manufacturing', 'Technology', 'Other'
  ];
  
  const useCases = [
    'Customer Support', 'Lead Generation', 'Content Creation',
    'Internal Knowledge Base', 'Process Automation', 'Data Analysis'
  ];
  
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Choose Your Industry & Use Case</h3>
        <p className="text-gray-300">We'll customize your AI solution based on your specific needs.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <Label htmlFor="industry" className="block mb-2">Industry</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((item, index) => (
                <SelectItem key={index} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="useCase" className="block mb-2">Primary Use Case</Label>
          <Select value={useCase} onValueChange={setUseCase}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select main use case" />
            </SelectTrigger>
            <SelectContent>
              {useCases.map((item, index) => (
                <SelectItem key={index} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 border border-primary/30 rounded-lg bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
          <div className="text-2xl mb-2 text-primary">
            <i className="fas fa-robot"></i>
          </div>
          <div className="text-sm">Chatbot</div>
        </div>
        <div className="text-center p-4 border border-white/10 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="text-2xl mb-2">
            <i className="fas fa-brain"></i>
          </div>
          <div className="text-sm">Knowledge Base</div>
        </div>
        <div className="text-center p-4 border border-white/10 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="text-2xl mb-2">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="text-sm">Content Generator</div>
        </div>
        <div className="text-center p-4 border border-white/10 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="text-2xl mb-2">
            <i className="fas fa-cogs"></i>
          </div>
          <div className="text-sm">Workflow Bot</div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!industry || !useCase}>
          Next Step <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>
    </div>
  );
};

// Step 2: Upload docs (PDFs, CSVs, URLs)
const Step2 = ({ onNext, onPrev }: StepProps) => {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Upload Your Data</h3>
        <p className="text-gray-300">Train your AI assistant on your business data for more accurate responses.</p>
      </div>
      
      <div className="mb-8">
        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
          <div className="text-4xl mb-4 text-gray-300">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <h4 className="text-xl font-medium mb-2">Drag & Drop Files Here</h4>
          <p className="text-gray-400 mb-4">Upload PDFs, CSVs, Word docs, or text files</p>
          <Button variant="outline" size="sm">
            Browse Files
          </Button>
          <input type="file" className="hidden" multiple />
        </div>
      </div>
      
      <div className="mb-8">
        <Label htmlFor="website" className="block mb-2">Website URLs (Optional)</Label>
        <Input id="website" placeholder="https://your-website.com" className="mb-2" />
        <p className="text-xs text-gray-400">We'll scrape content from these URLs to train your AI assistant.</p>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <i className="fas fa-arrow-left mr-2"></i> Previous
        </Button>
        <Button onClick={onNext}>
          Next Step <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>
    </div>
  );
};

// Step 3: Select integrations
const Step3 = ({ onNext, onPrev }: StepProps) => {
  const integrations = [
    { name: 'Salesforce', icon: 'fab fa-salesforce', connected: false },
    { name: 'HubSpot', icon: 'fab fa-hubspot', connected: false },
    { name: 'Zendesk', icon: 'fas fa-headset', connected: false },
    { name: 'Shopify', icon: 'fab fa-shopify', connected: false },
    { name: 'Slack', icon: 'fab fa-slack', connected: true },
    { name: 'Google Analytics', icon: 'fab fa-google', connected: false },
    { name: 'Zapier', icon: 'fas fa-plug', connected: false },
    { name: 'API Connection', icon: 'fas fa-code', connected: false },
  ];
  
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Select Integrations</h3>
        <p className="text-gray-300">Connect your AI assistant to your existing tools and platforms.</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {integrations.map((integration, index) => (
          <div 
            key={index}
            className={`text-center p-4 rounded-lg cursor-pointer transition-colors ${
              integration.connected 
                ? 'border border-primary bg-primary/10' 
                : 'border border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="text-2xl mb-2">
              <i className={integration.icon}></i>
            </div>
            <div className="text-sm mb-2">{integration.name}</div>
            <div className="text-xs text-gray-400">
              {integration.connected ? 'Connected' : 'Connect'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <i className="fas fa-arrow-left mr-2"></i> Previous
        </Button>
        <Button onClick={onNext}>
          Next Step <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>
    </div>
  );
};

// Step 4: Preview assistant
const Step4 = ({ onNext, onPrev }: StepProps) => {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Preview Your AI Assistant</h3>
        <p className="text-gray-300">Customize appearance and test your AI assistant before deployment.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="mb-6">
            <Label htmlFor="assistantName" className="block mb-2">Assistant Name</Label>
            <Input id="assistantName" placeholder="e.g., SalesBot, SupportAI" defaultValue="Advanta Assistant" />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="welcomeMessage" className="block mb-2">Welcome Message</Label>
            <Textarea 
              id="welcomeMessage" 
              placeholder="Hi there! How can I help you today?" 
              defaultValue="Hello! I'm your AI assistant. How can I help you today?" 
              rows={3} 
            />
          </div>
          
          <div className="mb-6">
            <Label className="block mb-2">Assistant Avatar</Label>
            <div className="flex space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                <i className="fas fa-robot"></i>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white border-2 border-white">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                <i className="fas fa-plus"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden h-80">
          <div className="h-10 bg-black/60 flex items-center px-4 border-b border-white/10">
            <div className="text-sm font-medium">Assistant Preview</div>
          </div>
          <div className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto">
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white mr-3 flex-shrink-0">
                <i className="fas fa-user-circle text-sm"></i>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-sm">Hello! I'm your AI assistant. How can I help you today?</p>
              </div>
            </div>
            
            <div className="flex items-start mb-4 justify-end">
              <div className="bg-primary/20 rounded-lg p-3">
                <p className="text-sm">What services do you offer?</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary ml-3 flex-shrink-0">
                <i className="fas fa-user text-sm"></i>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white mr-3 flex-shrink-0">
                <i className="fas fa-user-circle text-sm"></i>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-sm">We offer a range of services including custom AI development, chatbot creation, and data analytics solutions. Would you like to learn more about any specific service?</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <i className="fas fa-arrow-left mr-2"></i> Previous
        </Button>
        <Button onClick={onNext}>
          Next Step <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>
    </div>
  );
};

// Step 5: Launch or schedule call
const Step5 = ({ onPrev }: StepProps) => {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
          <i className="fas fa-check text-4xl text-primary"></i>
        </div>
        <h3 className="text-2xl font-bold mb-2">Ready to Launch Your AI Solution</h3>
        <p className="text-gray-300">Choose how you'd like to proceed with your custom AI deployment.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer">
          <div className="text-3xl text-primary mb-4">
            <i className="fas fa-rocket"></i>
          </div>
          <h4 className="text-xl font-bold mb-2">Deploy Now</h4>
          <p className="text-gray-300 mb-4">
            Get your AI solution up and running immediately with our automated setup.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <i className="fas fa-check text-primary mr-2"></i>
              <span className="text-sm">Deploy within 24-48 hours</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-check text-primary mr-2"></i>
              <span className="text-sm">Standard implementation</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-check text-primary mr-2"></i>
              <span className="text-sm">Email support</span>
            </li>
          </ul>
          <Button className="w-full">Deploy Now</Button>
        </div>
        
        <div className="bg-primary/5 backdrop-blur-sm border border-primary/30 rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer">
          <div className="text-3xl text-primary mb-4">
            <i className="fas fa-calendar-check"></i>
          </div>
          <h4 className="text-xl font-bold mb-2">Schedule Strategy Call</h4>
          <p className="text-gray-300 mb-4">
            Get personalized guidance from our AI experts for your implementation.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <i className="fas fa-check text-primary mr-2"></i>
              <span className="text-sm">Customized implementation plan</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-check text-primary mr-2"></i>
              <span className="text-sm">1-hour strategy session</span>
            </li>
            <li className="flex items-center">
              <i className="fas fa-check text-primary mr-2"></i>
              <span className="text-sm">Priority support</span>
            </li>
          </ul>
          <Button className="w-full">Schedule Call</Button>
        </div>
      </div>
      
      <div className="flex justify-start">
        <Button variant="outline" onClick={onPrev}>
          <i className="fas fa-arrow-left mr-2"></i> Previous
        </Button>
      </div>
    </div>
  );
};

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const steps = [
    <Step1 key={1} onNext={handleNext} />,
    <Step2 key={2} onNext={handleNext} onPrev={handlePrev} />,
    <Step3 key={3} onNext={handleNext} onPrev={handlePrev} />,
    <Step4 key={4} onNext={handleNext} onPrev={handlePrev} />,
    <Step5 key={5} onPrev={handlePrev} />
  ];

  return (
    <section id="onboarding" className="py-20 bg-background relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 z-0">
          <AIBrain />
        </div>
        <div className="absolute inset-0 opacity-30 z-0">
          <DigitalRain />
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Build Your <GradientText>AI Solution</GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow our simple step-by-step process to create your custom AI assistant
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard>
            <div className="p-8">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {[...Array(totalSteps)].map((_, index) => (
                    <div 
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep > index + 1 
                          ? 'bg-primary text-white' 
                          : currentStep === index + 1 
                            ? 'bg-primary/20 text-primary border border-primary' 
                            : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {currentStep > index + 1 ? (
                        <i className="fas fa-check text-xs"></i>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Current step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {steps[currentStep - 1]}
                </motion.div>
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}