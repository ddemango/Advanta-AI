import { MetadataRoute } from "next";

const BASE = "https://advanta-ai.com";

const routes = [
  { url: "/", priority: 1.0, changeFrequency: "weekly" },
  { url: "/free-tools", priority: 0.9, changeFrequency: "weekly" },
  { url: "/services", priority: 0.9, changeFrequency: "monthly" },
  { url: "/marketplace", priority: 0.9, changeFrequency: "weekly" },
  { url: "/about", priority: 0.8, changeFrequency: "monthly" },
  { url: "/ai-stack-builder", priority: 0.8, changeFrequency: "monthly" },
  { url: "/roi-calculator", priority: 0.8, changeFrequency: "monthly" },
  { url: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { url: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { url: "/case-studies", priority: 0.7, changeFrequency: "monthly" },
  { url: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { url: "/terms", priority: 0.3, changeFrequency: "yearly" },
  // Free tools
  { url: "/tools/marketing-report", priority: 0.8, changeFrequency: "monthly" },
  { url: "/tools/swot-analysis", priority: 0.8, changeFrequency: "monthly" },
  { url: "/tools/sop-builder", priority: 0.8, changeFrequency: "monthly" },
  { url: "/tools/competitor-lite", priority: 0.8, changeFrequency: "monthly" },
  { url: "/tools/rfp-response-builder", priority: 0.8, changeFrequency: "monthly" },
  { url: "/trending-content-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/cold-email-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/resume-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/ats-resume-tailor", priority: 0.7, changeFrequency: "monthly" },
  { url: "/voiceover-script-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/custom-gpt-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/content-calendar-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/pricing-strategy-assistant", priority: 0.7, changeFrequency: "monthly" },
  { url: "/brand-kit-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/marketing-copy-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/headline-split-test-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/business-idea-validator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/linkedin-post-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/cover-letter-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/youtube-description-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/faq-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/bio-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/product-description-generator", priority: 0.7, changeFrequency: "monthly" },
  { url: "/movie-tv-matchmaker", priority: 0.6, changeFrequency: "monthly" },
  { url: "/workout-planner", priority: 0.6, changeFrequency: "monthly" },
  { url: "/best-time-to-travel", priority: 0.6, changeFrequency: "monthly" },
  { url: "/best-time-to-book", priority: 0.6, changeFrequency: "monthly" },
  { url: "/travel-deal-finder", priority: 0.6, changeFrequency: "monthly" },
  { url: "/prompt-library", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE}${url}`,
    lastModified: new Date(),
    changeFrequency: changeFrequency as MetadataRoute.Sitemap[0]["changeFrequency"],
    priority,
  }));
}
