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
import { GradientText } from '@/components/ui/gradient-text';
import { Helmet } from 'react-helmet';

export default function Home() {
  // State for quick navigation and tab management
  const [activeSection, setActiveSection] = useState('hero');
  const [servicesTab, setServicesTab] = useState('ai-agents');
  const [resultsTab, setResultsTab] = useState('case-studies');
  const [toolsTab, setToolsTab] = useState('assessment');
  
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

      let activeFound = false;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          activeFound = true;
          break;
        }
      }
      
      // Fallback if no section is found active
      if (!activeFound && sections.length > 0) {
        setActiveSection(sections[0]);
      }
    };

    // Initial call to set the active section on mount
    handleScroll();

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
      
      {/* Mobile-friendly Bottom Navigation Bar - Minimalistic Version */}
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 z-50 bg-background/70 backdrop-blur-md md:shadow-lg md:border md:border-primary/20 md:rounded-full"
      >
        <div className="flex justify-around md:justify-center md:space-x-4 p-2">
          {[
            { id: 'hero', label: 'Home', icon: '🏠' },
            { id: 'why-advanta', label: 'Benefits', icon: '✨' },
            { id: 'services', label: 'Solutions', icon: '🔧' },
            { id: 'roi-calculator', label: 'ROI', icon: '📈' },
            { id: 'case-studies', label: 'Results', icon: '🏆' },
            { id: 'contact', label: 'Contact', icon: '✉️' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative p-2 md:px-3 md:py-1.5 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none ${
                activeSection === item.id 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="relative z-10 hidden md:inline text-xs md:text-sm">{item.label}</span>
              <span className="relative z-10 md:hidden text-sm">{item.icon}</span>
              
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-primary/20 rounded-full md:bottom-0 md:top-auto md:left-1/2 md:transform md:-translate-x-1/2 md:w-full md:h-0.5 md:bg-primary md:inset-auto"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>
      
      <main>
        {/* Main Hero Section */}
        <section id="hero">
          <Hero />
        </section>
        
        {/* What We Do Section - Simple Explanation */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-900/30" id="what-we-do">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
                What <GradientText>Advanta AI</GradientText> Does
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 sm:mb-12">
                We're like having a team of AI experts build custom software for your business - without the complexity or cost.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-white mb-4">Custom AI Assistants</h3>
                <p className="text-gray-300">
                  We build AI chatbots and assistants that handle your customer support, sales conversations, and routine tasks - available 24/7.
                </p>
              </motion.div>

              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-white mb-4">Workflow Automation</h3>
                <p className="text-gray-300">
                  Stop doing repetitive tasks. We create AI systems that automatically handle data entry, email responses, scheduling, and more.
                </p>
              </motion.div>

              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-4">Smart Analytics</h3>
                <p className="text-gray-300">
                  Get insights from your data instantly. Our AI analyzes your business metrics and tells you exactly what actions to take.
                </p>
              </motion.div>
            </div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg text-gray-400 mb-6">
                <strong className="text-white">The Result:</strong> You save 10-20 hours per week and increase revenue by focusing on what matters most.
              </p>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <a href="/build-my-ai-stack">See What AI Tools You Need →</a>
              </Button>
            </motion.div>
          </div>
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
                <TabsTrigger value="assessment">AI Readiness</TabsTrigger>
                <TabsTrigger value="sandbox">AI Sandbox</TabsTrigger>
                <TabsTrigger value="demo">Live Demo</TabsTrigger>
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
