import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { NewHeader } from "@/components/redesign/NewHeader";
import Footer from "@/components/layout/Footer";
import { 
  Download, 
  Eye, 
  Settings, 
  Palette, 
  Type, 
  Mail, 
  BarChart3, 
  Zap, 
  Code, 
  Play,
  Copy,
  Save,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  MousePointer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Templates for quick start
const TEMPLATES = [
  {
    id: "ebook",
    name: "eBook / Guide", 
    desc: "Downloadable PDF with chapters, checklists, and templates.",
    preset: {
      headline: "The Ultimate Playbook to 10× Your Pipeline",
      subheadline: "Steal our proven frameworks for landing page, ads, and nurture.",
      bullets: [
        "High‑converting page checklist",
        "7 email drips you can copy", 
        "ROI calculator + dashboard"
      ],
      cta: "Get the free eBook",
      accent: "#3b82f6"
    }
  },
  {
    id: "checklist",
    name: "Checklist / Cheatsheet",
    desc: "One‑pager with critical steps and quick wins.",
    preset: {
      headline: "Launch Checklist: From Idea → Impact in 7 Days",
      subheadline: "The exact steps our team runs with new clients.",
      bullets: [
        "Research & ICP fit",
        "Offer & pricing grid", 
        "Ads → Landing → Nurture map"
      ],
      cta: "Send me the checklist",
      accent: "#10b981"
    }
  },
  {
    id: "calculator",
    name: "ROI Calculator",
    desc: "Interactive numbers → instant value + email capture.",
    preset: {
      headline: "What's Your Growth ROI?",
      subheadline: "Plug in your numbers to reveal the upside.",
      bullets: ["CAC, LTV, payback period", "Benchmarks by industry"],
      cta: "Reveal my results",
      accent: "#a855f7"
    }
  },
  {
    id: "webinar",
    name: "Webinar / RSVP", 
    desc: "Collect registrations + calendar holds + reminders.",
    preset: {
      headline: "Live Workshop: AI That Actually Drives Revenue",
      subheadline: "See real stacks, live builds, and copy‑paste recipes.",
      bullets: ["Real demos", "Q&A with builders", "Take‑home templates"],
      cta: "Save my seat",
      accent: "#f59e0b"
    }
  },
  {
    id: "coupon",
    name: "Coupon / Limited Offer",
    desc: "Time‑boxed incentive for trials or ecommerce.",
    preset: {
      headline: "New Customer Offer",
      subheadline: "Save 20% on your first order this week only.",
      bullets: ["Instant code via email", "Expires in 7 days"],
      cta: "Unlock my code", 
      accent: "#ef4444"
    }
  },
  {
    id: "quiz",
    name: "Quiz / Assessment",
    desc: "Personalized result with segments for nurture.",
    preset: {
      headline: "What's Your AI Readiness Score?",
      subheadline: "5‑minute diagnostic → tailored roadmap.",
      bullets: ["Scorecard", "Next steps", "Tools to adopt"],
      cta: "Get my score",
      accent: "#06b6d4"
    }
  }
];

const DEFAULT_FIELDS = [
  { id: "firstName", label: "First name", type: "text", required: true },
  { id: "email", label: "Work email", type: "email", required: true },
];

const NEW_FIELD = () => ({ 
  id: `f_${Math.random().toString(36).slice(2, 7)}`, 
  label: "New field", 
  type: "text", 
  required: false 
});

const EMPTY_CONFIG = {
  name: "Untitled Lead Magnet",
  type: "ebook",
  theme: {
    accent: "#3b82f6",
    bg: "#0b1020", 
    fg: "#ffffff",
    font: "ui-sans-serif",
    logoText: "Your Brand"
  },
  content: {
    headline: "The Ultimate Playbook to 10× Your Pipeline",
    subheadline: "Steal our proven frameworks for landing page, ads, and nurture.",
    bullets: ["High‑converting page checklist", "7 email drips you can copy", "ROI calculator + dashboard"],
    cta: "Get the free eBook"
  },
  form: {
    fields: DEFAULT_FIELDS,
    consent: {
      enabled: true,
      text: "I agree to receive communications and accept the Privacy Policy.",
      required: true,
    },
    hidden: {
      utm_source: true,
      utm_medium: true, 
      utm_campaign: true,
      referrer: true
    },
    scoring: [
      { fieldId: "email", points: 5 },
      { fieldId: "company", points: 3 }
    ]
  },
  delivery: {
    method: "email",
    emailSubject: "Here's your download + a quick gift",
    emailBody: "Hi {{firstName}},\n\nHere's your resource: {{assetUrl}}.\nI added a bonus template we use with new clients. If helpful, grab a free consult here: {{bookingUrl}}.\n\nCheers,\n{{sender}}",
    assetUrl: "https://example.com/ebook.pdf",
    redirectUrl: "",
    bookingUrl: "https://cal.com/yourteam/intro"
  },
  integrations: {
    mailchimp: { enabled: false, apiKey: "", listId: "" },
    hubspot: { enabled: false, portalId: "", formId: "" },
    klaviyo: { enabled: false, apiKey: "", listId: "" },
    salesforce: { enabled: false, instance: "", token: "" },
    webhook: { enabled: true, url: "" },
    sheets: { enabled: false }
  },
  abtest: {
    enabled: false,
    variants: [
      { key: "A", weight: 50, changes: {} },
      { key: "B", weight: 50, changes: { content: { headline: "Get 30% More Demo Requests in 30 Days" } } }
    ]
  },
  launch: {
    slug: "untitled",
    publishedUrl: "",
  },
  analytics: {
    views: 127,
    conversions: 23,
    rate: 18.1,
    last24h: [
      { ts: Date.now() - 23*60*60*1000, views: 12, conv: 2 },
      { ts: Date.now() - 22*60*60*1000, views: 8, conv: 1 },
      { ts: Date.now() - 21*60*60*1000, views: 15, conv: 3 },
      { ts: Date.now() - 20*60*60*1000, views: 6, conv: 1 },
      { ts: Date.now() - 19*60*60*1000, views: 9, conv: 2 },
      { ts: Date.now() - 18*60*60*1000, views: 18, conv: 4 },
      { ts: Date.now() - 17*60*60*1000, views: 11, conv: 1 },
      { ts: Date.now() - 16*60*60*1000, views: 14, conv: 3 },
    ]
  }
};

function classNames(...arr: (string | false | undefined)[]) {
  return arr.filter(Boolean).join(" ");
}

function copyToClipboard(text: string) {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement("textarea");
    el.value = text; 
    document.body.appendChild(el); 
    el.select(); 
    document.execCommand("copy"); 
    document.body.removeChild(el);
  }
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function collectHidden() {
  const url = new URL(window.location.href);
  const params: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(k => {
    const v = url.searchParams.get(k);
    if (v) params[k] = v;
  });
  params["referrer"] = document.referrer || "";
  return params;
}

export default function LeadMagnetBuilder() {
  const [config, setConfig] = useState<any>(EMPTY_CONFIG);
  const [active, setActive] = useState<string>("templates");
  const [previewSubmitted, setPreviewSubmitted] = useState<any | null>(null);
  const { toast } = useToast();

  const embedCode = useMemo(() => {
    const payload = { slug: config.launch.slug || slugify(config.name), version: 1 };
    const url = `https://advantaai.com/lead/${payload.slug}`;
    return {
      iframe: `<iframe src="${url}" style="width:100%;height:680px;border:0" title="Lead magnet: ${config.name}"></iframe>`,
      script: `<script src="https://advantaai.com/leadmagnet.js" data-config='${JSON.stringify(payload)}'></script>`
    };
  }, [config.name, config.launch.slug]);

  const onChooseTemplate = (t: any) => {
    setConfig((c: any) => ({
      ...c,
      type: t.id,
      theme: { ...c.theme, accent: t.preset.accent },
      content: { ...c.content, ...t.preset }
    }));
    setActive("content");
  };

  const addField = () => setConfig((c: any) => ({
    ...c,
    form: { ...c.form, fields: [...c.form.fields, NEW_FIELD()] }
  }));

  const removeField = (id: string) => setConfig((c: any) => ({
    ...c,
    form: { ...c.form, fields: c.form.fields.filter((f: any) => f.id !== id) }
  }));

  const handlePublish = () => {
    const slug = config.launch.slug || slugify(config.name);
    setConfig((c: any) => ({ 
      ...c, 
      launch: { 
        ...c.launch, 
        slug, 
        publishedUrl: `https://advantaai.com/lead/${slug}` 
      }
    }));
    toast({ title: "Published!", description: "Your lead magnet is now live." });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; 
    a.download = `${slugify(config.name)}.leadmagnet.json`; 
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Lead magnet configuration downloaded." });
  };

  const simulateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    config.form.fields.forEach((f: any) => data[f.id] = fd.get(f.id));
    const hidden = collectHidden();

    let score = 0;
    (config.form.scoring || []).forEach((s: any) => { 
      if (data[s.fieldId]) score += s.points; 
    });

    const payload = { type: config.type, data, hidden, score, ts: Date.now() };
    setPreviewSubmitted(payload);

    // Simulate analytics update
    setConfig((c: any) => ({
      ...c,
      analytics: {
        ...c.analytics,
        conversions: c.analytics.conversions + 1,
        rate: ((c.analytics.conversions + 1) / c.analytics.views * 100).toFixed(1)
      }
    }));

    toast({ title: "Form submitted!", description: "Preview mode - check delivery settings." });
  };

  const Sidebar = () => (
    <aside className="w-full lg:w-72 shrink-0 border-r border-blue-200 bg-white/80 backdrop-blur shadow-lg">
      <div className="p-6 border-b border-blue-100">
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-700 font-medium">Project Name</Label>
            <Input
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="mt-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="My Lead Magnet"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600 font-medium">URL Slug</Label>
            <Input
              value={config.launch.slug}
              onChange={(e) => setConfig({ 
                ...config, 
                launch: { ...config.launch, slug: slugify(e.target.value) } 
              })}
              className="mt-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="my-awesome-offer"
            />
            <div className="text-xs text-gray-500 mt-1">
              advantaai.com/lead/{config.launch.slug}
            </div>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <div className="space-y-1">
          {[
            ["templates", "Templates", Type],
            ["design", "Design", Palette], 
            ["content", "Content", Type],
            ["form", "Form", Settings],
            ["delivery", "Delivery", Mail],
            ["integrations", "Integrations", Zap],
            ["abtest", "A/B Test", BarChart3],
            ["launch", "Launch", Play],
            ["analytics", "Analytics", TrendingUp],
          ].map(([key, label, IconComponent]: [string, string, any]) => (
            <button 
              key={key} 
              onClick={() => setActive(key)}
              className={classNames(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                active === key 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
              )}
            >
              <IconComponent className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        
        <Separator className="my-4 bg-blue-100" />
        
        <div className="space-y-2">
          <Button 
            onClick={exportJSON} 
            variant="outline" 
            size="sm" 
            className="w-full justify-start bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button 
            onClick={() => copyToClipboard(JSON.stringify(config, null, 2))} 
            variant="outline" 
            size="sm" 
            className="w-full justify-start bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Config
          </Button>
        </div>
      </nav>
    </aside>
  );

  const Templates = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template</h2>
        <p className="text-gray-600">Start with a proven template and customize to match your brand.</p>
      </div>
      
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {TEMPLATES.map(t => (
          <Card key={t.id} className="bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900">{t.name}</CardTitle>
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: t.preset.accent }}
                />
              </div>
              <p className="text-sm text-gray-600">{t.desc}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">Preview:</div>
                <div 
                  className="font-semibold text-sm leading-tight"
                  style={{ color: t.preset.accent }}
                >
                  {t.preset.headline}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => onChooseTemplate(t)} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Use Template
                </Button>
                <Button 
                  onClick={() => {
                    setConfig((c: any) => ({ ...c, type: t.id })); 
                    setActive("content");
                  }} 
                  variant="outline"
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const Design = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Design & Branding</h2>
        <p className="text-gray-600">Customize the look and feel to match your brand.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Brand Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium">Brand / Logo Text</Label>
                <Input
                  value={config.theme.logoText}
                  onChange={(e) => setConfig({
                    ...config,
                    theme: { ...config.theme, logoText: e.target.value }
                  })}
                  className="mt-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <Label className="text-gray-700 font-medium">Accent Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={config.theme.accent}
                    onChange={(e) => setConfig({
                      ...config,
                      theme: { ...config.theme, accent: e.target.value }
                    })}
                    className="w-12 h-10 p-1 bg-white border-gray-200"
                  />
                  <Input
                    value={config.theme.accent}
                    onChange={(e) => setConfig({
                      ...config,
                      theme: { ...config.theme, accent: e.target.value }
                    })}
                    className="flex-1 bg-white border-gray-200 text-gray-900"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-gray-700 font-medium">Font Family</Label>
                <Select
                  value={config.theme.font}
                  onValueChange={(value) => setConfig({
                    ...config,
                    theme: { ...config.theme, font: value }
                  })}
                >
                  <SelectTrigger className="mt-1 bg-white border-gray-200 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ui-sans-serif">System UI</SelectItem>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="ui-serif">System Serif</SelectItem>
                    <SelectItem value="ui-monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-500 font-medium">Live Preview</div>
          <div 
            className="p-6 rounded-2xl border"
            style={{ 
              backgroundColor: config.theme.bg,
              borderColor: config.theme.accent + "30"
            }}
          >
            <div 
              className="text-sm font-semibold mb-4"
              style={{ color: config.theme.accent }}
            >
              {config.theme.logoText}
            </div>
            <div 
              className="text-2xl font-bold mb-2"
              style={{ color: config.theme.fg }}
            >
              {config.content.headline}
            </div>
            <div 
              className="text-slate-400 mb-4"
              style={{ color: config.theme.fg + "80" }}
            >
              {config.content.subheadline}
            </div>
            <button 
              className="px-6 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: config.theme.accent }}
            >
              {config.content.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Content = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content & Copy</h2>
        <p className="text-gray-600">Write compelling copy that converts visitors into leads.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Headlines & Copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium">Main Headline</Label>
                <Textarea
                  value={config.content.headline}
                  onChange={(e) => setConfig({
                    ...config,
                    content: { ...config.content, headline: e.target.value }
                  })}
                  className="mt-1 bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              
              <div>
                <Label className="text-gray-700 font-medium">Subheadline</Label>
                <Textarea
                  value={config.content.subheadline}
                  onChange={(e) => setConfig({
                    ...config,
                    content: { ...config.content, subheadline: e.target.value }
                  })}
                  className="mt-1 bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              
              <div>
                <Label className="text-gray-700 font-medium">Benefits (one per line)</Label>
                <Textarea
                  value={config.content.bullets.join("\n")}
                  onChange={(e) => setConfig({
                    ...config,
                    content: { 
                      ...config.content, 
                      bullets: e.target.value.split("\n").filter(b => b.trim()) 
                    }
                  })}
                  className="mt-1 bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                />
              </div>
              
              <div>
                <Label className="text-gray-700 font-medium">Call-to-Action Button</Label>
                <Input
                  value={config.content.cta}
                  onChange={(e) => setConfig({
                    ...config,
                    content: { ...config.content, cta: e.target.value }
                  })}
                  className="mt-1 bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-500 font-medium">Live Preview</div>
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div 
                  className="text-sm font-semibold"
                  style={{ color: config.theme.accent }}
                >
                  {config.theme.logoText}
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    {config.content.headline}
                  </h1>
                  <p className="text-lg text-slate-400">
                    {config.content.subheadline}
                  </p>
                </div>
                
                <div className="space-y-3">
                  {config.content.bullets.map((bullet: string, i: number) => (
                    <div key={i} className="flex items-center text-slate-300">
                      <CheckCircle 
                        className="w-5 h-5 mr-3 flex-shrink-0" 
                        style={{ color: config.theme.accent }}
                      />
                      {bullet}
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="text-white font-semibold"
                  style={{ backgroundColor: config.theme.accent }}
                >
                  {config.content.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const FormBuilder = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Builder</h2>
        <p className="text-gray-600">Configure the lead capture form and data collection.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900">Form Fields</CardTitle>
              <Button onClick={addField} size="sm" variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.form.fields.map((field: any, index: number) => (
                <div key={field.id} className="p-4 border border-gray-200 rounded-xl space-y-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Field {index + 1}</div>
                    {config.form.fields.length > 1 && (
                      <Button
                        onClick={() => removeField(field.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600 font-medium">Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => {
                          const newFields = [...config.form.fields];
                          newFields[index] = { ...field, label: e.target.value };
                          setConfig({
                            ...config,
                            form: { ...config.form, fields: newFields }
                          });
                        }}
                        className="bg-white border-gray-200 text-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-600 font-medium">Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) => {
                          const newFields = [...config.form.fields];
                          newFields[index] = { ...field, type: value };
                          setConfig({
                            ...config,
                            form: { ...config.form, fields: newFields }
                          });
                        }}
                      >
                        <SelectTrigger className="bg-white border-gray-200 text-gray-900 text-sm focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="tel">Phone</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => {
                        const newFields = [...config.form.fields];
                        newFields[index] = { ...field, required: checked };
                        setConfig({
                          ...config,
                          form: { ...config.form, fields: newFields }
                        });
                      }}
                    />
                    <Label className="text-sm text-slate-300">Required field</Label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Consent & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.form.consent.enabled}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    form: {
                      ...config.form,
                      consent: { ...config.form.consent, enabled: checked }
                    }
                  })}
                />
                <Label className="text-slate-300">Show consent checkbox</Label>
              </div>
              
              {config.form.consent.enabled && (
                <div>
                  <Label className="text-slate-300">Consent Text</Label>
                  <Textarea
                    value={config.form.consent.text}
                    onChange={(e) => setConfig({
                      ...config,
                      form: {
                        ...config.form,
                        consent: { ...config.form.consent, text: e.target.value }
                      }
                    })}
                    className="mt-1 bg-slate-800 border-slate-600 text-white"
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="text-sm text-slate-400">Form Preview</div>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <form onSubmit={simulateSubmit} className="space-y-4">
                {config.form.fields.map((field: any) => (
                  <div key={field.id}>
                    <Label className="text-slate-300">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        name={field.id}
                        required={field.required}
                        className="mt-1 bg-slate-800 border-slate-600 text-white"
                        rows={3}
                      />
                    ) : (
                      <Input
                        name={field.id}
                        type={field.type}
                        required={field.required}
                        className="mt-1 bg-slate-800 border-slate-600 text-white"
                      />
                    )}
                  </div>
                ))}
                
                {config.form.consent.enabled && (
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      required={config.form.consent.required}
                      className="mt-1"
                      style={{ accentColor: config.theme.accent }}
                    />
                    <Label className="text-xs text-slate-400 leading-relaxed">
                      {config.form.consent.text}
                    </Label>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: config.theme.accent }}
                >
                  {config.content.cta}
                </Button>
              </form>
              
              {previewSubmitted && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="text-sm text-green-400">✓ Form submitted successfully!</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Lead score: {previewSubmitted.score} points
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const Delivery = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Delivery Settings</h2>
        <p className="text-slate-400">Configure how leads receive their resources.</p>
      </div>
      
      <Card className="bg-slate-900/60 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Delivery Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-slate-300">Method</Label>
            <Select
              value={config.delivery.method}
              onValueChange={(value) => setConfig({
                ...config,
                delivery: { ...config.delivery, method: value }
              })}
            >
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Delivery</SelectItem>
                <SelectItem value="redirect">Redirect to URL</SelectItem>
                <SelectItem value="download">Instant Download</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {config.delivery.method === "email" && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Email Subject</Label>
                <Input
                  value={config.delivery.emailSubject}
                  onChange={(e) => setConfig({
                    ...config,
                    delivery: { ...config.delivery, emailSubject: e.target.value }
                  })}
                  className="mt-1 bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-slate-300">Email Body</Label>
                <Textarea
                  value={config.delivery.emailBody}
                  onChange={(e) => setConfig({
                    ...config,
                    delivery: { ...config.delivery, emailBody: e.target.value }
                  })}
                  className="mt-1 bg-slate-800 border-slate-600 text-white"
                  rows={6}
                />
                <div className="text-xs text-slate-500 mt-1">
                  Use variables: &#123;&#123;firstName&#125;&#125;, &#123;&#123;assetUrl&#125;&#125;, &#123;&#123;bookingUrl&#125;&#125;, &#123;&#123;sender&#125;&#125;
                </div>
              </div>
            </div>
          )}
          
          <div>
            <Label className="text-slate-300">Asset URL</Label>
            <Input
              value={config.delivery.assetUrl}
              onChange={(e) => setConfig({
                ...config,
                delivery: { ...config.delivery, assetUrl: e.target.value }
              })}
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              placeholder="https://example.com/ebook.pdf"
            />
          </div>
          
          <div>
            <Label className="text-slate-300">Booking URL (optional)</Label>
            <Input
              value={config.delivery.bookingUrl}
              onChange={(e) => setConfig({
                ...config,
                delivery: { ...config.delivery, bookingUrl: e.target.value }
              })}
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              placeholder="https://cal.com/yourteam/intro"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const Integrations = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Integrations</h2>
        <p className="text-slate-400">Connect your lead magnet to your marketing stack.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { key: "webhook", name: "Webhook", desc: "POST data to any URL" },
          { key: "mailchimp", name: "Mailchimp", desc: "Add to email lists" },
          { key: "hubspot", name: "HubSpot", desc: "Create contacts and deals" },
          { key: "klaviyo", name: "Klaviyo", desc: "Email marketing automation" },
          { key: "salesforce", name: "Salesforce", desc: "CRM lead management" },
          { key: "sheets", name: "Google Sheets", desc: "Spreadsheet logging" },
        ].map(({ key, name, desc }) => (
          <Card key={key} className="bg-slate-900/60 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{name}</CardTitle>
                  <p className="text-sm text-slate-400">{desc}</p>
                </div>
                <Switch
                  checked={config.integrations[key]?.enabled || false}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    integrations: {
                      ...config.integrations,
                      [key]: { ...config.integrations[key], enabled: checked }
                    }
                  })}
                />
              </div>
            </CardHeader>
            
            {config.integrations[key]?.enabled && (
              <CardContent className="space-y-3">
                {key === "webhook" && (
                  <div>
                    <Label className="text-slate-300">Webhook URL</Label>
                    <Input
                      value={config.integrations[key].url || ""}
                      onChange={(e) => setConfig({
                        ...config,
                        integrations: {
                          ...config.integrations,
                          [key]: { ...config.integrations[key], url: e.target.value }
                        }
                      })}
                      className="mt-1 bg-slate-800 border-slate-600 text-white"
                      placeholder="https://your-api.com/webhook"
                    />
                  </div>
                )}
                
                {key === "mailchimp" && (
                  <>
                    <div>
                      <Label className="text-slate-300">API Key</Label>
                      <Input
                        type="password"
                        value={config.integrations[key].apiKey || ""}
                        onChange={(e) => setConfig({
                          ...config,
                          integrations: {
                            ...config.integrations,
                            [key]: { ...config.integrations[key], apiKey: e.target.value }
                          }
                        })}
                        className="mt-1 bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">List ID</Label>
                      <Input
                        value={config.integrations[key].listId || ""}
                        onChange={(e) => setConfig({
                          ...config,
                          integrations: {
                            ...config.integrations,
                            [key]: { ...config.integrations[key], listId: e.target.value }
                          }
                        })}
                        className="mt-1 bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </>
                )}
                
                <div className="text-xs text-slate-500">
                  {key === "webhook" && "Sends lead data via POST request"}
                  {key === "mailchimp" && "Adds subscriber to specified list"}
                  {key === "hubspot" && "Creates contact with form data"}
                  {key === "klaviyo" && "Adds profile to email marketing"}
                  {key === "salesforce" && "Creates lead record in CRM"}
                  {key === "sheets" && "Appends row to Google Sheet"}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const ABTest = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">A/B Testing</h2>
        <p className="text-slate-400">Test different versions to optimize conversion rates.</p>
      </div>
      
      <Card className="bg-slate-900/60 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Test Configuration</CardTitle>
            <Switch
              checked={config.abtest.enabled}
              onCheckedChange={(checked) => setConfig({
                ...config,
                abtest: { ...config.abtest, enabled: checked }
              })}
            />
          </div>
        </CardHeader>
        
        {config.abtest.enabled && (
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {config.abtest.variants.map((variant: any, index: number) => (
                <div key={variant.key} className="p-4 border border-slate-700 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-medium">Variant {variant.key}</div>
                    <Badge variant="secondary">{variant.weight}% traffic</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Traffic Weight (%)</Label>
                      <Input
                        type="number"
                        value={variant.weight}
                        onChange={(e) => {
                          const newVariants = [...config.abtest.variants];
                          newVariants[index] = { ...variant, weight: parseInt(e.target.value) || 0 };
                          setConfig({
                            ...config,
                            abtest: { ...config.abtest, variants: newVariants }
                          });
                        }}
                        className="mt-1 bg-slate-800 border-slate-600 text-white"
                        min="0"
                        max="100"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-slate-300">Test Headline</Label>
                      <Input
                        value={variant.changes?.content?.headline || config.content.headline}
                        onChange={(e) => {
                          const newVariants = [...config.abtest.variants];
                          newVariants[index] = {
                            ...variant,
                            changes: {
                              ...variant.changes,
                              content: { ...variant.changes?.content, headline: e.target.value }
                            }
                          };
                          setConfig({
                            ...config,
                            abtest: { ...config.abtest, variants: newVariants }
                          });
                        }}
                        className="mt-1 bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg">
              <div className="font-medium mb-1">How it works:</div>
              <div>Traffic is split randomly between variants. Track conversion rates to identify the winning version.</div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );

  const Launch = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Launch & Embed</h2>
        <p className="text-gray-600">Publish your lead magnet and get embed codes.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Publish Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-700 font-medium">URL Slug</Label>
              <div className="flex gap-2 mt-1">
                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <span className="text-gray-500 text-sm">advantaai.com/lead/</span>
                  <span className="text-gray-900 font-medium">{config.launch.slug}</span>
                </div>
                <Button
                  onClick={() => copyToClipboard(`https://advantaai.com/lead/${config.launch.slug}`)}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handlePublish} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Publish Live
              </Button>
              <Button 
                onClick={() => setActive("preview")} 
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
            
            {config.launch.publishedUrl && (
              <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                ✓ Published at: {config.launch.publishedUrl}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Embed Codes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-700 font-medium">iframe Embed</Label>
                <Button
                  onClick={() => copyToClipboard(embedCode.iframe)}
                  size="sm"
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                value={embedCode.iframe}
                readOnly
                className="bg-gray-50 border-gray-200 text-gray-700 text-sm font-mono"
                rows={3}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-700 font-medium">Script Embed</Label>
                <Button
                  onClick={() => copyToClipboard(embedCode.script)}
                  size="sm"
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                value={embedCode.script}
                readOnly
                className="bg-gray-50 border-gray-200 text-gray-700 text-sm font-mono"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const Analytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Track performance and optimize your lead generation.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600 font-medium">Total Views</div>
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{config.analytics.views.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600 font-medium">Conversions</div>
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{config.analytics.conversions.toLocaleString()}</div>
            <div className="text-sm text-gray-500">New leads captured</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600 font-medium">Conversion Rate</div>
              <MousePointer className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{config.analytics.rate}%</div>
            <div className="text-sm text-gray-500">Views to leads</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">24-Hour Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-end space-x-1">
            {config.analytics.last24h.map((hour: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                <div 
                  className="w-full bg-blue-600 rounded-t"
                  style={{ height: `${(hour.views / 20) * 100}%`, minHeight: '2px' }}
                />
                <div 
                  className="w-full bg-green-600"
                  style={{ height: `${(hour.conv / 5) * 100}%`, minHeight: '1px' }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>24h ago</span>
            <span>Now</span>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-700">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-gray-700">Conversions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveSection = () => {
    switch (active) {
      case "templates": return <Templates />;
      case "design": return <Design />;
      case "content": return <Content />;
      case "form": return <FormBuilder />;
      case "delivery": return <Delivery />;
      case "integrations": return <Integrations />;
      case "abtest": return <ABTest />;
      case "launch": return <Launch />;
      case "analytics": return <Analytics />;
      default: return <Templates />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Lead Magnet Builder | Free AI Tools | Advanta AI</title>
        <meta name="description" content="Create high-converting lead magnets with our advanced builder. Professional templates, A/B testing, CRM integrations, and detailed analytics." />
      </Helmet>
      
      <NewHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24">
        <div className="flex h-screen">
          <Sidebar />
          
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderActiveSection()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </>
  );
}