import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Advanta AI - Transform Your Business with AI-Powered Solutions",
  description: "Deploy AI assistants, automate processes, and scale your business in days, not months. Trusted by 500+ companies. Access 30+ free AI tools.",
  keywords: "AI automation, business AI, chatbots, process automation, AI assistants, business transformation",
  openGraph: {
    title: "Advanta AI - Transform Your Business with AI-Powered Solutions",
    description: "Deploy AI assistants, automate processes, and scale your business in days, not months.",
    url: "https://advanta-ai.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
