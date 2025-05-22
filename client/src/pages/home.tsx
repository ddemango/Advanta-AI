import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ServicesPreview from '@/components/home/ServicesPreview';
import WhyAdvantaAI from '@/components/home/WhyAdvantaAI';
import Services from '@/components/home/Services';
import CaseStudies from '@/components/home/CaseStudies';
import AiAssessment from '@/components/home/AiAssessment';
import Testimonials from '@/components/home/Testimonials';
import AiDemo from '@/components/home/AiDemo';
import Contact from '@/components/home/Contact';
import AiProductSandbox from '@/components/sandbox/AiProductSandbox';
import RoiCalculatorPreview from '@/components/home/RoiCalculatorPreview';
import EmailCapture from '@/components/home/EmailCapture';
import AiUseCases from '@/components/home/AiUseCases';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@/lib/animations';
import { CookieConsent } from '@/components/ui/cookie-consent';
import { Helmet } from 'react-helmet';

export default function Home() {
  // State for quick navigation and tab management
  const [activeSection, setActiveSection] = useState('hero');
  const [servicesTab, setServicesTab] = useState('ai-agents');
  const [resultsTab, setResultsTab] = useState('case-studies');
  const [toolsTab, setToolsTab] = useState('demo');
  
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

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'why-advanta', 'roi-calculator', 'services', 'case-studies', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to navigate to sections smoothly
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

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
      
      {/* Quick Navigation Bar */}
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className={`fixed z-50 left-1/2 transform -translate-x-1/2 ${
          activeSection !== 'hero'
            ? 'top-4 bg-background/80 backdrop-blur-md shadow-lg border border-primary/20 rounded-full px-4 py-2' 
            : 'top-[calc(100vh-120px)] bg-transparent'
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex space-x-1 md:space-x-2">
          {[
            { id: 'hero', label: 'Home' },
            { id: 'why-advanta', label: 'Benefits' },
            { id: 'services', label: 'Solutions' },
            { id: 'roi-calculator', label: 'ROI' },
            { id: 'case-studies', label: 'Results' },
            { id: 'contact', label: 'Contact' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative px-3 py-2 text-sm md:text-base rounded-full transition-all duration-300 ${
                activeSection === item.id 
                  ? 'text-white font-medium' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
      
      <main>
        {/* Main Hero Section */}
        <section id="hero">
          <Hero />
        </section>
        
        {/* Value Proposition Section - Consolidated */}
        <section id="why-advanta">
          <WhyAdvantaAI />
        </section>
        
        {/* ROI Calculator Preview */}
        <section id="roi-calculator" className="py-10 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <RoiCalculatorPreview />
          </div>
        </section>
        
        {/* Consolidated Solutions Section with Tabs */}
        <section id="services" className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center max-w-3xl mx-auto mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Solutions for Your Business</h2>
              <p className="text-lg text-muted-foreground">Powerful, customizable AI solutions with proven ROI across industries</p>
            </motion.div>

            <Tabs value={servicesTab} onValueChange={setServicesTab}>
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
                <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
                <TabsTrigger value="data-insights">Data Insights</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="integration">Integration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai-agents">
                <Services />
              </TabsContent>
              <TabsContent value="data-insights">
                <AiUseCases />
              </TabsContent>
              <TabsContent value="automation">
                <HowItWorks />
              </TabsContent>
              <TabsContent value="integration">
                <ServicesPreview />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Consolidated Results Section */}
        <section id="case-studies" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center max-w-3xl mx-auto mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Success Stories</h2>
              <p className="text-lg text-muted-foreground">Measurable results and transformative outcomes</p>
            </motion.div>

            <Tabs value={resultsTab} onValueChange={setResultsTab}>
              <TabsList className="grid grid-cols-3 gap-2 mb-8">
                <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="case-studies">
                <CaseStudies />
              </TabsContent>
              <TabsContent value="testimonials">
                <Testimonials />
              </TabsContent>
              <TabsContent value="metrics">
                <AiUseCases />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Email Capture Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8" id="stay-informed">
            <EmailCapture />
          </div>
        </section>
        
        {/* Consolidated Interactive Tools Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center max-w-3xl mx-auto mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Try Our AI Tools</h2>
              <p className="text-lg text-muted-foreground">Experience our AI solutions firsthand</p>
            </motion.div>

            <Tabs value={toolsTab} onValueChange={setToolsTab}>
              <TabsList className="grid grid-cols-3 gap-2 mb-8">
                <TabsTrigger value="demo">Live Demo</TabsTrigger>
                <TabsTrigger value="sandbox">AI Sandbox</TabsTrigger>
                <TabsTrigger value="assessment">AI Readiness</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demo">
                <div className="max-w-4xl mx-auto">
                  <AiDemo />
                </div>
              </TabsContent>
              <TabsContent value="sandbox">
                <div className="max-w-4xl mx-auto">
                  <AiProductSandbox />
                </div>
              </TabsContent>
              <TabsContent value="assessment">
                <div className="max-w-4xl mx-auto">
                  <AiAssessment />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="bg-background">
          <Contact />
        </section>
      </main>
      
      <Footer />
      <CookieConsent />
    </>
  );
}
