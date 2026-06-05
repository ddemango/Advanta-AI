import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import TrustSection from "@/components/home/TrustSection";
import CTA from "@/components/home/CTA";

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
      <Footer />
    </div>
  );
}
