import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Mail, Wand2, Sparkles, ClipboardList, Download, Send, Building2, Server, ShieldCheck, DollarSign, Database, Cloud, FileText, Bot, PhoneCall, Images, MicVocal, Cpu, Gauge, GitBranch, Eye, Lock } from "lucide-react";

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
  monthlyBudget: number; // USD
  latencyCritical: boolean;
  piiSensitive: boolean;
  dataSources: string[]; // e.g. "Google Drive", "Notion", "Postgres", "Salesforce", "Zendesk", "S3", "Snowflake" ...
  goals: Goal[];
  integrations: string[]; // CRM/support/analytics etc.
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
  estimatedMonthly: string; // rough range
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

function applyIndustryAdjustments(a: Answers, plan: StackPlan) {
  const add = (category: string, pick: ToolPick) => {
    const cat = plan.categories.find((c) => c.category === category);
    if (cat) cat.picks.push(pick); else plan.categories.push({ category, picks: [pick] });
  };

  switch (a.industry) {
    // Professional Services
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
      add("ETL / Ingestion", { name: "FHIR/HL7 Bridges", tier: "$$$", why: "Normalize EHR data to your warehouse." });
      break;
    }
    case "E-commerce / Retail": {
      add("Application Layer", { name: "AI Concierge (Catalog + Policies)", tier: "$", why: "Product Q&A, sizing, and returns with RAG." });
      add("Analytics / Product", { name: "Klaviyo / Lifecycle", tier: "$$", why: "Flows powered by AI segments + product affinity." });
      add("Vector DB / Search", { name: "Typesense (Hybrid)", tier: "$", why: "Fast product search blending vector + keyword." });
      break;
    }
  }
}

function generateStack(a: Answers): StackPlan {
  const isHealthcare = a.industry === "Healthcare / Medical" || a.compliance.includes("HIPAA");
  const isFinance = a.industry === "Finance / Accounting" || a.compliance.includes("PCI");
  const enterprise = a.monthlyBudget >= 10000 || a.teamSize > 250;
  const lean = a.monthlyBudget <= 2000;
  const scrappy = a.monthlyBudget <= 300;
  const diy = a.teamSkill === "Full-stack" || a.teamSkill === "ML/DS Team";
  const nocode = a.teamSkill === "No-code" || a.teamSkill === "Low-code";

  // Model provider prefs
  const prefersAzure = isHealthcare || isFinance || a.cloud === "Azure";
  const prefersGCP = a.cloud === "GCP";
  const prefersAWS = a.cloud === "AWS";

  const modelPicks: ToolPick[] = [];
  if (prefersAzure) {
    modelPicks.push({ name: "Azure OpenAI", tier: enterprise ? "Enterprise" : "$$$", why: "Enterprise security, regional controls; HIPAA/PCI-friendly options." });
  }
  if (prefersGCP) {
    modelPicks.push({ name: "Vertex AI (Gemini)", tier: enterprise ? "Enterprise" : "$$$", why: "Tight GCP integration, data governance, good for multimodal + search." });
  }
  if (prefersAWS) {
    modelPicks.push({ name: "Amazon Bedrock", tier: enterprise ? "Enterprise" : "$$$", why: "Access to multiple models (Anthropic, Mistral, Cohere) under AWS controls." });
  }
  // Always include best-in-class general providers
  modelPicks.push({ name: "OpenAI (API)", tier: scrappy ? "$" : lean ? "$$" : "$$$", why: "Strong reasoning + tool-use; great generalist, broad ecosystem." });
  modelPicks.push({ name: "Anthropic (Claude)", tier: lean ? "$$" : "$$$", why: "Great for safer enterprise text + tool-use; strong coding & analysis." });
  modelPicks.push({ name: "Mistral (Open/Hosted)", tier: scrappy ? "Free" : "$", why: "Cost-efficient, performant small/medium models; self-hosting friendly." });

  // Vector DB picks
  const vectorDB: ToolPick[] = [];
  if (enterprise) vectorDB.push({ name: "Pinecone", tier: "$$$", why: "Managed, scalable, filters & HNSW/ScaNN-like perf; good for prod RAG." });
  if (!enterprise && !scrappy) vectorDB.push({ name: "Weaviate Cloud", tier: "$$", why: "Managed + modules; hybrid search and schema tooling." });
  vectorDB.push({ name: "pgvector (Postgres)", tier: scrappy ? "Free" : "$", why: "Great if you already use Postgres; low overhead." });
  vectorDB.push({ name: "Qdrant Cloud", tier: "$", why: "Affordable, fast ANN with payload filters; easy to start." });

  // Orchestration / RAG framework
  const orchestration: ToolPick[] = [
    { name: "LangChain", tier: "Free", why: "Rich tool/use-cases, agents, RAG; huge ecosystem." },
    { name: "LlamaIndex", tier: "Free", why: "Document pipelines, adapters, observability; quick to production." },
  ];

  // LLMOps / Observability
  const llmops: ToolPick[] = [
    { name: "LangSmith", tier: "$$", why: "Tracing, evals, datasets, model comp; tight with LangChain." },
    { name: "Arize Phoenix", tier: "Free", why: "Open-source tracing/evals; great for experiments." },
    { name: "Weights & Biases", tier: "$$$", why: "ML experiments, fine-tuning tracking, teams/enterprise." },
    { name: "Humanloop", tier: "$$", why: "Prompt mgmt, evals, human-in-the-loop for enterprise governance." },
  ];

  // ETL / Data movement
  const etl: ToolPick[] = [
    { name: "Airbyte", tier: "Free", why: "Open-source connectors; move data to warehouses/lakes." },
    { name: "Fivetran", tier: "$$$", why: "Managed ELT with reliability SLAs; enterprise friendly." },
    { name: "Meltano", tier: "Free", why: "Singers taps; dev-friendly pipelines; self-hostable." },
  ];

  // Warehouses / Storage
  const storage: ToolPick[] = [];
  if (prefersGCP) storage.push({ name: "BigQuery", tier: "$$$", why: "Serverless analytics, great with Vertex AI and Looker." });
  if (prefersAWS) storage.push({ name: "Redshift", tier: "$$$", why: "AWS-native warehouse, integrates with Bedrock, Step Functions." });
  storage.push({ name: "Snowflake", tier: "$$$", why: "Cross-cloud, secure data sharing + Snowpark/ML features." });
  storage.push({ name: "Postgres", tier: "$", why: "OLTP + analytics-lite; pgvector co-location for simple stacks." });
  storage.push({ name: "S3 or GCS", tier: "$", why: "Cheap object storage for documents, logs, embeddings backups." });

  // Search
  const search: ToolPick[] = [
    { name: "Elasticsearch / OpenSearch", tier: "$$", why: "Hybrid search (keyword+vector), logs APM; mature ecosystem." },
    { name: "Typesense", tier: "$", why: "Fast, simple search for apps; self-host or managed." },
  ];

  // Realtime / Queue
  const realtime: ToolPick[] = [
    { name: "Supabase Realtime", tier: "Free", why: "Simple websockets; pairs with Postgres." },
    { name: "Redis (Upstash)", tier: "$", why: "Queues, caching, rate-limiters, KV; serverless friendly." },
    { name: "Kafka (Managed)", tier: "$$$", why: "Event streaming at scale; if you already run Kafka." },
  ];

  // Hosting / Deployment / CI
  const hosting: ToolPick[] = [];
  if (a.cloud === "Vercel" || a.cloud === "No Preference") hosting.push({ name: "Vercel", tier: "$", why: "Great DX for Next.js; edge/serverless; previews; analytics." });
  if (prefersAWS) hosting.push({ name: "AWS (ECS/EKS/Lambda)", tier: "$$$", why: "Control + scale; IAM + networking; enterprise standard." });
  if (prefersGCP) hosting.push({ name: "GCP (Cloud Run/GKE)", tier: "$$$", why: "Serverless containers + K8s; integrates with Vertex." });
  if (prefersAzure) hosting.push({ name: "Azure (AKS/Functions)", tier: "$$$", why: "Enterprise IT alignment; Azure OpenAI + governance." });
  hosting.push({ name: "GitHub Actions", tier: "Free", why: "CI/CD for PRs, tests, lint; deploy to Vercel/cloud." });

  // Auth / Security
  const authsec: ToolPick[] = [
    { name: "Clerk", tier: "$", why: "Beautiful auth UI, orgs, MFA, passkeys, webhooks." },
    { name: "Auth0", tier: "$$$", why: "Enterprise SSO, B2B/B2E, RBAC, marketplace." },
    { name: "Supabase Auth", tier: "Free", why: "Easy JWT auth with Postgres + RLS." },
    { name: "OpenTelemetry + Sentry", tier: "$", why: "Tracing + error monitoring for reliability." },
  ];

  // Analytics / Product
  const analytics: ToolPick[] = [
    { name: "PostHog", tier: "$", why: "Open-source product analytics, events, feature flags, session replays." },
    { name: "GA4", tier: "Free", why: "Marketing analytics; attribution + ecommerce." },
    { name: "Amplitude", tier: "$$$", why: "Product analytics at enterprise scale; cohorts & experiments." },
  ];

  // Voice / Speech / Vision
  const speechVision: ToolPick[] = [];
  if (a.goals.includes("Speech-to-Text / Transcription")) speechVision.push({ name: "Whisper (OpenAI) or Deepgram", tier: "$", why: "High-quality STT for calls and media." });
  if (a.goals.includes("Voice/IVR Assistant")) speechVision.push({ name: "VAPI / Twilio", tier: "$$", why: "Programmable voice agents and telephony." });
  if (a.goals.includes("Vision/OCR")) speechVision.push({ name: "Google Vision / Azure Vision", tier: "$$", why: "OCR and multimodal vision at production quality." });

  // No/Low-code for business teams
  const noCode: ToolPick[] = [];
  if (nocode) {
    noCode.push({ name: "Make.com", tier: "$", why: "Workflow automation across SaaS apps (CRM/Support)." });
    noCode.push({ name: "Zapier", tier: "$", why: "Fast automations; great for prototypes." });
    noCode.push({ name: "Retool", tier: "$$", why: "Internal tools on top of DBs/APIs; auth + permissions." });
  }

  // Goal-specific app picks
  const appLayer: ToolPick[] = [];
  if (a.goals.includes("Customer Support Chatbot")) {
    appLayer.push({ name: "Custom Next.js chat + RAG", tier: "Free", why: "Own UX + data, connect to vector DB + LLM; no vendor lock-in." });
    appLayer.push({ name: "Intercom Fin", tier: "$$$", why: "If you live in Intercom, built-in AI support with controls." });
  }
  if (a.goals.includes("Internal Q&A (Docs/RAG)")) {
    appLayer.push({ name: "Docs Q&A (LlamaIndex)", tier: "Free", why: "Fast to wire up enterprise doc repos; observability built-in." });
  }
  if (a.goals.includes("Agent Automation/Workflows")) {
    appLayer.push({ name: "LangGraph / CrewAI", tier: "Free", why: "Structured multi-agent workflows; tools + memory." });
  }
  if (a.goals.includes("Content Generation")) {
    appLayer.push({ name: "Batch content pipelines (LangChain)", tier: "Free", why: "Templates, guards, evals; CMS publishing hooks." });
  }
  if (a.goals.includes("Lead Scoring & Personalization")) {
    appLayer.push({ name: "Segment + PostHog + RAG", tier: "$$", why: "Unify events with content; tailor journeys with AI." });
  }
  if (a.goals.includes("Analytics/Insights")) {
    appLayer.push({ name: "dbt + warehouse + GPT analyses", tier: "$$", why: "Model metrics; GPT on top for NL insights/dashboards." });
  }
  if (a.goals.includes("Recommendation Engine")) {
    appLayer.push({ name: "Implicit matrix + RAG hybrid", tier: "Free", why: "Blend collab filtering with content-based for relevance." });
  }

  // Adjustments for regulated industries
  if (isHealthcare) {
    llmops.unshift({ name: "Azure OpenAI Content Filters", tier: "$$", why: "Compliance guardrails & logging." });
    authsec.unshift({ name: "Azure AD / Entra ID", tier: "$$$", why: "Enterprise SSO, SCIM, conditional access." });
  }
  if (isFinance) {
    authsec.unshift({ name: "Okta", tier: "$$$", why: "Mature SSO + governance for fintech environments." });
  }

  // Estimated monthly (very rough, depends on usage)
  let estimatedMonthly = "~$500–$2.5k";
  if (scrappy) estimatedMonthly = "~$50–$300";
  else if (lean) estimatedMonthly = "~$300–$2k";
  else if (enterprise) estimatedMonthly = "$10k+";

  const categories: CategoryRec[] = [
    { category: "Model Provider(s)", picks: modelPicks },
    { category: "Vector DB / Search", picks: vectorDB.concat(search) },
    { category: "Orchestration & RAG", picks: orchestration },
    { category: "LLMOps / Observability", picks: llmops },
    { category: "ETL / Ingestion", picks: etl },
    { category: "Storage / Warehouse", picks: storage },
    { category: "Realtime & Queues", picks: realtime },
    { category: "Hosting & CI/CD", picks: hosting },
    { category: "Auth & Security", picks: authsec },
    { category: "Analytics / Product", picks: analytics },
  ];

  if (speechVision.length) categories.push({ category: "Voice / Speech / Vision", picks: speechVision });
  if (noCode.length) categories.push({ category: "No/Low-Code Options", picks: noCode });
  if (appLayer.length) categories.push({ category: "Application Layer", picks: appLayer });

  const summary = [
    `Industry: ${a.industry} | Team: ${a.teamSize} | Skill: ${a.teamSkill}`,
    `Cloud: ${a.cloud} | Compliance: ${a.compliance.join(", ")}`,
    `Budget: $${a.monthlyBudget}/mo | Latency critical: ${a.latencyCritical ? "Yes" : "No"}`,
    `PII Sensitive: ${a.piiSensitive ? "Yes" : "No"}`,
    `Goals: ${a.goals.join(", ")}`,
    `Data Sources: ${a.dataSources.join(", ")}`,
    a.integrations.length ? `Integrations: ${a.integrations.join(", ")}` : "",
  ].filter(Boolean).join("\n");

  const nextSteps = [
    "Spin up a prototype on Next.js + Vercel with a /api/chat tool-call endpoint.",
    "Stand up pgvector + Qdrant or Pinecone for embeddings and hybrid search.",
    "Ingest priority docs via LlamaIndex; wire tracing with LangSmith or Phoenix.",
    "Add auth (Clerk/Auth0) and role-based data filters (row-level security).",
    "Define success metrics; set up evals (accuracy, latency, cost) and dashboards.",
  ];

  const plan: StackPlan = { summary, categories, estimatedMonthly, nextSteps };
  applyIndustryAdjustments(a, plan);
  return plan;
}

// ---------------------------- UI Helpers ----------------------------

const Section: React.FC<{ title: string; icon?: React.ReactNode; subtitle?: string; right?: React.ReactNode; children?: React.ReactNode }>= ({ title, icon, subtitle, right, children }) => (
  <div className="space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xl font-semibold">
          {icon}
          <span>{title}</span>
        </div>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
    {children}
  </div>
);

const StepPill: React.FC<{ active?: boolean; done?: boolean; label: string }>= ({ active, done, label }) => (
  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${active ? "bg-primary text-primary-foreground" : done ? "bg-muted text-foreground" : "bg-background text-muted-foreground"}`}>
    {label}
  </div>
);

function toMarkdown(plan: StackPlan): string {
  let md = `# AI Stack Plan\n\n`;
  md += `## Summary\n${plan.summary}\n\n`;
  md += `**Estimated Monthly Cost:** ${plan.estimatedMonthly}\n\n`;
  
  plan.categories.forEach(cat => {
    md += `## ${cat.category}\n\n`;
    cat.picks.forEach(pick => {
      md += `### ${pick.name} (${pick.tier})\n${pick.why}\n\n`;
    });
  });
  
  md += `## Next Steps\n\n`;
  plan.nextSteps.forEach((step, i) => {
    md += `${i + 1}. ${step}\n`;
  });
  
  return md;
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------- Page ----------------------------

export default function AIStackBuilderPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [showResults, setShowResults] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailInfo, setEmailInfo] = useState({ name: "", business: "", email: "", consent: true });
  const { toast } = useToast();

  const plan = useMemo(() => generateStack(answers), [answers]);

  const steps = [
    "Company",
    "Goals", 
    "Data & Infra",
    "Budget & Risk",
    "Notes",
    "Review",
  ];

  const goNext = () => setStep((s) => Math.min(steps.length, s + 1));
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  const toggleArray = (key: keyof Answers, value: string) => {
    setAnswers((prev) => {
      const arr = new Set((prev[key] as unknown as string[]) || []);
      arr.has(value) ? arr.delete(value) : arr.add(value);
      return { ...prev, [key]: Array.from(arr) } as Answers;
    });
  };

  const onGenerate = () => {
    setShowResults(true);
    setStep(steps.length);
  };

  const onSend = async () => {
    if (!emailInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInfo.email)) {
      toast({ title: "Enter a valid email", description: "Please provide a valid email to receive your stack.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/send-stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: emailInfo.name,
          business: emailInfo.business,
          email: emailInfo.email,
          plan,
          answers,
          crm: { provider: "None" }
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send");
      toast({ title: "Sent!", description: "Your personalized AI stack is on its way." });
    } catch (err: any) {
      toast({ title: "Email failed", description: err?.message || String(err), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Build My AI Stack</h1>
              <p className="text-sm text-muted-foreground">Get personalized AI tool recommendations tailored to your business needs</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {steps.map((lbl, i) => (
              <StepPill key={lbl} label={`${i + 1}. ${lbl}`} active={i + 1 === step} done={i + 1 < step} />
            ))}
          </div>
        </div>

        <Card className="shadow-lg border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5" /> Wizard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <Section title="Company" icon={<Building2 className="h-5 w-5" />} subtitle="Tell us about your team and industry">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Company name</Label>
                        <Input value={answers.companyName} placeholder="Acme Corp" onChange={(e) => setAnswers({ ...answers, companyName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Industry</Label>
                        <Select value={answers.industry} onValueChange={(v: Industry) => setAnswers({ ...answers, industry: v })}>
                          <SelectTrigger><SelectValue placeholder="Choose industry" /></SelectTrigger>
                          <SelectContent>
                            {(["Real Estate","Legal / Law Firm","Finance / Accounting","Recruiting / Staffing","Marketing / Creative Agency","Influencer / Podcast / Media","Course Creator / Coach / Educator","SaaS / Software","AI Builder / Startup","Manufacturing / Logistics","Gaming / Esports","Travel / Tourism","Healthcare / Medical","Fitness / Personal Training","Medical Aesthetics / Beauty","E-commerce / Retail","Automotive / Dealership","Construction / Contracting","Hospitality / Restaurant / Hotel","Home Services (Cleaning, HVAC, Landscaping)","Nonprofit / Social Impact","Freelancers / Solopreneurs","Other"] as Industry[]).map((i)=> (
                              <SelectItem key={i} value={i}>{i}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Team size</Label>
                        <div className="px-2">
                          <Slider value={[answers.teamSize]} min={1} max={1000} step={1} onValueChange={(v) => setAnswers({ ...answers, teamSize: v[0] })} />
                          <div className="text-xs text-muted-foreground mt-1">{answers.teamSize} people</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Team skill</Label>
                        <Select value={answers.teamSkill} onValueChange={(v: TeamSkill) => setAnswers({ ...answers, teamSkill: v })}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {(["No-code","Low-code","Full-stack","ML/DS Team"] as TeamSkill[]).map((s)=> (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Region</Label>
                        <Input value={answers.region} onChange={(e)=> setAnswers({ ...answers, region: e.target.value })} placeholder="United States" />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary cloud / hosting</Label>
                        <Select value={answers.cloud} onValueChange={(v: Cloud) => setAnswers({ ...answers, cloud: v })}>
                          <SelectTrigger><SelectValue placeholder="Select cloud" /></SelectTrigger>
                          <SelectContent>
                            {(["Vercel","AWS","GCP","Azure","Self-Hosted","No Preference"] as Cloud[]).map((c)=> (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Compliance requirements</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["HIPAA","GDPR","SOC2","PCI","None"].map((c)=> (
                            <Button key={c} type="button" variant={(answers.compliance.includes(c as Compliance))?"secondary":"outline"} onClick={()=> toggleArray("compliance", c)} className="justify-start">
                              {c}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Gauge className="h-4 w-4"/>Latency critical?</Label>
                        <div className="flex items-center gap-3">
                          <Switch checked={answers.latencyCritical} onCheckedChange={(v)=> setAnswers({ ...answers, latencyCritical: v })} />
                          <span className="text-sm text-muted-foreground">Real-time UX or sub-500ms responses</span>
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label className="flex items-center gap-2"><Lock className="h-4 w-4"/>PII / sensitive data</Label>
                          <div className="flex items-center gap-3">
                            <Switch checked={answers.piiSensitive} onCheckedChange={(v)=> setAnswers({ ...answers, piiSensitive: v })} />
                            <span className="text-sm text-muted-foreground">We process or store PII/PHI/financial data</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Section>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <Section title="Goals" icon={<Bot className="h-5 w-5" />} subtitle="What are you trying to ship in the next 30–90 days?">
                    <div className="grid md:grid-cols-2 gap-2">
                      {ALL_GOALS.map((g)=> (
                        <Button key={g} type="button" variant={answers.goals.includes(g)?"secondary":"outline"} className="justify-start" onClick={()=> toggleArray("goals", g)}>
                          {g}
                        </Button>
                      ))}
                    </div>
                  </Section>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <Section title="Data & Infrastructure" icon={<Database className="h-5 w-5" />} subtitle="Where does your knowledge live today?">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Primary data sources</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
                          {ALL_DATASOURCES.map((d)=> (
                            <Button key={d} type="button" variant={(answers.dataSources.includes(d))?"secondary":"outline"} className="justify-start" onClick={()=> toggleArray("dataSources", d)}>
                              {d}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred integrations</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
                          {ALL_INTEGRATIONS.map((d)=> (
                            <Button key={d} type="button" variant={(answers.integrations.includes(d))?"secondary":"outline"} className="justify-start" onClick={()=> toggleArray("integrations", d)}>
                              {d}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Section>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <Section title="Budget & Risk" icon={<DollarSign className="h-5 w-5" />} subtitle="Set realistic constraints">
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                      <div className="space-y-2">
                        <Label>Monthly budget</Label>
                        <div className="px-2">
                          <Slider value={[answers.monthlyBudget]} min={50} max={20000} step={50} onValueChange={(v)=> setAnswers({ ...answers, monthlyBudget: v[0] })} />
                          <div className="text-xs text-muted-foreground mt-1">${answers.monthlyBudget}/mo</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Risk posture</Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Enterprise-grade governance",
                            "Cost optimization",
                            "Fastest time-to-value",
                            "On-prem / self-hosting",
                          ].map((r)=> (
                            <Badge key={r} variant="outline">{r}</Badge>
                          ))}
                          <p className="text-xs text-muted-foreground w-full">(Used heuristically by the recommender)</p>
                        </div>
                      </div>
                    </div>
                  </Section>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <Section title="Notes" icon={<FileText className="h-5 w-5" />} subtitle="Anything unique we should factor in?">
                    <Textarea placeholder="e.g., Must support HIPAA BAAs; migrate from Zendesk; keep data in EU; sub-300ms response target; no vendor lock-in; multi-tenant B2B." value={answers.notes} onChange={(e)=> setAnswers({ ...answers, notes: e.target.value })} />
                  </Section>
                </motion.div>
              )}

              {step === 6 && !showResults && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <Section title="Review" icon={<ClipboardList className="h-5 w-5" />} subtitle="Confirm and generate your personalized stack">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Overview</Label>
                        <Card className="border-dashed">
                          <CardContent className="pt-4 text-sm whitespace-pre-wrap">
                            {plan.summary}
                          </CardContent>
                        </Card>
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated Monthly</Label>
                        <div className="text-2xl font-bold">{plan.estimatedMonthly}</div>
                        <p className="text-xs text-muted-foreground">Real usage may vary by traffic, context window, and storage scale.</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-xs text-muted-foreground">You can tweak inputs anytime after generation.</div>
                      <Button onClick={onGenerate} size="lg" className="gap-2"><Wand2 className="h-4 w-4"/>Generate Stack</Button>
                    </div>
                  </Section>
                </motion.div>
              )}

              {step === 6 && showResults && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5"/>Recommended Stack</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 max-h-96 overflow-y-auto">
                        {plan.categories.map((cat)=> (
                          <div key={cat.category} className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-semibold"><GitBranch className="h-4 w-4"/>{cat.category}</div>
                            <div className="space-y-2">
                              {cat.picks.slice(0, 3).map((p)=> (
                                <div key={`${cat.category}-${p.name}`} className="rounded-xl border p-3 hover:shadow-sm transition">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div className="font-medium text-sm">{p.name}</div>
                                      <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.why}</div>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">{p.tier}</Badge>
                                  </div>
                                </div>
                              ))}
                              {cat.picks.length > 3 && (
                                <div className="text-xs text-muted-foreground">+{cat.picks.length - 3} more options</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <Card className="shadow-md">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5"/>Download Your Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                              <Label>Full name</Label>
                              <Input placeholder="Jane Doe" value={emailInfo.name} onChange={(e)=> setEmailInfo({ ...emailInfo, name: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <Label>Business name</Label>
                              <Input placeholder="Acme Corp" value={emailInfo.business} onChange={(e)=> setEmailInfo({ ...emailInfo, business: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <Label>Email</Label>
                              <Input type="email" placeholder="you@company.com" value={emailInfo.email} onChange={(e)=> setEmailInfo({ ...emailInfo, email: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox id="consent" checked={emailInfo.consent} onCheckedChange={(v)=> setEmailInfo({ ...emailInfo, consent: Boolean(v) })} />
                              <Label htmlFor="consent" className="text-xs text-muted-foreground">I agree to receive my AI stack and relevant follow-ups.</Label>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button onClick={onSend} disabled={sending} className="gap-2">
                              <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send to Email"}
                            </Button>
                            <Button variant="outline" className="gap-2" onClick={()=> download("ai-stack.md", toMarkdown(plan))}><Download className="h-4 w-4"/>Download</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-md">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5"/>Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-xs whitespace-pre-wrap leading-relaxed bg-muted/40 rounded-md p-3">{plan.summary}</pre>
                          <div className="text-xs text-muted-foreground mt-2">Estimated monthly: <span className="font-medium">{plan.estimatedMonthly}</span></div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showResults && (
              <div className="flex items-center justify-between pt-6 border-t">
                <Button onClick={goPrev} disabled={step === 1} variant="outline" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />Previous
                </Button>
                <div className="text-xs text-muted-foreground">
                  Step {step} of {steps.length}
                </div>
                <Button onClick={goNext} disabled={step === steps.length} size="sm" className="gap-2">
                  Next<ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-[11px] text-muted-foreground mt-6">*Recommendations are heuristic and should be validated against your usage, compliance and budget constraints. This wizard does not send data to any third party until you click Send.*</p>
      </div>
    </div>
  );
}