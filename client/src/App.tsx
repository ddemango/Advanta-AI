import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Calculator from "@/pages/calculator";
import Login from "@/pages/Login";
import Marketplace from "@/pages/marketplace";
import Dashboard from "@/pages/Dashboard";
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
import ContentCalendarGenerator from "@/pages/content-calendar-generator";
import PricingStrategyAssistant from "@/pages/pricing-strategy-assistant";
import BrandKitGenerator from "@/pages/brand-kit-generator";
import PromptLibrary from "@/pages/prompt-library";
import CustomGPTGenerator from "@/pages/custom-gpt-generator";
import AutomationBuilder from "@/pages/automation-builder";
import WorkflowBuilder from "@/pages/WorkflowBuilder";
import Checkout from "@/pages/checkout";
import Partnerships from "@/pages/partnerships";
import SocialClipAnalyzer from "@/pages/socialclip-analyzer";
import TrendingContentGenerator from "@/pages/trending-content-generator";
import CompetitorIntelScanner from "@/pages/competitor-intel-scanner";
import TravelHackerAI from "@/pages/travel-hacker-ai";
import FantasyFootballTools from "@/pages/fantasy-football-tools";
import MovieMatchmaker from "@/pages/movie-matchmaker";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import FreeTools from "@/pages/free-tools";
import OAuthConsent from "@/pages/oauth-consent";
import GoogleAdsOAuth from "@/pages/google-ads-oauth";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ChatButton } from "@/components/chat/ChatButton";

function Router() {
  const [location] = useLocation();
  const [sessionInitialized, setSessionInitialized] = useState(false);

  // Initialize demo session on app load
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await fetch('/auth/demo-login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('Demo session established successfully');
        }
      } catch (error) {
        console.error('Failed to establish demo session:', error);
      } finally {
        setSessionInitialized(true);
      }
    };

    initializeSession();
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
      <Route path="/oauth-consent" component={OAuthConsent} />
      <Route path="/google-ads-oauth" component={GoogleAdsOAuth} />
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
      <Route path="/content-calendar-generator" component={ContentCalendarGenerator} />
      <Route path="/pricing-strategy-assistant" component={PricingStrategyAssistant} />
      <Route path="/brand-kit-generator" component={BrandKitGenerator} />
      <Route path="/prompt-library" component={PromptLibrary} />
      <Route path="/custom-gpt-generator" component={CustomGPTGenerator} />
      <Route path="/automation-builder" component={AutomationBuilder} />
      <Route path="/workflow-builder" component={WorkflowBuilder} />
      <Route path="/workflow-builder/:id" component={WorkflowBuilder} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/partnerships" component={Partnerships} />
      <Route path="/socialclip-analyzer" component={SocialClipAnalyzer} />
      <Route path="/trending-content-generator" component={TrendingContentGenerator} />
      <Route path="/competitor-intel-scanner" component={CompetitorIntelScanner} />
      <Route path="/travel-hacker-ai" component={TravelHackerAI} />
      <Route path="/fantasy-football-tools" component={FantasyFootballTools} />
      <Route path="/movie-matchmaker" component={MovieMatchmaker} />
      <Route path="/movie-matchmaker" component={MovieMatchmaker} />
      <Route path="/movie-matchmaker-simple" component={MovieMatchmaker} />
      <Route path="/free-tools" component={FreeTools} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
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
