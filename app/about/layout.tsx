import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Advanta AI — Our Mission & Team",
  description: "Advanta AI helps 500+ businesses automate with AI. Learn about our mission to make AI automation accessible to every business, big or small.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
