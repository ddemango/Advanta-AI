import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aiPlatformOpen, setAiPlatformOpen] = useState(false);
  const [freeToolsOpen, setFreeToolsOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-muted' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="text-white font-bold text-lg sm:text-xl flex items-center" onClick={() => setLocation('/')}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg mr-2">
                <img 
                  src="@assets/ChatGPT Image May 31, 2025, 06_54_10 PM.png" 
                  alt="Advanta AI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span>Advanta<span className="text-primary">AI</span></span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a onClick={() => setLocation('/services')} className="text-gray-300 hover:text-white font-medium transition-colors cursor-pointer">Services</a>
            <a onClick={() => setLocation('/marketplace')} className="text-gray-300 hover:text-white font-medium transition-colors cursor-pointer">AI Marketplace</a>
            <a onClick={() => setLocation('/case-studies')} className="text-gray-300 hover:text-white font-medium transition-colors cursor-pointer">Case Studies</a>
            
            {/* Resources Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => setLocation('/free-tools')}
                className="text-gray-300 hover:text-white font-medium transition-colors flex items-center cursor-pointer"
              >
                Resources
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-96 max-h-96 overflow-y-auto bg-background/95 backdrop-blur-md border border-border/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-green-500 uppercase tracking-wide">Free AI Tools</p>
                  </div>
                  <a 
                    onClick={() => setLocation('/build-my-ai-stack')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    ⚡ Build My AI Stack
                  </a>
                  <a 
                    onClick={() => setLocation('/business-name-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🏢 Marketing Copy Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/ai-tool-quiz')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🧠 AI Tool Quiz
                  </a>
                  <a 
                    onClick={() => setLocation('/ai-tools-comparison')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    ⚖️ AI Tools Comparison Chart
                  </a>
                  <a 
                    onClick={() => setLocation('/competitor-intelligence')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🔍 AI Competitor Intelligence Analyzer
                  </a>
                  <a 
                    onClick={() => setLocation('/voiceover-script-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🎤 AI Voiceover Script Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/slide-deck-maker')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    📊 AI-Powered Slide Deck Maker
                  </a>
                  <a 
                    onClick={() => setLocation('/cold-email-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    📧 Cold Email Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/automation-builder')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🔧 Automation Builder Wizard
                  </a>
                  <a 
                    onClick={() => setLocation('/socialclip-analyzer')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🎬 SocialClip Analyzer AI
                  </a>
                  <a 
                    onClick={() => setLocation('/trending-content-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    📈 Trending Content Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/resume-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    📄 Resume Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/linkedin-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    💼 LinkedIn Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/headline-split-test-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    📊 Headline Split-Test Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/business-idea-validator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    💡 Business Idea Validator
                  </a>
                  <a 
                    onClick={() => setLocation('/crm-use-case-finder')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🔍 CRM Use Case Finder
                  </a>
                  <a 
                    onClick={() => setLocation('/custom-gpt-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🤖 Custom GPT Bot Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/prompt-library')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    📚 Time-Saving Prompt Library
                  </a>
                  <a 
                    onClick={() => setLocation('/landing-page-builder')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🎨 Landing Page Builder
                  </a>
                  <a 
                    onClick={() => setLocation('/workflow-explainer')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    ⚙️ AI Workflow Explainer
                  </a>
                  <a 
                    onClick={() => setLocation('/content-calendar-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    📅 Content Calendar Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/pricing-strategy-assistant')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    💰 Pricing Strategy Assistant
                  </a>
                  <a 
                    onClick={() => setLocation('/brand-kit-generator')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🎯 Brand Kit Generator
                  </a>
                  <a 
                    onClick={() => setLocation('/lead-magnet-builder')}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    🧲 Lead Magnet Builder
                  </a>
                </div>
              </div>
            </div>
            
            <a onClick={() => setLocation('/partnerships')} className="text-gray-300 hover:text-white font-medium transition-colors cursor-pointer">Partners</a>
            <a onClick={() => setLocation('/blog')} className="text-gray-300 hover:text-white font-medium transition-colors cursor-pointer">Blog</a>
            <a onClick={() => setLocation('/contact')} className="text-gray-300 hover:text-white font-medium transition-colors cursor-pointer">Contact</a>
          </nav>
          
          {/* Login, Theme Toggle and CTA Button */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <a href="/login">Client AI Suite</a>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href="/build-my-ai-stack">Build My AI Stack</a>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} pb-4 bg-background/95 backdrop-blur-md border-t border-border/20 mt-4 max-h-[70vh] overflow-y-auto`}>
          <div className="flex flex-col space-y-1 py-3">
            <a 
              onClick={() => {
                setLocation('/services');
                closeMenu();
              }}
              className="text-gray-300 hover:text-white font-medium transition-colors px-4 py-2 cursor-pointer"
            >
              Services
            </a>
            <a 
              onClick={() => {
                setLocation('/marketplace');
                closeMenu();
              }}
              className="text-gray-300 hover:text-white font-medium transition-colors px-4 py-2 cursor-pointer"
            >
              AI Marketplace
            </a>
            <a 
              onClick={() => {
                setLocation('/case-studies');
                closeMenu();
              }}
              className="text-gray-300 hover:text-white font-medium transition-colors px-4 py-2 cursor-pointer"
            >
              Case Studies
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-300 hover:text-white font-medium transition-colors px-4 py-2"
              onClick={closeMenu}
            >
              Testimonials
            </a>
            
            {/* AI Platform Dropdown */}
            <div>
              <button
                onClick={() => setAiPlatformOpen(!aiPlatformOpen)}
                className="w-full flex items-center justify-between text-gray-300 hover:text-white font-medium transition-colors px-4 py-2 text-left"
              >
                <span>AI Platform</span>
                <i className={`fas ${aiPlatformOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-sm`}></i>
              </button>
              {aiPlatformOpen && (
                <div className="bg-gray-800/50 ml-4 mr-2 rounded-lg mt-1 mb-2">
                  <div className="flex flex-col space-y-1 py-2">
                    <a 
                      onClick={() => {
                        setLocation('/demo');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      AI Demo
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/sandbox');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      AI Product Sandbox
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/marketplace');
                        closeMenu();
                      }} 
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      AI Marketplace
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/industry-templates');
                        closeMenu();
                      }} 
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Industry AI Solutions
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Free AI Tools Dropdown */}
            <div>
              <button
                onClick={() => setFreeToolsOpen(!freeToolsOpen)}
                className="w-full flex items-center justify-between text-gray-300 hover:text-white font-medium transition-colors px-4 py-2 text-left"
              >
                <span>Free AI Tools</span>
                <i className={`fas ${freeToolsOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-sm`}></i>
              </button>
              {freeToolsOpen && (
                <div className="bg-gray-800/50 ml-4 mr-2 rounded-lg mt-1 mb-2">
                  <div className="flex flex-col space-y-1 py-2">
                    <a 
                      onClick={() => {
                        setLocation('/build-my-ai-stack');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Build My AI Stack
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/business-name-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Marketing Copy Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/ai-tool-quiz');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      AI Tool Quiz
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/business-name-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Business Name Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/ai-tools-comparison');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      AI Tools Comparison
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/competitor-intelligence');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Competitor Intelligence
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/voiceover-script-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Voiceover Script Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/slide-deck-maker');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Slide Deck Maker
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/cold-email-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Cold Email Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/resume-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Resume Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/linkedin-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      LinkedIn Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/headline-split-test-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Headline Split-Test Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/business-idea-validator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Business Idea Validator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/crm-use-case-finder');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      CRM Use Case Finder
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/custom-gpt-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Custom GPT Bot Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/automation-builder');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Automation Builder Wizard
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/socialclip-analyzer');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      SocialClip Analyzer AI
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/trending-content-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Trending Content Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/prompt-library');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Time-Saving Prompt Library
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/landing-page-builder');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Landing Page Builder
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/workflow-explainer');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      AI Workflow Explainer
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/content-calendar-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Content Calendar Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/pricing-strategy-assistant');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Pricing Strategy Assistant
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/brand-kit-generator');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Brand Kit Generator
                    </a>
                    <a 
                      onClick={() => {
                        setLocation('/lead-magnet-builder');
                        closeMenu();
                      }}
                      className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm px-3 py-1"
                    >
                      Lead Magnet Builder
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a 
              onClick={() => {
                setLocation('/partnerships');
                closeMenu();
              }}
              className="text-gray-300 hover:text-white font-medium transition-colors px-4 py-2 cursor-pointer"
            >
              Partners
            </a>
            <a 
              onClick={() => {
                setLocation('/blog');
                closeMenu();
              }}
              className="text-gray-300 hover:text-white font-medium transition-colors px-4 py-2 cursor-pointer"
            >
              Blog
            </a>
            <a 
              onClick={() => {
                setLocation('/contact');
                closeMenu();
              }}
              className="text-gray-300 hover:text-white font-medium transition-colors px-4 py-2 cursor-pointer"
            >
              Contact
            </a>

            {/* Mobile Action Buttons */}
            <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-700/30 mt-4">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary w-full">
                <a href="/login">Client AI Suite</a>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 w-full">
                <a href="/build-my-ai-stack">Build My AI Stack</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}