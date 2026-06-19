import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Advanta AI — Get in Touch",
  description: "Have a question or want to discuss a custom AI workflow? Reach out to the Advanta AI team. We reply within 24 hours.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
