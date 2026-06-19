import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Advanta AI",
  description: "How Advanta AI collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      body: `We collect information you provide directly to us, such as when you use our free AI tools, submit a contact form, or purchase a workflow. This includes name, email address, company name, and any content you enter into our tools. We also collect standard usage data such as IP address, browser type, and pages visited to improve our service.`,
    },
    {
      title: "How We Use Your Information",
      body: `We use the information we collect to provide and improve our services, respond to your inquiries, send product updates (with your consent), process purchases, and analyze usage patterns. We do not sell your personal information to third parties.`,
    },
    {
      title: "AI Tool Usage",
      body: `Content you enter into our free AI tools is sent to OpenAI's API to generate responses. We do not store the content of your tool inputs beyond the duration of your session. Please do not enter sensitive personal, financial, or confidential business information into our tools.`,
    },
    {
      title: "Cookies",
      body: `We use essential cookies to ensure our website functions correctly. We do not use tracking cookies for advertising. You can disable cookies in your browser settings, though some features may not function correctly.`,
    },
    {
      title: "Data Security",
      body: `We implement industry-standard security measures including TLS/SSL encryption for data in transit. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and contact us immediately if you suspect unauthorized access.`,
    },
    {
      title: "Third-Party Services",
      body: `We use the following third-party services: OpenAI (AI generation), Vercel (hosting), and standard analytics tools. Each third party has its own privacy policy governing the use of your data when it passes through their systems.`,
    },
    {
      title: "Your Rights",
      body: `You have the right to access, correct, or delete personal information we hold about you. To exercise these rights, email us at hello@advanta-ai.com. We will respond to all requests within 30 days.`,
    },
    {
      title: "Contact Us",
      body: `If you have questions about this Privacy Policy, please contact us at hello@advanta-ai.com or write to Advanta AI, [Your Business Address].`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
            <p className="text-gray-500">Last updated: June 2026</p>
          </div>
          <p className="text-gray-600 leading-relaxed mb-10">
            At Advanta AI, we take your privacy seriously. This policy explains how we collect, use, and protect your information when you use our website and services.
          </p>
          <div className="space-y-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
                <p className="text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
