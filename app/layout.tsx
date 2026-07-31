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
  title: {
    default: "Advanta AI | AI Automation & Business AI Solutions | Davide Demango",
    template: "%s | Advanta AI",
  },
  description: "Advanta AI, founded by Davide Demango, helps businesses deploy AI assistants, automate processes, and scale with 30+ free AI tools. Trusted by 500+ companies worldwide.",
  keywords: [
    "Advanta AI", "Davide Demango", "AI automation", "business AI solutions",
    "AI consulting", "AI tools", "chatbots", "process automation",
    "AI assistants", "machine learning consulting", "free AI tools",
    "AI stack builder", "marketing AI", "sales automation",
  ],
  authors: [{ name: "Davide Demango", url: "https://advanta-ai.com" }],
  creator: "Davide Demango",
  publisher: "Advanta AI",
  metadataBase: new URL("https://advanta-ai.com"),
  alternates: { canonical: "https://advanta-ai.com" },
  openGraph: {
    title: "Advanta AI | AI Automation & Business Solutions | Davide Demango",
    description: "Advanta AI, founded by Davide Demango, helps businesses deploy AI assistants and automate processes with 30+ free AI tools.",
    url: "https://advanta-ai.com",
    siteName: "Advanta AI",
    type: "website",
    locale: "en_US",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Advanta AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanta AI | AI Automation by Davide Demango",
    description: "Deploy AI assistants, automate processes, and scale your business with Advanta AI.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  verification: {
    google: "",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://advanta-ai.com/#organization",
                  name: "Advanta AI",
                  url: "https://advanta-ai.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://advanta-ai.com/logo.png",
                  },
                  founder: {
                    "@type": "Person",
                    "@id": "https://advanta-ai.com/#davide-demango",
                    name: "Davide Demango",
                    jobTitle: "Founder & CEO",
                    worksFor: { "@id": "https://advanta-ai.com/#organization" },
                    url: "https://advanta-ai.com/about",
                  },
                  description: "Advanta AI helps businesses deploy AI assistants, automate processes, and scale using cutting-edge AI tools.",
                  sameAs: [
                    "https://www.linkedin.com/company/advanta-ai",
                    "https://twitter.com/advanta_ai",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer support",
                    url: "https://advanta-ai.com/contact",
                  },
                },
                {
                  "@type": "Person",
                  "@id": "https://advanta-ai.com/#davide-demango",
                  name: "Davide Demango",
                  jobTitle: "Founder & CEO of Advanta AI",
                  url: "https://advanta-ai.com/about",
                  worksFor: {
                    "@type": "Organization",
                    name: "Advanta AI",
                    url: "https://advanta-ai.com",
                  },
                  knowsAbout: [
                    "Artificial Intelligence", "Business Automation",
                    "AI Consulting", "Machine Learning", "Process Automation",
                  ],
                  sameAs: [
                    "https://www.linkedin.com/in/davide-demango",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://advanta-ai.com/#website",
                  url: "https://advanta-ai.com",
                  name: "Advanta AI",
                  publisher: { "@id": "https://advanta-ai.com/#organization" },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://advanta-ai.com/free-tools?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
