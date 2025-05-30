import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Wrench, ArrowRight, ArrowLeft, Sparkles, Mail } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  industry: string;
  otherIndustry: string;
  teamSize: string;
  priorities: string[];
  otherPriority: string;
  currentTools: string[];
  techLevel: string;
  wantHelp: string;
  name: string;
  email: string;
  optIn: boolean;
}

const industries = [
  { category: "Professional Services", options: ["Real Estate", "Legal / Law Firm", "Finance / Accounting", "Recruiting / Staffing"] },
  { category: "Health & Wellness", options: ["Healthcare / Medical", "Fitness / Personal Training", "Medical Aesthetics / Beauty"] },
  { category: "Digital & Creative", options: ["Marketing / Creative Agency", "Influencer / Podcast / Media", "Course Creator / Coach / Educator"] },
  { category: "Commerce & Local Business", options: ["E-commerce / Retail", "Automotive / Dealership", "Construction / Contracting", "Hospitality / Restaurant / Hotel", "Home Services (Cleaning, HVAC, Landscaping)"] },
  { category: "Tech & Innovation", options: ["SaaS / Software", "AI Builder / Startup", "Manufacturing / Logistics", "Gaming / Esports", "Travel / Tourism"] },
  { category: "Other", options: ["Nonprofit / Social Impact", "Freelancers / Solopreneurs"] }
];

const priorities = [
  "Generate more leads",
  "Automate my workflows", 
  "Respond to customers faster",
  "Create social content with AI",
  "Automate emails or follow-ups",
  "Analyze data and reporting",
  "Improve team productivity",
  "Write blogs / SEO content",
  "Set up a chatbot or knowledge base",
  "Qualify or onboard new clients",
  "Train staff with AI tools"
];

const tools = [
  "Airtable",
  "Asana",
  "AWS",
  "Calendly",
  "Dropbox",
  "Email (SMTP/IMAP)",
  "Facebook",
  "Flow Control",
  "FTP",
  "GitHub",
  "Google Drive",
  "Google Sheets",
  "Google Workspace",
  "HTTP",
  "HubSpot",
  "Instagram",
  "Intercom",
  "Jira",
  "JSON",
  "LinkedIn",
  "Mailchimp",
  "Microsoft Teams",
  "Monday.com",
  "Notion",
  "OneDrive",
  "OpenAI (ChatGPT)",
  "PayPal",
  "QuickBooks",
  "RSS",
  "Salesforce",
  "Shopify",
  "Slack",
  "Stripe",
  "SurveyMonkey",
  "TikTok",
  "Tools",
  "Trello",
  "Twitter/X",
  "Typeform",
  "Webhooks",
  "WordPress",
  "Xero",
  "XML",
  "YouTube",
  "Zendesk",
  "Zoom",
  "None yet"
];

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    industry: "",
    otherIndustry: "",
    teamSize: "",
    priorities: [],
    otherPriority: "",
    currentTools: [],
    techLevel: "",
    wantHelp: "",
    name: "",
    email: "",
    optIn: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof FormData].includes(item) 
        ? (prev[field as keyof FormData] as string[]).filter(i => i !== item)
        : [...(prev[field as keyof FormData] as string[]), item]
    }));
  };

  const nextStep = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/build-ai-stack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create AI stack');
      }
      
      toast({
        title: "AI Stack Created! 🎉",
        description: "Your custom AI recommendations have been sent to your email.",
      });
      
      // Reset form
      setCurrentStep(1);
      setFormData({
        industry: "",
        otherIndustry: "",
        teamSize: "",
        priorities: [],
        otherPriority: "",
        currentTools: [],
        techLevel: "",
        wantHelp: "",
        name: "",
        email: "",
        optIn: false
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create your AI stack. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">What industry are you in?</h2>
              <p className="text-gray-300">Select the one that best describes your business</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {industries.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-300">{category.category}</h3>
                  <RadioGroup value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                    {category.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} className="border-gray-500" />
                        <Label htmlFor={option} className="text-gray-300 cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Other</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroup value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Other" id="other-option" className="border-gray-500" />
                      <Label htmlFor="other-option" className="text-gray-300 cursor-pointer">Other:</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formData.industry === "Other" && (
                  <Input
                    value={formData.otherIndustry}
                    onChange={(e) => updateFormData("otherIndustry", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white ml-6"
                    placeholder="Your industry..."
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">What's the size of your team?</h2>
              <p className="text-gray-300">This helps us recommend the right solutions</p>
            </div>
            
            <RadioGroup value={formData.teamSize} onValueChange={(value) => updateFormData("teamSize", value)}>
              {["Just me", "2–10 people", "11–50 people", "51–200 people", "Enterprise (200+)"].map((size) => (
                <div key={size} className="flex items-center space-x-2 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <RadioGroupItem value={size} id={size} className="border-gray-500" />
                  <Label htmlFor={size} className="text-gray-300 cursor-pointer text-lg">{size}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">What are your top priorities right now?</h2>
              <p className="text-gray-300">Select up to 3 goals or pain points</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              {priorities.map((priority) => (
                <div key={priority} className="flex items-center space-x-2 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <Checkbox
                    id={priority}
                    checked={formData.priorities.includes(priority)}
                    onCheckedChange={() => toggleArrayItem("priorities", priority)}
                    className="border-gray-500"
                  />
                  <Label htmlFor={priority} className="text-gray-300 cursor-pointer">{priority}</Label>
                </div>
              ))}
            </div>
            
            <div>
              <Label htmlFor="otherPriority" className="text-white">Something else:</Label>
              <Input
                id="otherPriority"
                value={formData.otherPriority}
                onChange={(e) => updateFormData("otherPriority", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-2"
                placeholder="Describe your custom priority..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">What tools do you currently use?</h2>
              <p className="text-gray-300">Check all that apply (optional)</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              {tools.map((tool) => (
                <div key={tool} className="flex items-center space-x-2 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <Checkbox
                    id={tool}
                    checked={formData.currentTools.includes(tool)}
                    onCheckedChange={() => toggleArrayItem("currentTools", tool)}
                    className="border-gray-500"
                  />
                  <Label htmlFor={tool} className="text-gray-300 cursor-pointer">{tool}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">How tech-savvy are you?</h2>
              <p className="text-gray-300">How comfortable are you with automation, tools, or AI?</p>
            </div>
            
            <RadioGroup value={formData.techLevel} onValueChange={(value) => updateFormData("techLevel", value)}>
              {[
                { value: "beginner", label: "Beginner", desc: "I need it to be simple" },
                { value: "intermediate", label: "Intermediate", desc: "I can handle a bit of setup" },
                { value: "advanced", label: "Advanced", desc: "I want deep integrations" },
                { value: "hire", label: "\"Just build it for me\"", desc: "I'd rather hire help" }
              ].map((level) => (
                <div key={level.value} className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <RadioGroupItem value={level.value} id={level.value} className="border-gray-500" />
                  <div>
                    <Label htmlFor={level.value} className="text-white cursor-pointer font-medium">{level.label}</Label>
                    <p className="text-gray-400 text-sm">{level.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Would you like help implementing your AI stack?</h2>
              <p className="text-gray-300">Choose what works best for you</p>
            </div>
            
            <RadioGroup value={formData.wantHelp} onValueChange={(value) => updateFormData("wantHelp", value)}>
              {[
                { value: "yes", label: "Yes – I'd like to talk to an expert", icon: "👨‍💻" },
                { value: "maybe", label: "Maybe later – just show me the tools", icon: "🔧" },
                { value: "no", label: "No thanks – I'll DIY for now", icon: "🚀" }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} className="border-gray-500" />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <Label htmlFor={option.value} className="text-white cursor-pointer text-lg">{option.label}</Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Want your AI stack emailed to you?</h2>
              <p className="text-gray-300">Get your custom recommendations plus weekly AI tips</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="flex items-center space-x-2 p-4 bg-gray-700/30 rounded-lg">
                <Checkbox
                  id="optIn"
                  checked={formData.optIn}
                  onCheckedChange={(checked) => updateFormData("optIn", checked)}
                  className="border-gray-500"
                />
                <Label htmlFor="optIn" className="text-gray-300 cursor-pointer">
                  Send me my custom AI stack + weekly AI tips
                </Label>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  size="lg"
                >
                  📅 Book a free strategy call
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6"
            >
              <Wrench className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🔧 Build My AI Stack
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get personalized AI tool recommendations tailored to your business needs
            </p>
            
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      step === currentStep
                        ? "bg-purple-500"
                        : step < currentStep
                        ? "bg-green-500"
                        : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Step {currentStep} of 7
              </CardTitle>
              <CardDescription className="text-gray-300">
                Building your custom AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStep()}
              
              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep === 7 ? (
                  <Button
                    onClick={submitForm}
                    disabled={!formData.email || isSubmitting}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Creating Stack...
                      </div>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Get My AI Stack
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}