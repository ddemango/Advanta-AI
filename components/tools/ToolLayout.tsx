"use client";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Copy, Download, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backHref?: string;
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, icon, backHref = "/free-tools", children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={backHref} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Free Tools
          </Link>
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-500 mt-1">{description}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="inline-flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
      {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> {label}</>}
    </button>
  );
}

export function ResultCard({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      {title && <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2"><span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block" />{title}</h3>}
      {children}
    </div>
  );
}

export function TagList({ items, color = "blue" }: { items: string[]; color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };
  return (
    <div className="flex flex-wrap gap-2">
      {items?.map((item, i) => (
        <span key={i} className={`text-xs px-3 py-1.5 rounded-full font-medium ${colors[color] || colors.blue}`}>{item}</span>
      ))}
    </div>
  );
}

export function BulletList({ items, icon = "•" }: { items: string[]; icon?: string }) {
  return (
    <ul className="space-y-2">
      {items?.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
          <span className="text-blue-500 mt-0.5 flex-shrink-0">{icon}</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ScoreRing({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${score} 100`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black text-gray-900">{score}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-1 text-center">{label}</span>
    </div>
  );
}
