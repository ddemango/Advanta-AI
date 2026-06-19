import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI ROI Calculator — See Your Return Before You Invest | Advanta AI",
  description: "Calculate the ROI of AI automation for your business. Enter your team size, hourly rate, and current manual tasks to see projected savings and payback period.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
