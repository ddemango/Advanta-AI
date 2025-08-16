import SEOMetadata from '@/components/SEOMetadata';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, ArrowRight, Zap, BarChart3, Cog, MessageSquare, Workflow, Brain } from 'lucide-react';

export default function AIAutomationServices() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Automation Services",
    "description": "Comprehensive AI automation services including workflow automation, business process optimization, and intelligent system integration for enterprises.",
    "provider": {
      "@type": "Organization",
      "name": "Advanta AI"
    },
    "serviceType": "AI Business Automation",
    "areaServed": "Global",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "AI Automation Solutions",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Workflow Automation",
            "description": "Custom AI workflows that automate repetitive business processes"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "AI Chatbot Development",
            "description": "Intelligent chatbots for customer service and lead generation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "AI Marketing Automation",
            "description": "Automated marketing campaigns with AI-driven personalization"
          }
        }
      ]
    }
  };

  const services = [
    {
      id: "workflows",
      title: "AI Workflow Automation", 
      icon: <Workflow className="h-8 w-8" />,
      description: "Automate complex business processes with intelligent AI workflows",
      features: [
        "Custom workflow design and implementation",
        "Multi-system integration and data sync",
        "Intelligent decision-making automation",
        "Real-time process monitoring and optimization",
        "Scalable automation architecture"
      ],
      benefits: [
        "80% reduction in manual tasks",
        "50% faster process completion",
        "99.9% accuracy in automated decisions",
        "24/7 automated operations"
      ],
      useCases: [
        "Document processing and approval workflows",
        "Customer onboarding automation",
        "Inventory management and ordering",
        "Financial reconciliation processes",
        "HR recruitment and screening"
      ]
    },
    {
      id: "chatbots",
      title: "AI Chatbot Development",
      icon: <MessageSquare className="h-8 w-8" />,
      description: "Intelligent chatbots that enhance customer experience and automate support",
      features: [
        "Natural language processing and understanding",
        "Multi-channel deployment (web, mobile, social)",
        "CRM and database integration",
        "Sentiment analysis and escalation",
        "Continuous learning and improvement"
      ],
      benefits: [
        "70% reduction in support tickets",
        "24/7 customer service availability", 
        "60% increase in lead qualification",
        "90% customer satisfaction rate"
      ],
      useCases: [
        "Customer support automation",
        "Lead qualification and nurturing", 
        "Appointment scheduling",
        "Product recommendations",
        "FAQ and knowledge base queries"
      ]
    },
    {
      id: "marketing",
      title: "AI Marketing Automation",
      icon: <BarChart3 className="h-8 w-8" />,
      description: "Data-driven marketing automation with AI-powered personalization",
      features: [
        "Predictive customer behavior analysis",
        "Automated email and content campaigns",
        "Dynamic pricing and offer optimization",
        "Cross-channel campaign orchestration",
        "Real-time performance optimization"
      ],
      benefits: [
        "340% average ROI improvement",
        "65% increase in conversion rates",
        "50% reduction in acquisition costs",
        "85% more qualified leads"
      ],
      useCases: [
        "Personalized email marketing campaigns",
        "Dynamic website content optimization",
        "Automated social media management",
        "Customer journey optimization",
        "Predictive lead scoring"
      ]
    },
    {
      id: "analytics",
      title: "AI Business Intelligence",
      icon: <Brain className="h-8 w-8" />,
      description: "Transform data into actionable insights with AI-powered analytics",
      features: [
        "Predictive analytics and forecasting",
        "Real-time data processing and visualization",
        "Automated report generation",
        "Anomaly detection and alerts",
        "Custom dashboard development"
      ],
      benefits: [
        "95% more accurate forecasting",
        "60% faster decision making",
        "40% improvement in operational efficiency",
        "Real-time business monitoring"
      ],
      useCases: [
        "Sales forecasting and pipeline analysis",
        "Customer churn prediction",
        "Inventory optimization",
        "Financial risk assessment",
        "Performance monitoring dashboards"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOMetadata
        title="AI Automation Services | Business Process Automation & Optimization"
        description="Expert AI automation services including workflow automation, chatbot development, marketing automation, and business intelligence. 7-day implementation with 340% ROI."
        keywords="AI automation services, business process automation, AI workflow automation, AI chatbot development, AI marketing automation, intelligent automation"
        canonicalUrl="https://advanta-ai.com/ai-automation-services"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">🚀 Enterprise AI Solutions</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI Automation Services That Transform Business
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive AI automation services including workflow automation, intelligent chatbots, 
              marketing automation, and business intelligence. Deployed in 7 days with guaranteed ROI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8">
                Get Free Automation Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                View Case Studies
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Automated Processes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">7 Days</div>
                <div className="text-sm text-muted-foreground">Implementation Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">340%</div>
                <div className="text-sm text-muted-foreground">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Client Retention</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Complete AI Automation Solutions
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center text-primary mb-4">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Detailed AI Automation Services
            </h2>
            
            <Tabs defaultValue="workflows" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                {services.map((service) => (
                  <TabsTrigger key={service.id} value={service.id} className="text-sm">
                    {service.title.split(' ')[1]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {services.map((service) => (
                <TabsContent key={service.id} value={service.id} className="mt-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Cog className="h-5 w-5" />
                          Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Benefits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Use Cases
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {service.useCases.map((useCase, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              {useCase}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our 7-Day AI Automation Process
            </h2>
            
            <div className="space-y-8">
              {[
                {
                  day: "Day 1-2",
                  title: "Discovery & Analysis",
                  description: "Comprehensive audit of current processes, identification of automation opportunities, and custom solution design."
                },
                {
                  day: "Day 3-4", 
                  title: "Development & Configuration",
                  description: "AI system development, integration setup, and initial testing with your existing systems and workflows."
                },
                {
                  day: "Day 5-6",
                  title: "Testing & Optimization",
                  description: "Comprehensive testing, performance optimization, user training, and quality assurance validation."
                },
                {
                  day: "Day 7",
                  title: "Launch & Support",
                  description: "Full deployment, go-live support, monitoring setup, and ongoing optimization to ensure maximum ROI."
                }
              ].map((step, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">{step.day}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Automate Your Business with AI?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 500+ businesses using our AI automation services. Get your custom automation strategy and see 340% ROI in 90 days.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Automation Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}