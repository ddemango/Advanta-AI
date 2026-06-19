import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI Blog — Guides, Tips & Insights | Advanta AI",
  description: "Practical guides on AI automation, business productivity, and how to get the most out of AI tools. Published by the Advanta AI team.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
