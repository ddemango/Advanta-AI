import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';

// Service type options
const serviceTypes = [
  {
    id: 'chatbot',
    name: 'Chatbot Development',
    description: 'Automate customer conversations on your website, social media, or app using smart AI chatbots.',
    basePrice: 1500,
    icon: 'robot'
  },
  {
    id: 'consulting',
    name: 'AI Consulting',
    description: 'Get expert guidance on how to use AI to grow your business, improve efficiency, or explore new technology.',
    basePrice: 2000,
    icon: 'lightbulb'
  },
  {
    id: 'integration',
    name: 'Custom AI Integration',
    description: 'Connect AI tools to your existing systems like CRMs, apps, or databases.',
    basePrice: 2500,
    icon: 'plug'
  }
];

// Plan options
const planOptions = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'For startups and small projects. Includes essential features to get you started.',
    multiplier: 1,
    icon: 'layer-group'
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    description: 'For growing businesses. Offers more customization, integrations, and performance tuning.',
    multiplier: 1.75,
    icon: 'cubes'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    description: 'For enterprise or high-demand solutions. Full-featured setup with custom AI, integrations, and long-term support.',
    multiplier: 2.5,
    icon: 'gem'
  }
];

// Additional features
const additionalFeatures = [
  {
    id: 'multi-language',
    name: 'Multi-language Support',
    description: 'Reach customers in multiple languages using smart, real-time translation.',
    price: 500
  },
  {
    id: 'custom-integrations',
    name: 'Custom Integrations',
    description: 'Connect AI to platforms like Shopify, Salesforce, Slack, or your CRM.',
    price: 750
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Monitor AI performance through a personalized dashboard with actionable insights.',
    price: 600
  },
  {
    id: 'voice',
    name: 'Voice Interface Support',
    description: 'Enable your chatbot or AI system to interact via voice for smart assistants or phone bots.',
    price: 800
  },
  {
    id: 'custom-data',
    name: 'AI Training on Custom Data',
    description: 'Upload your business documents, FAQs, or past data to train the AI for better performance.',
    price: 900
  },
  {
    id: 'escalation',
    name: 'Live Chat Escalation',
    description: 'Automatically pass conversations from AI to a human agent when needed.',
    price: 450
  },
  {
    id: 'ab-testing',
    name: 'A/B Testing for Responses',
    description: 'Test different chatbot messages or AI responses to see what performs best.',
    price: 350
  },
  {
    id: 'compliance',
    name: 'Compliance Mode (HIPAA, GDPR, etc.)',
    description: 'Ensure your AI system adheres to privacy and security standards.',
    price: 700
  },
  {
    id: 'branding',
    name: 'Brand Customization',
    description: 'White-labeled interfaces and AI tone customized to match your brand.',
    price: 400
  },
  {
    id: 'content',
    name: 'Content Automation Add-on',
    description: 'Automatically generate blog posts, product descriptions, or help articles using AI.',
    price: 600
  }
];

// Timeline options
const timelineOptions = [
  {
    id: 'standard',
    name: 'Standard (4–6 weeks)',
    description: 'Best value',
    multiplier: 1
  },
  {
    id: 'expedited',
    name: 'Expedited (2–3 weeks)',
    description: 'Faster delivery at a premium',
    multiplier: 1.5
  }
];

export default function Calculator() {
  const { toast } = useToast();
  const [selectedServiceType, setSelectedServiceType] = useState('chatbot');
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState('standard');
  const [projectScope, setProjectScope] = useState(50); // 0-100 slider value
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  // Calculate price whenever selections change
  useEffect(() => {
    const serviceType = serviceTypes.find(s => s.id === selectedServiceType);
    const plan = planOptions.find(p => p.id === selectedPlan);
    const timeline = timelineOptions.find(t => t.id === selectedTimeline);
    
    if (!serviceType || !plan || !timeline) return;
    
    // Base price calculation
    const basePrice = serviceType.basePrice * plan.multiplier;
    
    // Additional features
    const featuresPrice = selectedFeatures.reduce((total, featureId) => {
      const feature = additionalFeatures.find(f => f.id === featureId);
      return total + (feature?.price || 0);
    }, 0);
    
    // Timeline multiplier
    const timelinePrice = (basePrice + featuresPrice) * timeline.multiplier;
    
    // Project scope adjustment (±20%)
    const scopeAdjustment = ((projectScope - 50) / 50) * 0.2;
    const adjustedPrice = timelinePrice * (1 + scopeAdjustment);
    
    // Set calculated price
    const calculatedPrice = Math.round(adjustedPrice / 100) * 100; // Round to nearest 100
    setTotalPrice(calculatedPrice);
    
    // Set a price range (±15%)
    const min = Math.round((calculatedPrice * 0.85) / 100) * 100;
    const max = Math.round((calculatedPrice * 1.15) / 100) * 100;
    setPriceRange({ min, max });
    
  }, [selectedServiceType, selectedPlan, selectedFeatures, selectedTimeline, projectScope]);

  const handleRequestQuote = () => {
    toast({
      title: "Quote Request Submitted",
      description: "Thank you for your interest! Our team will contact you shortly with a detailed proposal.",
    });
  };

  return (
    <>
      <Helmet>
        <title>AI Cost Calculator | Advanta AI</title>
        <meta name="description" content="Calculate the cost of your custom AI solution, including chatbot development, AI consulting, and integrations." />
        <meta name="keywords" content="AI cost calculator, chatbot pricing, AI integration cost, custom AI development" />
      </Helmet>
      
      <Header />
      
      <main className="py-28 bg-background neural-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center mb-16"
          >
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
              AI Project Cost <span className="gradient-text">Calculator</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get an instant estimate for your custom AI solution. Adjust the options below to see how different features and requirements affect pricing.
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="max-w-5xl mx-auto bg-muted rounded-2xl p-8 border border-border shadow-xl"
          >
            <div className="grid gap-12">
              {/* 1. Service Type */}
              <div>
                <h2 className="text-2xl font-bold mb-6">1. Service Type</h2>
                <p className="text-muted-foreground mb-6">Choose what you need help with</p>
                
                <RadioGroup 
                  value={selectedServiceType} 
                  onValueChange={setSelectedServiceType}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {serviceTypes.map((service) => (
                    <div key={service.id} className="relative">
                      <RadioGroupItem
                        value={service.id}
                        id={service.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={service.id}
                        className="flex flex-col h-full p-6 bg-background hover:bg-background/70 border border-border rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                      >
                        <div className="mb-4 h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <i className={`fas fa-${service.icon} text-primary text-xl`}></i>
                        </div>
                        <span className="text-lg font-bold text-white">{service.name}</span>
                        <span className="text-sm text-muted-foreground mt-2">{service.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* 2. Plan Selection */}
              <div>
                <h2 className="text-2xl font-bold mb-6">2. Plan Selection</h2>
                <p className="text-muted-foreground mb-6">Select the package that fits your needs</p>
                
                <RadioGroup 
                  value={selectedPlan} 
                  onValueChange={setSelectedPlan}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {planOptions.map((plan) => (
                    <div key={plan.id} className="relative">
                      <RadioGroupItem
                        value={plan.id}
                        id={plan.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={plan.id}
                        className="flex flex-col h-full p-6 bg-background hover:bg-background/70 border border-border rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                      >
                        <div className="mb-4 h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <i className={`fas fa-${plan.icon} text-primary text-xl`}></i>
                        </div>
                        <span className="text-lg font-bold text-white">{plan.name}</span>
                        <span className="text-sm text-muted-foreground mt-2">{plan.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* 3. Additional Features */}
              <div>
                <h2 className="text-2xl font-bold mb-6">3. Additional Features</h2>
                <p className="text-muted-foreground mb-6">Optional upgrades to enhance your solution</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {additionalFeatures.map((feature) => (
                    <div 
                      key={feature.id}
                      className="p-4 bg-background border border-border rounded-lg flex items-start space-x-4"
                    >
                      <Checkbox 
                        id={`feature-${feature.id}`}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedFeatures([...selectedFeatures, feature.id]);
                          } else {
                            setSelectedFeatures(selectedFeatures.filter(id => id !== feature.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div>
                        <Label 
                          htmlFor={`feature-${feature.id}`}
                          className="text-white font-medium cursor-pointer"
                        >
                          {feature.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 4. Project Scope */}
              <div>
                <h2 className="text-2xl font-bold mb-6">4. Project Scope</h2>
                <p className="text-muted-foreground mb-6">Adjust the slider based on your project complexity and scale</p>
                
                <div className="space-y-6">
                  <Slider
                    value={[projectScope]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setProjectScope(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>Minimal Scope</span>
                    <span>Standard Scope</span>
                    <span>Maximum Scope</span>
                  </div>
                </div>
              </div>
              
              {/* 5. Project Timeline */}
              <div>
                <h2 className="text-2xl font-bold mb-6">5. Project Timeline</h2>
                <p className="text-muted-foreground mb-6">Choose your preferred timeline</p>
                
                <RadioGroup 
                  value={selectedTimeline} 
                  onValueChange={setSelectedTimeline}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {timelineOptions.map((timeline) => (
                    <div key={timeline.id} className="relative">
                      <RadioGroupItem
                        value={timeline.id}
                        id={timeline.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={timeline.id}
                        className="flex flex-col h-full p-6 bg-background hover:bg-background/70 border border-border rounded-xl cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                      >
                        <span className="text-lg font-bold text-white">{timeline.name}</span>
                        <span className="text-sm text-muted-foreground mt-2">{timeline.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* 6. Estimated Cost */}
              <div>
                <h2 className="text-2xl font-bold mb-8">6. Estimated Cost</h2>
                
                <Card className="bg-background border-primary">
                  <div className="p-8 text-center">
                    <h3 className="text-white text-xl font-bold mb-4">Your Estimated Project Cost</h3>
                    <p className="text-4xl font-black text-primary mb-4">
                      ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      This is an estimate based on your selections. The final price may vary depending on specific requirements and customizations.
                    </p>
                    
                    <Button 
                      className="bg-primary hover:bg-primary/90 mt-8"
                      size="lg"
                      onClick={handleRequestQuote}
                    >
                      Get Your Custom Quote
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}