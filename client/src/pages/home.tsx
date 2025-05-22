import { useEffect } from 'react';
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
import RoiCalculatorPreview from '@/components/home/RoiCalculatorPreview';
import EmailCapture from '@/components/home/EmailCapture';
import AiUseCases from '@/components/home/AiUseCases';
import { CookieConsent } from '@/components/ui/cookie-consent';
import { Helmet } from 'react-helmet';

export default function Home() {
  // Handle smooth scrolling
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.pathname === window.location.pathname) {
        e.preventDefault();
        const targetElement = document.querySelector(anchor.hash);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.pageYOffset - 100,
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

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
        
        {/* ROI Calculator Preview */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10" id="roi-preview">
          <RoiCalculatorPreview />
        </div>
        
        {/* Solutions Section */}
        <ServicesPreview />
        <Services />
        
        {/* AI Use Cases with Visual Representations */}
        <AiUseCases />
        
        {/* Proof of Value Section */}
        <CaseStudies />
        <Testimonials />
        
        {/* Email Capture Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" id="stay-informed">
          <EmailCapture />
        </div>
        
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
