"use client";
import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import ToolLayout, { CopyButton } from "@/components/tools/ToolLayout";

const prompts = [
  { category: "Marketing", title: "Write a viral LinkedIn post", prompt: "Write a viral LinkedIn post about [TOPIC]. Use a strong hook in the first line, include 3 key insights, use line breaks for readability, and end with a question to drive engagement. Tone: professional but conversational." },
  { category: "Marketing", title: "Create a product launch email", prompt: "Write a product launch email for [PRODUCT NAME]. Subject line should create curiosity. Body: problem → solution → features → social proof → CTA. Keep it under 200 words. Audience: [TARGET AUDIENCE]." },
  { category: "Sales", title: "Cold outreach message", prompt: "Write a cold outreach message for [PLATFORM] targeting [ROLE] at [COMPANY TYPE]. Reference their pain point around [PAIN POINT], introduce my solution [YOUR OFFER] in one sentence, and end with a low-commitment CTA. Max 5 sentences." },
  { category: "Sales", title: "Sales objection handler", prompt: "The prospect said: '[OBJECTION]'. Write 3 different responses that acknowledge their concern, reframe the objection, and guide them toward a yes. Make each response under 50 words. Be empathetic, not pushy." },
  { category: "Content", title: "YouTube video script outline", prompt: "Create a YouTube video script outline for '[VIDEO TITLE]'. Include: hook (0-30s), intro (30s-1m), 3 main points with sub-points, transitions, and outro with CTA. Target length: [DURATION]. Audience: [AUDIENCE]." },
  { category: "Content", title: "Blog post SEO outline", prompt: "Create an SEO-optimized blog post outline for the keyword '[KEYWORD]'. Include: title tag, meta description, H1, 5-7 H2s with H3 sub-points, FAQ section, and internal linking suggestions. Intent: [INFORMATIONAL/COMMERCIAL]." },
  { category: "Business", title: "Executive summary", prompt: "Write a one-page executive summary for [BUSINESS/PROJECT NAME]. Include: problem statement, solution, market opportunity, business model, traction, team, and funding ask. Keep each section to 2-3 sentences. Tone: professional and compelling." },
  { category: "Business", title: "Job posting that attracts A-players", prompt: "Write a job posting for [JOB TITLE] at [COMPANY NAME]. Focus on impact and growth, not just requirements. Include: what they'll build, what success looks like in 90 days, who they'll work with, and why top performers choose us." },
  { category: "AI Tools", title: "Custom ChatGPT persona", prompt: "You are [NAME], a [ROLE] for [COMPANY]. You help [TARGET USER] with [MAIN TASK]. Your tone is [TONE]. You always [POSITIVE BEHAVIOR]. You never [NEGATIVE BEHAVIOR]. When you don't know something, you [FALLBACK BEHAVIOR]." },
  { category: "AI Tools", title: "Data analysis prompt", prompt: "Analyze the following data: [PASTE DATA]. Identify: 1) key trends, 2) outliers or anomalies, 3) top 3 actionable insights, 4) what to monitor going forward. Present findings in bullet points with a summary at the top." },
  { category: "Productivity", title: "Meeting agenda creator", prompt: "Create a [DURATION] meeting agenda for: [MEETING GOAL]. Attendees: [ROLES]. Include time blocks, owner for each item, and a decision/action item column. Start with a 2-minute check-in and end with clear next steps." },
  { category: "Productivity", title: "Performance review writer", prompt: "Write a self-performance review for [ROLE]. Highlights: [YOUR ACHIEVEMENTS]. Areas to develop: [GROWTH AREAS]. Goals for next period: [GOALS]. Tone: confident and growth-oriented. Keep it under 400 words." },
  { category: "SEO", title: "Meta description generator", prompt: "Write 5 meta description variations for a page about [TOPIC/PAGE]. Each must be 150-160 characters, include the primary keyword '[KEYWORD]', have a clear value proposition, and include a subtle CTA. Target audience: [AUDIENCE]." },
  { category: "SEO", title: "FAQ schema content", prompt: "Generate 8 FAQ questions and answers for '[TOPIC]' optimized for Google's People Also Ask. Questions should cover: basic definitions, how-to, comparisons, costs, and common mistakes. Each answer: 40-60 words." },
  { category: "Customer Success", title: "Churn prevention email", prompt: "Write a re-engagement email to a customer who hasn't used [PRODUCT] in [TIME PERIOD]. Acknowledge the gap without being accusatory, highlight 2 new features they might have missed, offer a [INCENTIVE], and include a 1-click reactivation CTA." },
  { category: "Customer Success", title: "Testimonial request message", prompt: "Write a testimonial request message to send to [CUSTOMER TYPE] after they've achieved [RESULT] using our [PRODUCT/SERVICE]. Make it personal, reference their specific win, offer 3 format options (written/video/call), and keep it under 100 words." },
];

const categories = ["All", ...Array.from(new Set(prompts.map(p => p.category)))];

export default function PromptLibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = prompts.filter(p => {
    const q = search.toLowerCase();
    return (category === "All" || p.category === category) && (!q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  });

  return (
    <ToolLayout title="Time-Saving Prompt Library" description="16 battle-tested prompts for marketing, sales, content, SEO, and productivity." icon={<BookOpen className="w-6 h-6 text-blue-600" />}>
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category === c ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{c}</button>)}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((p, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div><span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{p.category}</span><h3 className="font-semibold text-gray-900 mt-2 text-sm">{p.title}</h3></div>
              <CopyButton text={p.prompt} label="Copy" />
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-600 leading-relaxed font-mono">{p.prompt}</p>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-16"><BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400">No prompts found</p></div>}
    </ToolLayout>
  );
}
