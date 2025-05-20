import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ServicesPreview from '@/components/home/ServicesPreview';
import IndustryTemplates from '@/components/home/IndustryTemplates';
import WhyAdvantaAI from '@/components/home/WhyAdvantaAI';
import Services from '@/components/home/Services';
import CaseStudies from '@/components/home/CaseStudies';
import AiAssessment from '@/components/home/AiAssessment';
import Testimonials from '@/components/home/Testimonials';
import AiDemo from '@/components/home/AiDemo';
import OnboardingWizard from '@/components/home/OnboardingWizard';
import PricingCta from '@/components/home/PricingCta';
import Contact from '@/components/home/Contact';
import AiProductSandbox from '@/components/sandbox/AiProductSandbox';
import ClientPortal from '@/components/portal/ClientPortal';
import { CookieConsent } from '@/components/ui/cookie-consent';
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Advanta AI - Unlock AI-Powered Growth—No Code. No Delay.</title>
        <meta name="description" content="GPT agents, automations, and dashboards built to scale your brand—fast. Deploy custom AI solutions in days, not months." />
        <meta name="keywords" content="GPT agents, AI automations, chatbots, machine learning, AI consulting, predictive dashboards, white-label AI" />
        <meta property="og:title" content="Advanta AI - Unlock AI-Powered Growth—No Code. No Delay." />
        <meta property="og:description" content="GPT agents, automations, and dashboards built to scale your brand—fast. Deploy custom AI solutions in days, not months." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Main Hero Section */}
        <Hero />
        
        {/* Value Proposition Section */}
        <WhyAdvantaAI />
        <HowItWorks />
        
        {/* Solutions Section */}
        <ServicesPreview />
        <Services />
        
        {/* Proof of Value Section */}
        <CaseStudies />
        <Testimonials />
        
        {/* Interactive Tools Section */}
        <AiDemo />
        <AiProductSandbox />
        <AiAssessment />
        
        {/* Client Experience Section */}
        <ClientPortal />
        <OnboardingWizard />
        
        {/* Conversion Section */}
        <PricingCta />
        <Contact />
      </main>
      
      <Footer />
      <CookieConsent />
    </>
  );
}
