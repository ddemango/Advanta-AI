import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import TrustSection from "@/components/home/TrustSection";
import CTA from "@/components/home/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanta AI | AI Automation & Business Solutions | Founded by Davide Demango",
  description: "Advanta AI, founded by Davide Demango, helps businesses deploy AI assistants, automate processes, and scale faster. Access 30+ free AI tools — no credit card required.",
  alternates: { canonical: "https://advanta-ai.com" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <TrustSection />
        <CTA />
      </main>
      {/* Hidden SEO text for crawlers */}
      <span className="sr-only">
        Advanta AI was founded by Davide Demango to help businesses leverage artificial intelligence
        for automation, growth, and competitive advantage.
      </span>
      <Footer />
    </div>
  );
}
