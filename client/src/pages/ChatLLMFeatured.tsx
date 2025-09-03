import React, {useMemo, useRef, useState} from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Send,
  Paperclip,
  Mic,
  Image as ImageIcon,
  Code2,
  FlaskConical,
  Presentation,
  Search,
  MoreHorizontal,
  Plus,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Settings,
  CheckCircle2,
  Loader2,
  Sun,
  Moon,
  FileText,
  PlayCircle
} from "lucide-react";

// ============================
// ChatLLM Featured Replica Page (Single File)
// Framework: React 18 + TailwindCSS + Framer Motion + Lucide Icons
// Notes:
// - Clean-room UI replica of the referenced page; no third‑party code or assets copied.
// - Drop this file into a Next.js/React project and route it to /ai-portal or any path.
// - Uses Tailwind utility classes for layout and style; shadcn/ui optional.
// - Responsive (desktop-first); collapses side panels on smaller widths.
// ============================

export default function ChatLLMFeaturedReplica() {
  const [dark, setDark] = useState(true);
  const [messages, setMessages] = useState<Msg[]>(seedMessages);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<ModelOption>(modelOptions[0]);
  const [rightTab, setRightTab] = useState<RightTab>("tools");

  return (
    <div className={tw(
      "min-h-screen w-full font-sans selection:bg-indigo-300/30",
      dark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
    )}>
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/40">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:260,damping:20}} className="grid h-9 w-9 place-content-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </motion.div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <strong className="text-sm tracking-wide text-zinc-200">Advanta AI — DeepAgent</strong>
                <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">Production</span>
              </div>
              <div className="text-xs text-zinc-400">Enterprise AI development platform with multi-step agents</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DarkToggle dark={dark} setDark={setDark} />
            <ModelSelector value={model} onChange={setModel} />
            <button className="inline-flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] grid-cols-[280px_1fr_360px] gap-4 px-4 py-4 xl:grid-cols-[300px_1fr_380px] lg:grid-cols-[260px_1fr] lg:[&>*:last-child]:hidden">
        {/* Left Sidebar */}
        <aside className="rounded-2xl border border-zinc-800/60 bg-zinc-950/50 p-3">
          <Sidebar />
        </aside>

        {/* Center: Quick Actions + Chat */}
        <section className="flex min-h-[70vh] flex-col gap-4">
          <QuickActions onAction={(msg)=>setMessages(m=>[...m,{id:cryptoId(),role:"assistant",content:msg,preset:true}])} />

          <div className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-zinc-800/60">
            <ConversationHeader />
            <ChatWindow messages={messages} />
            <Composer
              value={input}
              onChange={setInput}
              onSend={() => {
                if (!input.trim()) return;
                setMessages(m => [...m, { id: cryptoId(), role: "user", content: input }]);
                setInput("");
                // Simulated assistant stub
                setTimeout(() => {
                  setMessages(m => [...m, { id: cryptoId(), role: "assistant", content: "(Demo) Got it. I would now call tools or search the web and return results with citations and artifacts." }]);
                }, 500);
              }}
            />
          </div>
        </section>

        {/* Right Panel */}
        <aside className="rounded-2xl border border-zinc-800/60 bg-zinc-950/50 p-3">
          <RightPanel tab={rightTab} setTab={setRightTab} />
        </aside>
      </main>
    </div>
  );
}

// ============================
// Components
// ============================

type RightTab = "tools" | "history" | "apps";

function Sidebar(){
  return (
    <div className="flex h-full flex-col gap-3">
      <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-95">
        <Plus className="h-4 w-4"/> New Agent
      </button>

      <NavGroup label="Projects & Agents" defaultOpen>
        <NavItem active>Research Assistant</NavItem>
        <NavItem>Code Review Agent</NavItem>
        <NavItem>Data Analyst</NavItem>
        <NavItem>Content Creator</NavItem>
        <NavItem>Business Intelligence</NavItem>
      </NavGroup>

      <NavGroup label="Featured Tools">
        <NavItem>DeepAgent Studio</NavItem>
        <NavItem>CodeLLM</NavItem>
        <NavItem>AppLLM</NavItem>
        <NavItem>Document Q&A</NavItem>
        <NavItem>Web Search</NavItem>
      </NavGroup>

      <div className="mt-auto rounded-xl border border-zinc-800/60 p-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-200"><Sparkles className="h-4 w-4 text-indigo-300"/> Agent Tips</div>
        <ul className="space-y-2 text-xs text-zinc-400">
          <li>Use multi-step workflows for complex tasks.</li>
          <li>Agents can call tools and search web.</li>
          <li>Export results as reports or artifacts.</li>
        </ul>
      </div>
    </div>
  );
}

function NavGroup({label, children, defaultOpen=false}:{label:string; children:React.ReactNode; defaultOpen?:boolean}){
  const [open,setOpen]=useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800/60">
      <button onClick={()=>setOpen(o=>!o)} className="flex w-full items-center justify-between bg-zinc-900/60 px-3 py-2 text-left text-sm font-semibold text-zinc-200">
        <span>{label}</span>
        {open ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}
      </button>
      {open && (
        <div className="divide-y divide-zinc-800/60">
          {children}
        </div>
      )}
    </div>
  )
}

function NavItem({children,active=false}:{children:React.ReactNode;active?:boolean}){
  return (
    <button className={tw(
      "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-zinc-900/50",
      active ? "bg-zinc-900/60 text-zinc-100" : "text-zinc-300"
    )}>
      <span className="truncate">{children}</span>
      {active && <CheckCircle2 className="h-4 w-4 text-emerald-400"/>}
    </button>
  )
}

function QuickActions({onAction}:{onAction:(msg:string)=>void}){
  const actions = [
    { icon: ImageIcon, label: "Image", hint:"Generate or edit images", preset:"Generate a professional headshot of a software engineer for LinkedIn." },
    { icon: Code2, label: "Code", hint:"Write & run code", preset:"Create a Python script that analyzes CSV data and generates charts." },
    { icon: FlaskConical, label: "Playground", hint:"Experiment with prompts", preset:"Test different AI models on the same prompt to compare responses." },
    { icon: Presentation, label: "PowerPoint", hint:"Create presentations", preset:"Create a 10-slide investor pitch deck for an AI startup with market analysis." },
    { icon: Search, label: "Deep Research", hint:"Multi-step web research", preset:"Research the top 10 AI companies by revenue in 2024 with detailed competitive analysis." },
    { icon: MoreHorizontal, label: "More", hint:"Advanced tools", preset:"Show me all available DeepAgent tools and their capabilities." },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {actions.map((a) => (
        <motion.button
          whileTap={{scale:0.98}}
          key={a.label}
          onClick={()=>onAction(a.preset)}
          className="group flex flex-col items-start gap-2 rounded-2xl border border-zinc-800/60 bg-zinc-950/50 p-4 hover:border-indigo-600/50 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.35)]"
        >
          <a.icon className="h-5 w-5 text-zinc-300 group-hover:text-indigo-300"/>
          <div>
            <div className="text-sm font-semibold text-zinc-100">{a.label}</div>
            <div className="text-xs text-zinc-400">{a.hint}</div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function ConversationHeader(){
  return (
    <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 bg-zinc-950/70 px-4 py-2.5">
      <div className="flex items-center gap-2 text-sm text-zinc-300"><Sparkles className="h-4 w-4 text-indigo-300"/> New Agent Session</div>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800/60 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900/60">
          <FileText className="h-4 w-4"/> Export Results
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800/60 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900/60">
          <PlayCircle className="h-4 w-4"/> Execute Agent
        </button>
      </div>
    </div>
  )
}

function ChatWindow({messages}:{messages:Msg[]}){
  const bottomRef = useRef<HTMLDivElement|null>(null);

  React.useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages.length]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-transparent to-zinc-900/20 p-4">
      {messages.map(m=> (
        <motion.div key={m.id} initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className={tw("flex gap-3", m.role==="assistant"?"":"justify-end")}> 
          {m.role==="assistant" && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800"><Bot className="h-4 w-4 text-zinc-200"/></div>}
          <div className={tw("max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow", m.role==="assistant"?"bg-zinc-900/80 text-zinc-100 border border-zinc-800/60":"bg-indigo-600 text-white")}>{m.content}</div>
          {m.role==="user" && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">U</div>}
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

function Composer({value,onChange,onSend}:{value:string;onChange:(v:string)=>void;onSend:()=>void}){
  return (
    <div className="border-t border-zinc-800/60 bg-zinc-950/70 p-3">
      <div className="flex items-end gap-2 rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-2">
        <button className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800/60"><Paperclip className="h-5 w-5"/></button>
        <textarea
          rows={2}
          placeholder="Describe your task for the AI agent..."
          className="min-h-[44px] flex-1 resize-none bg-transparent p-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          value={value}
          onChange={(e)=>onChange(e.target.value)}
        />
        <button className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-800/60"><Mic className="h-5 w-5"/></button>
        <button onClick={onSend} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          <Send className="h-4 w-4"/> Send
        </button>
      </div>
      <div className="mt-2 text-[11px] text-zinc-500">Tip: Describe complex multi-step tasks. The agent will break them down and execute with tools.</div>
    </div>
  )
}

function RightPanel({tab,setTab}:{tab:RightTab;setTab:(t:RightTab)=>void}){
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 grid grid-cols-3 gap-1 rounded-xl border border-zinc-800/60 bg-zinc-900/60 p-1 text-xs">
        {(["tools","apps","history"] as RightTab[]).map(t => (
          <button key={t} onClick={()=>setTab(t)} className={tw("rounded-lg px-2 py-1.5 capitalize",
            tab===t?"bg-zinc-800 text-zinc-100":"text-zinc-400 hover:text-zinc-200")}>{t}</button>
        ))}
      </div>

      {tab==="tools" && <ToolShelf/>}
      {tab==="apps" && <AppsShelf/>}
      {tab==="history" && <HistoryShelf/>}
    </div>
  )
}

function ToolShelf(){
  const tools = [
    {name:"DeepAgent", desc:"Multi‑step autonomous agent with planning, memory, refinement.", badge:"Active", color:"from-fuchsia-500 to-indigo-500"},
    {name:"CodeLLM", desc:"AI‑powered code editor with inline run & debug.", badge:"Dev", color:"from-emerald-500 to-teal-500"},
    {name:"AppLLM", desc:"Build & deploy mini‑apps directly in the platform.", badge:"Beta", color:"from-cyan-500 to-blue-500"},
    {name:"Web Search", desc:"Search and cite sources across the live web.", badge:"Search", color:"from-amber-500 to-orange-500"},
    {name:"Data Analysis", desc:"Upload CSVs, analyze data, generate charts.", badge:"Analytics", color:"from-pink-500 to-rose-500"},
    {name:"Image Studio", desc:"Generate, edit, and enhance images with AI.", badge:"Vision", color:"from-violet-500 to-purple-500"},
  ] as const;

  return (
    <div className="grid gap-2">
      {tools.map(t => (
        <div key={t.name} className="flex items-center gap-3 rounded-xl border border-zinc-800/60 p-3">
          <div className={tw("grid h-9 w-9 place-content-center rounded-lg bg-gradient-to-br text-white shadow", t.color)}>
            <Sparkles className="h-4 w-4"/>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="truncate text-sm font-semibold text-zinc-100">{t.name}</div>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 ring-1 ring-inset ring-zinc-700">{t.badge}</span>
            </div>
            <div className="truncate text-xs text-zinc-400">{t.desc}</div>
          </div>
          <button className="rounded-lg border border-zinc-800/60 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-900/60">Launch</button>
        </div>
      ))}
    </div>
  );
}

function AppsShelf(){
  const apps = [
    {title:"Research Assistant", subtitle:"Multi-step web research with citations"},
    {title:"Code Analyst", subtitle:"Review, debug, and optimize code"},
    {title:"Business Intel", subtitle:"Market research and competitive analysis"},
    {title:"Content Generator", subtitle:"Write articles, blogs, and marketing copy"},
  ];
  return (
    <div className="grid gap-2">
      {apps.map((a,i)=> (
        <div key={i} className="rounded-xl border border-zinc-800/60 p-3">
          <div className="text-sm font-semibold text-zinc-100">{a.title}</div>
          <div className="text-xs text-zinc-400">{a.subtitle}</div>
        </div>
      ))}
    </div>
  )
}

function HistoryShelf(){
  const items = [
    {t:"Market research for AI automation tools", ts:"Today 3:15 PM"},
    {t:"Code review for React TypeScript project", ts:"Today 1:22 PM"},
    {t:"Competitive analysis: Top 5 CRM platforms", ts:"Yesterday"},
    {t:"Generate investor pitch deck outline", ts:"Monday"},
  ];
  return (
    <div className="grid gap-2">
      {items.map((it,i)=> (
        <div key={i} className="rounded-xl border border-zinc-800/60 p-3">
          <div className="text-sm text-zinc-100">{it.t}</div>
          <div className="text-xs text-zinc-500">{it.ts}</div>
        </div>
      ))}
    </div>
  );
}

function ModelSelector({value,onChange}:{value:ModelOption;onChange:(v:ModelOption)=>void}){
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="inline-flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800">
        {value.label}
        <ChevronDown className="h-4 w-4"/>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950 shadow-xl">
          {modelOptions.map(m => (
            <button key={m.id} onClick={()=>{onChange(m);setOpen(false)}} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-900">
              <span>{m.label}</span>
              {value.id===m.id && <CheckCircle2 className="h-4 w-4 text-emerald-400"/>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function DarkToggle({dark,setDark}:{dark:boolean;setDark:(b:boolean)=>void}){
  return (
    <button onClick={()=>setDark(d=>!d)} className="inline-flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800">
      {dark ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
      {dark ? "Dark" : "Light"}
    </button>
  );
}

// ============================
// Types & Utils
// ============================

type Msg = { id:string; role:"user"|"assistant"; content:string; preset?:boolean };

type ModelOption = { id:string; label:string };

const modelOptions: ModelOption[] = [
  { id:"gpt-4o", label:"GPT‑4o (OpenAI)" },
  { id:"gpt-4o-mini", label:"GPT‑4o Mini" },
  { id:"gpt-4", label:"GPT‑4" },
  { id:"claude-sonnet-3.5", label:"Claude 3.5 Sonnet" },
  { id:"gemini-2.5", label:"Gemini 2.5 (Google)" },
  { id:"grok", label:"Grok (xAI)" },
  { id:"cohere", label:"Cohere Command" },
];

const seedMessages: Msg[] = [
  { id: cryptoId(), role: "assistant", content: "Welcome to DeepAgent! I'm your autonomous AI assistant capable of multi-step reasoning, tool usage, and web research. Use the quick actions above or describe a complex task and I'll break it down into steps." },
  { id: cryptoId(), role: "user", content: "Create a comprehensive market analysis report for AI automation tools." },
  { id: cryptoId(), role: "assistant", content: "I'll conduct a multi-step market analysis: 1) Research current AI automation landscape, 2) Analyze top competitors and pricing, 3) Identify market trends and opportunities, 4) Compile findings into a professional report. Starting web research now..." },
];

function cryptoId(){
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

function tw(...classes:(string|false|undefined)[]){
  return classes.filter(Boolean).join(" ")
}