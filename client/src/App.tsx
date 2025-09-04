import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Page imports
import Home from "@/pages/home";
import Calculator from "@/pages/calculator";
import Login from "@/pages/login";
import ResetPassword from "@/pages/reset-password";
// Removed duplicate Marketplace import
import Dashboard from "@/pages/dashboard";
import SimpleDashboard from "@/pages/SimpleDashboard";
import WorkingDashboard from "@/pages/WorkingDashboard";
import ModernDashboard from "@/pages/ModernDashboard";
import Projects from "@/pages/Projects";
import MyGPTs from "@/pages/MyGPTs";
import DataIntegrations from "@/pages/DataIntegrations";
import AccountSettings from "@/pages/AccountSettings";
import HelpSupport from "@/pages/HelpSupport";
import ChatbotBuilder from "@/pages/ChatbotBuilder";
import Onboarding from "@/pages/onboarding";
import Demo from "@/pages/demo";
import TemplateDemo from "@/pages/template-demo";
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
import MarketingCopyGenerator from "@/pages/marketing-copy-generator";
import AIToolQuiz from "@/pages/ai-tool-quiz";
import BusinessNameGenerator from "@/pages/business-name-generator";
import ResumeOptimizer from "@/pages/resume-optimizer";
import ResumeGenerator from "@/pages/resume-generator";
import ATSResumeTailor from "@/pages/ats-resume-tailor";
import AIToolsComparison from "@/pages/ai-tools-comparison";
import CompetitorIntelligence from "@/pages/competitor-intelligence";
import VoiceoverScriptGenerator from "@/pages/voiceover-script-generator";
import SlideDeckMaker from "@/pages/slide-deck-maker";
import ColdEmailGenerator from "@/pages/cold-email-generator";
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
import TravelHackerPro from "@/pages/travel-hacker-pro";
import MovieTVMatchmaker from "@/pages/movie-tv-matchmaker";
import About from "@/pages/about";
import AIStackBuilder from "@/pages/ai-stack-builder";
import LeadMagnetBuilder from "@/pages/lead-magnet-builder";
import FlightFinder from "@/pages/flight-finder";
import FantasyFootballTools from "@/pages/fantasy-football-tools";
import MainLayout from "@/components/ai-portal/MainLayout";
import { AIPortal } from "./pages/ai-portal";
import { AbacusDemo } from './pages/abacus-demo';
import ChatLLMFeatured from './pages/ChatLLMFeatured';
import AbacusDeepAgent from './pages/AbacusDeepAgent';
import TVMatchmaker from "@/pages/tv-matchmaker";
import PrivacyPolicy from "@/pages/privacy-policy";
import { BestAIAgencyPage, AIMarketingAgencyPage } from "@/pages/seo-landing-pages";
import AIAgencyComparison from "@/pages/ai-agency-comparison";
import AIAutomationServices from "@/pages/ai-automation-services";
import TermsOfService from "@/pages/terms-of-service";

import NewsletterTest from "@/pages/newsletter-test";
import FreeTools from "@/pages/free-tools";
import OAuthConsent from "@/pages/oauth-consent";
import GoogleAdsOAuth from "@/pages/google-ads-oauth";
import RedesignedHome from "@/pages/redesigned-home";
import AdminDashboard from "@/pages/admin-dashboard";
import TenantLandingPage from "@/pages/tenant/TenantLandingPage";
import ThemeEditor from "@/pages/admin/ThemeEditor";
import AIWorkflowAutomation from "@/pages/ai-workflow-automation";
import WebsiteAIAssistants from "@/pages/website-ai-assistants";
import APIIntegrations from "@/pages/api-integrations";
import IndustrySpecificAI from "@/pages/industry-specific-ai";
import ClientSuiteWaitlist from "@/pages/ClientSuiteWaitlist";
import ClientPortalPage from "@/pages/ClientPortalPage";
import Marketplace from "@/pages/Marketplace";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminSignup from "@/pages/admin/AdminSignup";
import NotFound from "@/pages/not-found";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ChatButton } from "@/components/chat/ChatButton";

// Profile Menu Pages
import ProfilePage from "@/pages/ProfilePage";
import CustomizePage from "@/pages/CustomizePage";
import MemoriesPage from "@/pages/MemoriesPage";
import ConnectorsPage from "@/pages/ConnectorsPage";
import HelpPage from "@/pages/HelpPage";
import RouteLLMPage from "@/pages/RouteLLMPage";
import CustomBotPage from "@/pages/CustomBotPage";

function Router() {
  const [location] = useLocation();
  const [sessionInitialized, setSessionInitialized] = useState(false);

  // Don't auto-initialize demo session - let user login normally
  useEffect(() => {
    setSessionInitialized(true);
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
      <Route path="/" component={RedesignedHome} />
      <Route path="/home-original" component={Home} />
      <Route path="/home" component={RedesignedHome} />
      <Route path="/build-my-ai-stack" component={Calculator} />
      {/* Remove public login/signup - these are now admin-only */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/signup" component={AdminSignup} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/oauth-consent" component={OAuthConsent} />
      <Route path="/google-ads-oauth" component={GoogleAdsOAuth} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/dashboard" component={ModernDashboard} />
      <Route path="/chatbot-builder" component={ChatbotBuilder} />
      <Route path="/projects" component={Projects} />
      <Route path="/my-gpts" component={MyGPTs} />
      <Route path="/data-integrations" component={DataIntegrations} />
      <Route path="/account-settings" component={AccountSettings} />
      <Route path="/help-support" component={HelpSupport} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/demo" component={Demo} />
      <Route path="/template-demo" component={TemplateDemo} />
      <Route path="/sandbox" component={Sandbox} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/ai-workflow-automation" component={AIWorkflowAutomation} />
      <Route path="/services/website-ai-assistants" component={WebsiteAIAssistants} />
      <Route path="/services/api-integrations" component={APIIntegrations} />
      <Route path="/services/industry-specific-ai" component={IndustrySpecificAI} />
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
      <Route path="/resume-generator" component={ResumeGenerator} />
      <Route path="/ats-resume-tailor" component={ATSResumeTailor} />
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
      <Route path="/ai-stack-builder" component={AIStackBuilder} />
      <Route path="/lead-magnet-builder" component={LeadMagnetBuilder} />
      <Route path="/travel-hacker-pro" component={TravelHackerPro} />
      <Route path="/movie-tv-matchmaker" component={MovieTVMatchmaker} />
      <Route path="/about" component={About} />
      <Route path="/flight-finder" component={FlightFinder} />
      <Route path="/fantasy-football-tools" component={FantasyFootballTools} />
      <Route path="/ai-portal" component={AIPortal} />
      
      {/* Profile Routes */}
      <Route path="/profile" component={ProfilePage} />
      
      {/* AI Portal Profile Menu Routes */}
      <Route path="/ai-portal/profile" component={ProfilePage} />
      <Route path="/ai-portal/settings/customize" component={CustomizePage} />
      <Route path="/ai-portal/memories" component={MemoriesPage} />
      <Route path="/ai-portal/developer/route-llm" component={RouteLLMPage} />
      <Route path="/ai-portal/connectors" component={ConnectorsPage} />
      <Route path="/ai-portal/help" component={HelpPage} />
      <Route path="/ai-portal/bots/settings" component={CustomBotPage} />
      
      <Route path="/deepagent" component={AbacusDeepAgent} />
      <Route path="/abacus-demo" component={AbacusDemo} />
      <Route path="/tv-matchmaker" component={TVMatchmaker} />
      <Route path="/free-tools" component={FreeTools} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/newsletter-test" component={NewsletterTest} />
      <Route path="/client-suite-waitlist" component={ClientSuiteWaitlist} />
      <Route path="/client-portal" component={ClientPortalPage} />
      
      {/* SEO Landing Pages */}
      <Route path="/best-ai-agency" component={BestAIAgencyPage} />
      <Route path="/ai-marketing-agency" component={AIMarketingAgencyPage} />
      <Route path="/top-ai-agencies-2025" component={AIAgencyComparison} />
      <Route path="/ai-automation-services" component={AIAutomationServices} />
      
      {/* Tenant-specific workflow landing pages */}
      <Route path="/tenant/:slug" component={TenantLandingPage} />
      
      {/* Admin theme editor */}
      <Route path="/admin/theme-editor" component={ThemeEditor} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const showChatButton = !location.includes('/chatbot-builder');
  
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
      {showChatButton && <ChatButton />}
    </TooltipProvider>
  );
}

export default App;