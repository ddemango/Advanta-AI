import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Mail, Wand2, Sparkles, ClipboardList, Download, Send, Building2, Server, ShieldCheck, DollarSign, Database, Cloud, FileText, Bot, PhoneCall, Images, MicVocal, Cpu, Gauge, GitBranch, Eye, Lock } from "lucide-react";
import { Helmet } from "react-helmet";
import { NewHeader } from "@/components/redesign/NewHeader";
import Footer from "@/components/layout/Footer";

// UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// ---------------------------- Types ----------------------------

type Industry =
  | "Real Estate"
  | "Legal / Law Firm"
  | "Finance / Accounting"
  | "Recruiting / Staffing"
  | "Marketing / Creative Agency"
  | "Influencer / Podcast / Media"
  | "Course Creator / Coach / Educator"
  | "SaaS / Software"
  | "AI Builder / Startup"
  | "Manufacturing / Logistics"
  | "Gaming / Esports"
  | "Travel / Tourism"
  | "Healthcare / Medical"
  | "Fitness / Personal Training"
  | "Medical Aesthetics / Beauty"
  | "E-commerce / Retail"
  | "Automotive / Dealership"
  | "Construction / Contracting"
  | "Hospitality / Restaurant / Hotel"
  | "Home Services (Cleaning, HVAC, Landscaping)"
  | "Nonprofit / Social Impact"
  | "Freelancers / Solopreneurs"
  | "Other";

type Goal =
  | "Customer Support Chatbot"
  | "Internal Q&A (Docs/RAG)"
  | "Agent Automation/Workflows"
  | "Content Generation"
  | "Lead Scoring & Personalization"
  | "Analytics/Insights"
  | "Voice/IVR Assistant"
  | "Vision/OCR"
  | "Speech-to-Text / Transcription"
  | "Recommendation Engine";

type Compliance = "HIPAA" | "GDPR" | "SOC2" | "PCI" | "None";

type Cloud = "AWS" | "GCP" | "Azure" | "Vercel" | "Self-Hosted" | "No Preference";

type TeamSkill = "No-code" | "Low-code" | "Full-stack" | "ML/DS Team";

interface Answers {
  companyName: string;
  industry: Industry;
  teamSize: number;
  teamSkill: TeamSkill;
  region: string;
  compliance: Compliance[];
  cloud: Cloud;
  monthlyBudget: number;
  latencyCritical: boolean;
  piiSensitive: boolean;
  dataSources: string[];
  goals: Goal[];
  integrations: string[];
  notes: string;
}

interface ToolPick {
  name: string;
  tier: "Free" | "$" | "$$" | "$$$" | "Enterprise";
  why: string;
  url?: string;
}

interface CategoryRec {
  category: string;
  picks: ToolPick[];
}

interface StackPlan {
  summary: string;
  categories: CategoryRec[];
  estimatedMonthly: string;
  nextSteps: string[];
}

// ---------------------------- Defaults ----------------------------

const DEFAULT_ANSWERS: Answers = {
  companyName: "",
  industry: "SaaS / Software",
  teamSize: 10,
  teamSkill: "Full-stack",
  region: "United States",
  compliance: ["None"],
  cloud: "Vercel",
  monthlyBudget: 1000,
  latencyCritical: false,
  piiSensitive: true,
  dataSources: ["Google Drive", "Postgres"],
  goals: ["Customer Support Chatbot", "Internal Q&A (Docs/RAG)"],
  integrations: ["HubSpot", "GA4"],
  notes: "",
};

const ALL_GOALS: Goal[] = [
  "Customer Support Chatbot",
  "Internal Q&A (Docs/RAG)",
  "Agent Automation/Workflows",
  "Content Generation",
  "Lead Scoring & Personalization",
  "Analytics/Insights",
  "Voice/IVR Assistant",
  "Vision/OCR",
  "Speech-to-Text / Transcription",
  "Recommendation Engine",
];

const ALL_DATASOURCES = [
  "Google Drive",
  "Notion",
  "Confluence",
  "SharePoint",
  "Dropbox",
  "Gmail/Outlook",
  "Zendesk",
  "Freshdesk",
  "Intercom",
  "Salesforce",
  "HubSpot",
  "Postgres",
  "MySQL",
  "MongoDB",
  "Elasticsearch",
  "BigQuery",
  "Snowflake",
  "Redshift",
  "S3",
  "GCS",
  "Azure Blob",
  "Website/CMS",
  "Logs/Events",
];

const ALL_INTEGRATIONS = [
  "Salesforce",
  "HubSpot",
  "Pipedrive",
  "Zendesk",
  "Intercom",
  "Slack",
  "Teams",
  "GA4",
  "PostHog",
  "Segment",
  "Shopify",
  "BigCommerce",
  "Stripe",
  "Chargebee",
  "Zapier",
  "Make.com",
];

// ------------------------- Recommendation Engine -------------------------

function estimateMonthlyRange(a: Answers): string {
  let pts = 0;
  // scale with team size (proxy for traffic)
  if (a.teamSize >= 200) pts += 2; else if (a.teamSize >= 50) pts += 1; else if (a.teamSize >= 10) pts += 0.5;
  // goals influence
  const has = (g: Goal) => a.goals.includes(g);
  if (has("Customer Support Chatbot")) pts += 1.5;
  if (has("Internal Q&A (Docs/RAG)")) pts += 1.2;
  if (has("Agent Automation/Workflows")) pts += 1.5;
  if (has("Content Generation")) pts += 0.8;
  if (has("Lead Scoring & Personalization")) pts += 1.0;
  if (has("Analytics/Insights")) pts += 1.0;
  if (has("Voice/IVR Assistant")) pts += 2.0;
  if (has("Vision/OCR")) pts += 2.0;
  if (has("Speech-to-Text / Transcription")) pts += 1.2;
  if (has("Recommendation Engine")) pts += 1.5;
  // data sources (connector/ingestion complexity)
  if (a.dataSources.length > 3) pts += 0.5 + Math.min(1.2, (a.dataSources.length - 3) * 0.15);
  // compliance and latency add overhead
  if (a.compliance.includes("HIPAA") || a.compliance.includes("PCI")) pts += 1.0;
  if (a.compliance.includes("SOC2") || a.compliance.includes("GDPR")) pts += 0.5;
  if (a.latencyCritical) pts += 0.5;
  if (a.piiSensitive) pts += 0.3;
  // clamp
  pts = Math.min(pts, 12);
  // map to ranges
  if (pts <= 1.5) return "~$50–$300";
  if (pts <= 3.0) return "~$300–$1k";
  if (pts <= 5.0) return "~$1k–$3k";
  if (pts <= 7.0) return "~$3k–$7k";
  if (pts <= 9.0) return "~$7k–$15k";
  return "$15k+";
}

function applyIndustryAdjustments(a: Answers, plan: StackPlan) {
  const add = (category: string, pick: ToolPick) => {
    const cat = plan.categories.find((c) => c.category === category);
    if (cat) cat.picks.push(pick); else plan.categories.push({ category, picks: [pick] });
  };

  switch (a.industry) {
    case "Real Estate": {
      add("Application Layer", { name: "Listing Q&A + Lead Scoring", tier: "Free", why: "RAG over listings; intent scoring into CRM." });
      add("Voice / Speech / Vision", { name: "Vision OCR (leases, IDs)", tier: "$", why: "Extract entities and validate documents." });
      plan.nextSteps.unshift("Connect MLS/feed; route inquiries into your CRM.");
      break;
    }
    case "Legal / Law Firm": {
      add("Application Layer", { name: "Doc Review & E‑Discovery Assistant", tier: "Free", why: "Summarize, compare, and cite across matters with guardrails." });
      add("Auth & Security", { name: "DLP + Retention Policies", tier: "$", why: "Protect privileged content; define redaction rules." });
      add("Voice / Speech / Vision", { name: "Dictation & Transcripts (Whisper/Deepgram)", tier: "$", why: "Hands‑free capture of notes and meetings." });
      plan.nextSteps.unshift("Configure client/matter segregation and audit logging.");
      break;
    }
    case "Finance / Accounting": {
      add("Application Layer", { name: "Invoice/Receipt Extraction + Ledger RAG", tier: "$", why: "Auto‑code transactions and explain variances." });
      add("Auth & Security", { name: "Tokenization / Vault for PCI", tier: "$$", why: "Reduce cardholder data exposure in prompts and logs." });
      break;
    }
    case "Healthcare / Medical": {
      add("Hosting & CI/CD", { name: "Azure + BAA", tier: "$$$", why: "PHI‑compliant stack using Azure OpenAI." });
      add("Voice / Speech / Vision", { name: "Medical STT", tier: "$$", why: "Ambient scribe and call QA for clinics." });
      plan.nextSteps.unshift("Ensure HIPAA compliance and BAA agreements are in place.");
      break;
    }
    case "SaaS / Software": {
      add("Analytics / Product", { name: "PostHog Feature Flags", tier: "$", why: "Gate AI features and run prompt/policy experiments." });
      add("Auth & Security", { name: "Organization RBAC (Clerk/Auth0)", tier: "$$", why: "B2B multi‑tenant roles & SSO." });
      break;
    }
    case "E-commerce / Retail": {
      add("Application Layer", { name: "AI Concierge (Catalog + Policies)", tier: "$", why: "Product Q&A, sizing, and returns with RAG." });
      add("Analytics / Product", { name: "Klaviyo / Lifecycle", tier: "$$", why: "Flows powered by AI segments + product affinity." });
      break;
    }
    default:
      break;
  }
}

function generateStackPlan(a: Answers): StackPlan {
  const plan: StackPlan = {
    summary: `Tailored AI stack for ${a.companyName || "your company"} in ${a.industry}. Budget-optimized recommendations for ${a.teamSkill} team of ${a.teamSize} members.`,
    categories: [],
    estimatedMonthly: estimateMonthlyRange(a),
    nextSteps: [
      "Set up development environment and version control",
      "Configure authentication and security policies", 
      "Implement core AI features with monitoring",
      "Test extensively and iterate based on feedback",
      "Scale infrastructure as usage grows"
    ],
  };

  // Core recommendations based on goals
  const add = (category: string, pick: ToolPick) => {
    const cat = plan.categories.find((c) => c.category === category);
    if (cat) cat.picks.push(pick); else plan.categories.push({ category, picks: [pick] });
  };

  // Model Provider recommendations
  if (a.compliance.includes("HIPAA")) {
    add("Model Provider(s)", { name: "Azure OpenAI", tier: "$$$", why: "HIPAA-compliant with Business Associate Agreement" });
  } else if (a.monthlyBudget < 500) {
    add("Model Provider(s)", { name: "OpenAI GPT-4o-mini", tier: "$", why: "Cost-effective for most use cases with strong performance" });
  } else {
    add("Model Provider(s)", { name: "OpenAI GPT-4o", tier: "$$", why: "Best-in-class performance for complex reasoning tasks" });
    add("Model Provider(s)", { name: "Anthropic Claude", tier: "$$", why: "Excellent for analysis and safer enterprise content" });
  }

  // Vector Database
  if (a.teamSkill === "No-code") {
    add("Vector DB / Search", { name: "Pinecone", tier: "$", why: "Fully managed with simple API and excellent documentation" });
  } else if (a.monthlyBudget > 5000) {
    add("Vector DB / Search", { name: "Weaviate Cloud", tier: "$$", why: "Advanced features with hybrid search capabilities" });
  } else {
    add("Vector DB / Search", { name: "Qdrant", tier: "Free", why: "Self-hosted option with excellent performance and filtering" });
  }

  // Orchestration Framework
  add("Orchestration & RAG", { name: "LangChain", tier: "Free", why: "Comprehensive framework with extensive integrations" });
  add("Orchestration & RAG", { name: "LlamaIndex", tier: "Free", why: "Specialized for document processing and RAG workflows" });

  // Application Layer based on goals
  if (a.goals.includes("Customer Support Chatbot")) {
    add("Application Layer", { name: "Next.js Chat Interface + RAG", tier: "Free", why: "Custom chatbot with full control and brand alignment" });
  }
  
  if (a.goals.includes("Internal Q&A (Docs/RAG)")) {
    add("Application Layer", { name: "Document Q&A System", tier: "Free", why: "Query internal knowledge base with cited responses" });
  }

  if (a.goals.includes("Agent Automation/Workflows")) {
    add("Application Layer", { name: "LangGraph Workflows", tier: "Free", why: "Multi-step agent workflows with error handling" });
  }

  // ETL/Ingestion based on data sources
  if (a.dataSources.length > 5) {
    add("ETL / Ingestion", { name: "Airbyte", tier: "$", why: "Connect 300+ data sources with managed connectors" });
  } else if (a.dataSources.includes("Notion") || a.dataSources.includes("Google Drive")) {
    add("ETL / Ingestion", { name: "Unstructured.io", tier: "$", why: "Extract and process documents from multiple formats" });
  }

  // Storage recommendations
  add("Storage / Warehouse", { name: "PostgreSQL with pgvector", tier: "Free", why: "Unified database for application data and vectors" });
  if (a.dataSources.length > 3) {
    add("Storage / Warehouse", { name: "S3 / GCS Object Storage", tier: "$", why: "Scalable storage for documents, images, and backups" });
  }

  // Hosting based on cloud preference and team skill
  switch (a.cloud) {
    case "Vercel":
      add("Hosting & CI/CD", { name: "Vercel", tier: "$", why: "Serverless deployment with automatic scaling and edge optimization" });
      break;
    case "AWS":
      add("Hosting & CI/CD", { name: "AWS ECS + Lambda", tier: "$$", why: "Containerized apps with serverless functions for AI workloads" });
      break;
    case "GCP":
      add("Hosting & CI/CD", { name: "Cloud Run + Cloud Functions", tier: "$$", why: "Serverless containers with integrated AI/ML services" });
      break;
    default:
      if (a.teamSkill === "No-code") {
        add("Hosting & CI/CD", { name: "Vercel", tier: "$", why: "Simple deployment with automatic scaling" });
      } else {
        add("Hosting & CI/CD", { name: "Railway + Docker", tier: "$", why: "Simple containerized deployment with databases included" });
      }
  }

  // Authentication and Security
  if (a.teamSkill === "No-code") {
    add("Auth & Security", { name: "Clerk", tier: "$", why: "Beautiful pre-built authentication with organizations support" });
  } else {
    add("Auth & Security", { name: "NextAuth.js", tier: "Free", why: "Flexible authentication with multiple providers" });
  }

  // Monitoring and Analytics
  add("LLMOps / Observability", { name: "LangSmith", tier: "$$", why: "Track AI performance, costs, and user interactions" });
  if (a.monthlyBudget > 2000) {
    add("LLMOps / Observability", { name: "Weights & Biases", tier: "$$$", why: "Advanced ML experiment tracking and model monitoring" });
  }

  // Voice/Speech/Vision based on goals
  if (a.goals.includes("Speech-to-Text / Transcription")) {
    add("Voice / Speech / Vision", { name: "OpenAI Whisper API", tier: "$", why: "High-quality speech transcription with multiple languages" });
  }
  if (a.goals.includes("Vision/OCR")) {
    add("Voice / Speech / Vision", { name: "GPT-4 Vision + Tesseract", tier: "$$", why: "Advanced image understanding with fallback OCR" });
  }
  if (a.goals.includes("Voice/IVR Assistant")) {
    add("Voice / Speech / Vision", { name: "Twilio + ElevenLabs", tier: "$$", why: "Phone system integration with natural voice synthesis" });
  }

  // Apply industry-specific adjustments
  applyIndustryAdjustments(a, plan);

  return plan;
}

// ---------------------------- Main Component ----------------------------

export default function AIStackBuilder() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [plan, setPlan] = useState<StackPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const stackPlan = useMemo(() => {
    if (!plan) return generateStackPlan(answers);
    return plan;
  }, [answers, plan]);

  const totalSteps = 8;

  const generatePlan = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const generated = generateStackPlan(answers);
      setPlan(generated);
      setIsGenerating(false);
      toast({
        title: "Stack Generated!",
        description: "Your personalized AI stack recommendations are ready."
      });
    }, 2000);
  };

  const sendByEmail = async () => {
    if (!answers.companyName.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name to receive the stack plan.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/send-stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          plan: stackPlan,
          email: `hello@${answers.companyName.toLowerCase().replace(/\s+/g, '')}.com` // Simple email derivation
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      toast({
        title: "Email Sent!",
        description: "Your AI stack plan has been sent to your email."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const downloadMarkdown = () => {
    const markdown = `# AI Stack Recommendations for ${answers.companyName}

## Company Profile
- **Industry:** ${answers.industry}
- **Team Size:** ${answers.teamSize} members
- **Technical Skill:** ${answers.teamSkill}
- **Budget:** $${answers.monthlyBudget.toLocaleString()}/month
- **Compliance:** ${answers.compliance.join(', ')}

## Summary
${stackPlan.summary}

## Estimated Monthly Cost
${stackPlan.estimatedMonthly}

## Recommended Technology Stack

${stackPlan.categories.map(cat => `
### ${cat.category}
${cat.picks.map(pick => `- **${pick.name}** (${pick.tier}) - ${pick.why}`).join('\n')}
`).join('')}

## Implementation Roadmap
${stackPlan.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Additional Notes
${answers.notes || 'No additional requirements specified.'}

---
*Generated by Advanta AI Stack Builder on ${new Date().toLocaleDateString()}*
*This recommendation is based on current market conditions and your specific requirements.*
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${answers.companyName.replace(/\s+/g, '_')}_AI_Stack_Plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Your AI stack plan has been downloaded as a markdown file."
    });
  };

  const nextStep = () => {
    if (step === totalSteps - 2) {
      generatePlan();
    }
    setStep(Math.min(step + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 0));
  };

  const updateAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] => {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={answers.companyName}
                  onChange={(e) => updateAnswer('companyName', e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>
              
              <div>
                <Label>Industry</Label>
                <Select value={answers.industry} onValueChange={(value) => updateAnswer('industry', value as Industry)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Legal / Law Firm">Legal / Law Firm</SelectItem>
                    <SelectItem value="Finance / Accounting">Finance / Accounting</SelectItem>
                    <SelectItem value="SaaS / Software">SaaS / Software</SelectItem>
                    <SelectItem value="Healthcare / Medical">Healthcare / Medical</SelectItem>
                    <SelectItem value="E-commerce / Retail">E-commerce / Retail</SelectItem>
                    <SelectItem value="Marketing / Creative Agency">Marketing / Creative Agency</SelectItem>
                    <SelectItem value="Manufacturing / Logistics">Manufacturing / Logistics</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Team Size: {answers.teamSize}</Label>
                <Slider
                  value={[answers.teamSize]}
                  onValueChange={([value]) => updateAnswer('teamSize', value)}
                  max={500}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Technical Skill Level</Label>
                <Select value={answers.teamSkill} onValueChange={(value) => updateAnswer('teamSkill', value as TeamSkill)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No-code">No-code (Drag & drop tools)</SelectItem>
                    <SelectItem value="Low-code">Low-code (Basic scripting)</SelectItem>
                    <SelectItem value="Full-stack">Full-stack (Custom development)</SelectItem>
                    <SelectItem value="ML/DS Team">ML/DS Team (Advanced AI/ML)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-6 h-6 text-green-600" />
                AI Goals & Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALL_GOALS.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={answers.goals.includes(goal)}
                      onCheckedChange={() => updateAnswer('goals', toggleArrayItem(answers.goals, goal))}
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-6 h-6 text-purple-600" />
                Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ALL_DATASOURCES.map((source) => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={source}
                      checked={answers.dataSources.includes(source)}
                      onCheckedChange={() => updateAnswer('dataSources', toggleArrayItem(answers.dataSources, source))}
                    />
                    <Label htmlFor={source} className="text-xs">{source}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-red-600" />
                Compliance & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Compliance Requirements</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {["HIPAA", "GDPR", "SOC2", "PCI", "None"].map((comp) => (
                    <div key={comp} className="flex items-center space-x-2">
                      <Checkbox
                        id={comp}
                        checked={answers.compliance.includes(comp as Compliance)}
                        onCheckedChange={() => updateAnswer('compliance', toggleArrayItem(answers.compliance, comp as Compliance))}
                      />
                      <Label htmlFor={comp}>{comp}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Latency Critical Applications</Label>
                  <Switch
                    checked={answers.latencyCritical}
                    onCheckedChange={(value) => updateAnswer('latencyCritical', value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Handles PII/Sensitive Data</Label>
                  <Switch
                    checked={answers.piiSensitive}
                    onCheckedChange={(value) => updateAnswer('piiSensitive', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-6 h-6 text-blue-500" />
                Infrastructure Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Preferred Cloud Platform</Label>
                <Select value={answers.cloud} onValueChange={(value) => updateAnswer('cloud', value as Cloud)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AWS">Amazon Web Services (AWS)</SelectItem>
                    <SelectItem value="GCP">Google Cloud Platform (GCP)</SelectItem>
                    <SelectItem value="Azure">Microsoft Azure</SelectItem>
                    <SelectItem value="Vercel">Vercel (Serverless)</SelectItem>
                    <SelectItem value="Self-Hosted">Self-Hosted</SelectItem>
                    <SelectItem value="No Preference">No Preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Monthly Budget (USD): ${answers.monthlyBudget.toLocaleString()}</Label>
                <Slider
                  value={[answers.monthlyBudget]}
                  onValueChange={([value]) => updateAnswer('monthlyBudget', value)}
                  max={50000}
                  min={100}
                  step={100}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$100</span>
                  <span>$50,000+</span>
                </div>
              </div>

              <div>
                <Label>Primary Region</Label>
                <Input
                  value={answers.region}
                  onChange={(e) => updateAnswer('region', e.target.value)}
                  placeholder="United States"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-6 h-6 text-orange-600" />
                Integrations & Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ALL_INTEGRATIONS.map((integration) => (
                  <div key={integration} className="flex items-center space-x-2">
                    <Checkbox
                      id={integration}
                      checked={answers.integrations.includes(integration)}
                      onCheckedChange={() => updateAnswer('integrations', toggleArrayItem(answers.integrations, integration))}
                    />
                    <Label htmlFor={integration} className="text-sm">{integration}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-600" />
                Additional Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="notes">Anything else we should know?</Label>
                <Textarea
                  id="notes"
                  value={answers.notes}
                  onChange={(e) => updateAnswer('notes', e.target.value)}
                  placeholder="Special requirements, existing infrastructure, constraints, or specific goals..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Your Personalized AI Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="text-center py-12">
                    <Wand2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-lg">Generating your personalized stack recommendations...</p>
                    <p className="text-sm text-gray-500 mt-2">Analyzing your requirements and industry best practices</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
                      <h3 className="font-semibold text-blue-900 mb-2">Executive Summary</h3>
                      <p className="text-blue-800 mb-3">{stackPlan.summary}</p>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-800">
                          Estimated: {stackPlan.estimatedMonthly}/month
                        </Badge>
                        <Badge variant="outline">
                          {stackPlan.categories.length} categories
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {stackPlan.categories.map((category, idx) => (
                        <Card key={idx} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {category.category === "Model Provider(s)" && <Bot className="w-5 h-5" />}
                              {category.category === "Vector DB / Search" && <Database className="w-5 h-5" />}
                              {category.category === "Hosting & CI/CD" && <Server className="w-5 h-5" />}
                              {category.category === "Auth & Security" && <Lock className="w-5 h-5" />}
                              <span>{category.category}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {category.picks.map((pick, pickIdx) => (
                                <div key={pickIdx} className="border rounded-lg p-3 bg-gray-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium">{pick.name}</h4>
                                    <Badge 
                                      variant={pick.tier === "Free" ? "secondary" : pick.tier === "$$$" || pick.tier === "Enterprise" ? "destructive" : "default"}
                                    >
                                      {pick.tier}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{pick.why}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="bg-green-50 border-green-200">
                      <CardHeader>
                        <CardTitle className="text-green-800">Implementation Roadmap</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2">
                          {stackPlan.nextSteps.map((step, idx) => (
                            <li key={idx} className="text-sm text-green-700">{step}</li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>

                    <div className="flex gap-4 justify-center pt-6">
                      <Button onClick={sendByEmail} disabled={isSending} className="bg-blue-600 hover:bg-blue-700">
                        <Mail className="w-4 h-4 mr-2" />
                        {isSending ? 'Sending...' : 'Email Full Report'}
                      </Button>
                      <Button onClick={downloadMarkdown} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Stack Builder Wizard | Advanta AI</title>
        <meta name="description" content="Get personalized AI technology stack recommendations tailored to your industry, budget, and technical requirements. Free expert guidance in 8 simple steps." />
      </Helmet>
      
      <NewHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Stack Builder Wizard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized AI technology recommendations tailored to your business. 
              Our expert system analyzes your requirements and suggests the optimal tools and architecture.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Badge className="bg-green-500">Free Expert Guidance</Badge>
              <Badge variant="outline">8 Simple Steps</Badge>
              <Badge variant="outline">Download Full Report</Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Step {step + 1} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round(((step + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              >
                {step + 1 === totalSteps && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </motion.div>
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between max-w-2xl mx-auto mt-8">
            <Button
              onClick={prevStep}
              disabled={step === 0}
              variant="outline"
              className="min-w-[100px]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={step === totalSteps - 1}
              className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
            >
              {step === totalSteps - 2 ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Stack
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}