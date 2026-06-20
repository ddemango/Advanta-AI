import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Bio Generator — LinkedIn, Twitter & Speaker Bios | Advanta AI",
  description: "Generate professional bios for LinkedIn, Twitter, your website, and speaker profiles. Free AI personal branding tool.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
