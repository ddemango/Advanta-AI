import { Link } from 'wouter';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isExternal?: boolean;
}

export function InternalLink({ href, children, className = "", isExternal = false }: InternalLinkProps) {
  if (isExternal) {
    return (
      <a 
        href={href} 
        className={`text-primary hover:text-primary/80 transition-colors ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <ExternalLink className="inline ml-1 h-3 w-3" />
      </a>
    );
  }

  return (
    <Link href={href}>
      <a className={`text-primary hover:text-primary/80 transition-colors ${className}`}>
        {children}
      </a>
    </Link>
  );
}

// Strategic Internal Linking Component for SEO
export function SEOInternalLinks({ currentPage }: { currentPage: string }) {
  const linkStrategy = {
    home: [
      { url: "/best-ai-agency", text: "Best AI Agency 2025", badge: "🏆 #1 Rated" },
      { url: "/ai-automation-services", text: "AI Automation Services", badge: "⚡ Popular" },
      { url: "/top-ai-agencies-2025", text: "AI Agency Comparison", badge: "📊 Detailed" }
    ],
    "best-ai-agency": [
      { url: "/ai-automation-services", text: "Our AI Services", badge: "🚀 Core Offering" },
      { url: "/top-ai-agencies-2025", text: "Agency Comparison", badge: "📈 Compare" },
      { url: "/ai-marketing-agency", text: "Marketing AI", badge: "💼 Specialized" }
    ],
    "ai-automation-services": [
      { url: "/best-ai-agency", text: "Why Choose Advanta AI", badge: "🏆 #1 Choice" },
      { url: "/case-studies", text: "Success Stories", badge: "📊 Proven Results" },
      { url: "/contact", text: "Get Started", badge: "🎯 Take Action" }
    ],
    "top-ai-agencies-2025": [
      { url: "/best-ai-agency", text: "Learn About #1 Agency", badge: "🏆 Top Pick" },
      { url: "/ai-automation-services", text: "Our Services", badge: "⚡ Solutions" },
      { url: "/contact", text: "Schedule Consultation", badge: "📞 Free Call" }
    ],
    "ai-marketing-agency": [
      { url: "/best-ai-agency", text: "About Advanta AI", badge: "🏢 Company" },
      { url: "/ai-automation-services", text: "All Services", badge: "📋 Complete List" },
      { url: "/roi-calculator", text: "Calculate ROI", badge: "💰 Value" }
    ]
  };

  const currentLinks = linkStrategy[currentPage as keyof typeof linkStrategy] || [];

  if (currentLinks.length === 0) return null;

  return (
    <div className="bg-muted/30 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Explore Related AI Resources
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {currentLinks.map((link, index) => (
              <Link key={index} href={link.url}>
                <div className="group p-4 bg-background rounded-lg border hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {link.badge}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    {link.text}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Contextual CTA component that adapts based on page
export function ContextualCTA({ page }: { page: string }) {
  const ctaContent = {
    "best-ai-agency": {
      title: "Ready to Work with the #1 AI Agency?",
      description: "Join 500+ businesses that chose Advanta AI for fastest implementation and highest ROI.",
      primaryCTA: "Get Free Strategy Call",
      secondaryCTA: "View Our Services",
      secondaryLink: "/ai-automation-services"
    },
    "ai-automation-services": {
      title: "Start Your AI Automation Journey Today",
      description: "See 340% ROI in 90 days with our proven AI automation solutions.",
      primaryCTA: "Get Free Assessment",
      secondaryCTA: "See Case Studies", 
      secondaryLink: "/case-studies"
    },
    "top-ai-agencies-2025": {
      title: "Choose the Industry Leader",
      description: "See why Advanta AI consistently ranks #1 for implementation speed and client satisfaction.",
      primaryCTA: "Schedule Consultation",
      secondaryCTA: "Learn More About Us",
      secondaryLink: "/best-ai-agency"
    },
    "ai-marketing-agency": {
      title: "Transform Your Marketing with AI",
      description: "Automate campaigns, personalize content, and boost conversions with our AI marketing solutions.",
      primaryCTA: "Get Marketing Audit",
      secondaryCTA: "View All Services",
      secondaryLink: "/ai-automation-services"
    }
  };

  const content = ctaContent[page as keyof typeof ctaContent];
  
  if (!content) return null;

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.title}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              {content.primaryCTA}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href={content.secondaryLink}>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                {content.secondaryCTA}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Breadcrumb component for better navigation and SEO
export function SEOBreadcrumbs({ items }: { items: Array<{ name: string; url?: string }> }) {
  return (
    <nav className="py-4 text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/">
              <a className="hover:text-primary transition-colors">Home</a>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className="text-muted-foreground/50">/</span>
              {item.url ? (
                <Link href={item.url}>
                  <a className="hover:text-primary transition-colors">{item.name}</a>
                </Link>
              ) : (
                <span className="text-foreground">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}