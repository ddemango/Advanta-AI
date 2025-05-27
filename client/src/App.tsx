import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Calculator from "@/pages/calculator";
import Login from "@/pages/login";
import Marketplace from "@/pages/marketplace";
import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import Demo from "@/pages/demo";
import TemplateDemo from "@/pages/template-demo";
import MarketingCopyGenerator from "@/pages/marketing-copy-generator";
import AIToolQuiz from "@/pages/ai-tool-quiz";
import BusinessNameGenerator from "@/pages/business-name-generator";
import ResumeOptimizer from "@/pages/resume-optimizer";
import AIToolsComparison from "@/pages/ai-tools-comparison";
import CompetitorIntelligence from "@/pages/competitor-intelligence";
import VoiceoverScriptGenerator from "@/pages/voiceover-script-generator";
import SlideDeckMaker from "@/pages/slide-deck-maker";
import ColdEmailGenerator from "@/pages/cold-email-generator";
import Sandbox from "@/pages/sandbox";
import ServicesPage from "@/pages/services";
import ContactPage from "@/pages/contact";
import CaseStudiesPage from "@/pages/case-studies";
import ROICalculator from "@/pages/roi-calculator";
import IndustryTemplatesPage from "@/pages/industry-templates";
import QuickStartTemplatesPage from "@/pages/quick-start-templates";
import TemplateAssistantPage from "@/pages/template-assistant";
import Blog from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import Resources from "@/pages/resources";
import ResourceDetail from "@/pages/resource-detail";
import EnterpriseGovernance from "@/pages/enterprise-governance";
import EnterpriseSecurity from "@/pages/enterprise-security";
import ExecutiveIntelligence from "@/pages/executive-intelligence";
import HubSpotIntegration from "@/pages/hubspot-integration";
import HeadlineSplitTestGenerator from "@/pages/headline-split-test-generator";
import BusinessIdeaValidator from "@/pages/business-idea-validator";
import LandingPageBuilder from "@/pages/landing-page-builder";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ChatButton } from "@/components/chat/ChatButton";

function Router() {
  // Implement smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/build-my-ai-stack" component={Calculator} />
      <Route path="/login" component={Login} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/demo" component={Demo} />
      <Route path="/template-demo" component={TemplateDemo} />
      <Route path="/sandbox" component={Sandbox} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/case-studies" component={CaseStudiesPage} />
      <Route path="/roi-calculator" component={ROICalculator} />
      <Route path="/industry-templates" component={IndustryTemplatesPage} />
      <Route path="/quick-start-templates" component={QuickStartTemplatesPage} />
      <Route path="/template-assistant" component={TemplateAssistantPage} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/resources" component={Resources} />
      <Route path="/resources/:slug" component={ResourceDetail} />
      <Route path="/marketing-copy-generator" component={MarketingCopyGenerator} />
      <Route path="/ai-tool-quiz" component={AIToolQuiz} />
      <Route path="/business-name-generator" component={BusinessNameGenerator} />
      <Route path="/resume-optimizer" component={ResumeOptimizer} />
      <Route path="/ai-tools-comparison" component={AIToolsComparison} />
      <Route path="/competitor-intelligence" component={CompetitorIntelligence} />
      <Route path="/voiceover-script-generator" component={VoiceoverScriptGenerator} />
      <Route path="/slide-deck-maker" component={SlideDeckMaker} />
      <Route path="/cold-email-generator" component={ColdEmailGenerator} />
      <Route path="/enterprise-governance" component={EnterpriseGovernance} />
      <Route path="/enterprise-security" component={EnterpriseSecurity} />
      <Route path="/executive-intelligence" component={ExecutiveIntelligence} />
      <Route path="/hubspot-integration" component={HubSpotIntegration} />
      <Route path="/headline-split-test-generator" component={HeadlineSplitTestGenerator} />
      <Route path="/business-idea-validator" component={BusinessIdeaValidator} />
      <Route path="/landing-page-builder" component={LandingPageBuilder} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Show the loading screen for a fixed duration to create an immersive experience
  useEffect(() => {
    // We'll show the loading screen for a meaningful amount of time
    // to allow users to enjoy the machine learning visualization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds is a good balance
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <TooltipProvider>
      <LoadingScreen 
        isLoading={isLoading} 
        onLoadingComplete={() => setIsLoading(false)}
        loadingDuration={4800} // Slightly shorter than the timeout to ensure smooth transition
      />
      <Toaster />
      <Router />
      {!isLoading && <ChatButton />}
    </TooltipProvider>
  );
}

export default App;
