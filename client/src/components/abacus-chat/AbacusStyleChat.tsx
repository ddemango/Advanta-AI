import React from "react";
import { ChevronDown, Paperclip, Globe, Mic, Send, Image as ImageIcon, Code2, FlaskConical, FileBarChart2, Search, MoreHorizontal, Users2, UserRound, FolderPlus, Plus, Search as SearchIcon, ChevronRight, MessageSquare, ListStart } from "lucide-react";

/**
 * AbacusStyleChat
 * A pixel-accurate, responsive clone of the provided Abacus.AI chat layouts (web + mobile).
 * - TailwindCSS utility classes only (no external CSS required)
 * - Works as a single drop-in React component
 * - Keyboard accessible, with semantic markup and ARIA labels
 *
 * To use:
 * 1) Ensure TailwindCSS is configured in your project.
 * 2) Import and render <AbacusStyleChat /> anywhere.
 */
export default function AbacusStyleChat() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3 py-3 md:px-5">
          {/* Left cluster: hamburger (mobile) + logo */}
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 md:hidden"
              aria-label="Open sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-[28px] rounded-sm bg-gradient-to-b from-[#6a6cf6] to-[#8b7bff]" />
              <span className="text-lg font-semibold tracking-tight">ADVANTA.AI</span>
            </div>
          </div>

          {/* Center: Model selector */}
          <button
            className="group hidden min-w-[160px] items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium md:flex"
            aria-haspopup="listbox"
            aria-label="Model selector"
          >
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#5b46f3]/10">
              <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-[#5b46f3]" />
            </span>
            <span>GPT-4o</span>
            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-hover:translate-y-[1px]" />
          </button>

          {/* Right cluster: refer/invite + avatar */}
          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium md:inline-flex">
              AI Portal / Team
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold"
              aria-label="Profile"
            >
              A
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-0 md:gap-4">
        {/* Sidebar (desktop only) */}
        <aside className="hidden w-[300px] shrink-0 border-r border-gray-200 md:block">
          <div className="px-4 py-4">
            {/* Projects header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Projects</h2>
              <div className="flex items-center gap-2">
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200" aria-label="Add Project">
                  <Plus className="h-4 w-4" />
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200" aria-label="Project Options">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search projects */}
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
              <SearchIcon className="h-4 w-4 text-gray-500" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                placeholder="Search projects"
              />
            </div>

            {/* Chats header */}
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Chats</h2>
              <div className="flex items-center gap-2">
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200" aria-label="New Chat">
                  <Plus className="h-4 w-4" />
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200" aria-label="Collapse">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chats (placeholder items) */}
            <nav className="space-y-1">
              {[
                "Virtual Computer Setup",
                "Data Analysis Workflow",
                "Text Humanization Demo",
                "Model Performance Tests",
              ].map((label, i) => (
                <button
                  key={i}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span className="line-clamp-1 pr-3">{label}</span>
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar footer icons */}
          <div className="mt-auto border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Users2 className="h-5 w-5" />
                <span className="text-sm">AI Portal</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <div className="mt-3 grid grid-cols-6 gap-2 text-gray-600">
              <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Apps">
                <FolderPlus className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Tasks">
                <ListStart className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="CodeLLM">
                <Code2 className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Icon1">
                <UserRound className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Icon2">
                <Search className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center rounded-lg border border-gray-200 p-2" aria-label="Icon3">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main chat area */}
        <main className="flex min-h-[calc(100vh-56px)] flex-1 flex-col px-3 md:px-6">
          {/* Suggestion chips row (web) */}
          <div className="mx-auto mt-8 hidden w-full max-w-5xl flex-wrap items-center justify-center gap-3 md:flex">
            <Chip>Virtual Computer Commands</Chip>
            <Chip iconLeft={<FileBarChart2 className="h-4 w-4" />}>Data Analysis</Chip>
            <Chip iconLeft={<Code2 className="h-4 w-4" />}>Python Code Execution</Chip>
            <Chip iconLeft={<ImageIcon className="h-4 w-4" />}>Text Humanization</Chip>
          </div>

          {/* Suggestion chips (mobile variant) */}
          <div className="mx-auto mt-8 flex w-full max-w-xl flex-wrap items-center justify-center gap-3 md:hidden">
            <Chip>Virtual Computer</Chip>
            <Chip iconLeft={<FileBarChart2 className="h-4 w-4" />}>Data Analysis</Chip>
            <Chip iconLeft={<Code2 className="h-4 w-4" />}>Python Execution</Chip>
          </div>

          {/* Composer */}
          <div className="mx-auto mt-6 w-full max-w-5xl rounded-2xl border border-gray-200 bg-white p-3 md:p-4">
            {/* Input row */}
            <div className="flex items-end gap-2">
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200" aria-label="Attach file">
                <Paperclip className="h-5 w-5" />
              </button>

              <div className="flex-1">
                <label className="sr-only" htmlFor="composer">Write something…</label>
                <textarea
                  id="composer"
                  className="h-16 w-full resize-none rounded-2xl bg-gray-50 px-4 py-3 text-base outline-none placeholder:text-gray-400 md:h-20"
                  placeholder="Ask about AI development, code execution, or data analysis..."
                />

                {/* Controls under textarea */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm" aria-label="Language">
                      <Globe className="h-4 w-4" />
                    </button>
                    <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm" aria-haspopup="menu" aria-label="Chat mode">
                      <span>Chat</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200" aria-label="Voice input">
                      <Mic className="h-5 w-5" />
                    </button>
                    <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b46f3] text-white shadow-sm" aria-label="Send">
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tools row */}
          <div className="mx-auto mt-4 flex w-full max-w-5xl flex-wrap items-center justify-center gap-3">
            <ToolButton icon={<ImageIcon className="h-4 w-4" />}>Image</ToolButton>
            <ToolButton icon={<Code2 className="h-4 w-4" />}>Code</ToolButton>
            <ToolButton icon={<FlaskConical className="h-4 w-4" />}>Virtual Computer</ToolButton>
            <ToolButton icon={<FileBarChart2 className="h-4 w-4" />}>Data Analysis</ToolButton>
            <ToolButton icon={<Search className="h-4 w-4" />}>Web Search</ToolButton>
            <ToolButton icon={<MoreHorizontal className="h-4 w-4" />}>More</ToolButton>
          </div>

          {/* Footer link */}
          <div className="mx-auto my-8 w-full max-w-5xl text-center">
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-[#5b46f3] hover:underline">
              <span>AI Portal Documentation & Tips</span>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}

/** CHIP & TOOL BUTTON PRIMITIVES **/
function Chip({ children, iconLeft }: { children: React.ReactNode; iconLeft?: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50">
      {iconLeft ? <span className="text-gray-700">{iconLeft}</span> : null}
      <span>{children}</span>
    </button>
  );
}

function ToolButton({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50">
      {icon ? <span className="text-gray-700">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}