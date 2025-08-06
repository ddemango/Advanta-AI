import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { GradientText } from '@/components/ui/gradient-text';
import { Helmet } from 'react-helmet';

export default function IndustrySpecificAI() {
  const industries = [
    {
      title: "Healthcare & Medical",
      description: "HIPAA-compliant AI solutions for patient management, appointment scheduling, and medical record processing.",
      features: ["Patient intake automation", "Appointment scheduling", "Medical record digitization", "Insurance verification"],
      compliance: "HIPAA Compliant",
      caseStudy: "Reduced appointment no-shows by 40% for medical practice"
    },
    {
      title: "Real Estate",
      description: "AI-powered lead qualification, property matching, and client communication systems for real estate professionals.",
      features: ["Lead qualification", "Property recommendations", "Market analysis automation", "Client follow-up sequences"],
      compliance: "MLS Integration",
      caseStudy: "Increased qualified leads by 300% for real estate team"
    },
    {
      title: "Legal Services",
      description: "Secure AI solutions for document review, client intake, and case management with attorney-client privilege protection.",
      features: ["Document analysis", "Client intake forms", "Case status updates", "Billing automation"],
      compliance: "Attorney-Client Privilege",
      caseStudy: "Reduced document review time by 70% for law firm"
    },
    {
      title: "Financial Services",
      description: "Regulated AI solutions for customer onboarding, loan processing, and compliance monitoring.",
      features: ["KYC automation", "Loan application processing", "Risk assessment", "Compliance monitoring"],
      compliance: "SOX & PCI Compliant",
      caseStudy: "Accelerated loan approvals by 50% while maintaining compliance"
    },
    {
      title: "E-commerce & Retail",
      description: "AI-driven inventory management, customer service, and personalized shopping experiences.",
      features: ["Inventory optimization", "Customer service automation", "Personalized recommendations", "Order fulfillment"],
      compliance: "PCI DSS Compliant",
      caseStudy: "Boosted conversion rates by 25% with personalized AI recommendations"
    },
    {
      title: "Manufacturing",
      description: "Industrial AI solutions for predictive maintenance, quality control, and supply chain optimization.",
      features: ["Predictive maintenance", "Quality assurance automation", "Supply chain optimization", "Safety monitoring"],
      compliance: "ISO 9001 Standards",
      caseStudy: "Prevented 90% of equipment failures with predictive AI maintenance"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Industry-Specific AI Automations - Advanta AI</title>
        <meta name="description" content="Custom AI solutions tailored for healthcare, real estate, legal, financial services, e-commerce, and manufacturing industries. Compliance-ready and industry-optimized." />
        <meta name="keywords" content="industry AI solutions, healthcare AI, real estate automation, legal AI, financial services AI, manufacturing automation" />
        <meta property="og:title" content="Industry-Specific AI Automations - Advanta AI" />
        <meta property="og:description" content="Custom AI solutions tailored for specific industries with compliance standards and specialized workflows." />
        <meta property="og:type" content="website" />
      </Helmet>

      <NewHeader />

      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-orange-600/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-6 text-purple-600 border-purple-600/50">
                  Industry-Specific AI Automations
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  AI Solutions Built for <GradientText>Your Industry</GradientText>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Our AI adapts to your industry, learning from your unique processes for better results. Get automation solutions designed specifically for your industry's requirements, compliance standards, and specialized workflows.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <a href="#contact">Find My Industry Solution</a>
                  </Button>
                  <Button size="lg" variant="outline">
                    <a href="#industries">Browse Industries</a>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Industries Grid */}
        <section id="industries" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <GradientText>Industry Expertise</GradientText> That Delivers Results
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Specialized AI solutions with deep industry knowledge and compliance requirements
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold mb-4">{industry.title}</h3>
                  <p className="text-muted-foreground mb-6">{industry.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Capabilities:</h4>
                    <ul className="space-y-2">
                      {industry.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                    <div className="text-green-600 font-medium text-sm">✓ {industry.compliance}</div>
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-6">
                    <div className="text-primary font-medium text-sm">{industry.caseStudy}</div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <a href="#contact">Get Industry Solution</a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <GradientText>Compliance-First</GradientText> Approach
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our AI solutions are built with industry regulations and compliance standards from day one
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { standard: "HIPAA", description: "Healthcare Privacy Protection", icon: "🏥" },
                { standard: "SOX", description: "Financial Reporting Standards", icon: "💰" },
                { standard: "GDPR", description: "Data Protection Regulation", icon: "🛡️" },
                { standard: "ISO 27001", description: "Information Security Management", icon: "🔒" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-background rounded-xl p-6 border border-border"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{item.standard}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our <GradientText>Industry-Specific</GradientText> Process
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Deep industry analysis meets rapid AI deployment
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Industry Analysis", description: "Deep dive into your industry's specific challenges and opportunities" },
                { step: "2", title: "Compliance Review", description: "Ensure all solutions meet industry regulations and standards" },
                { step: "3", title: "Custom Development", description: "Build AI solutions tailored to your industry's unique workflows" },
                { step: "4", title: "Specialized Deployment", description: "Launch with industry-specific training and support" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Teaser */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Industry <GradientText>Success Stories</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Real results from businesses in your industry
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { industry: "Healthcare", result: "40% Reduction", metric: "in appointment no-shows", company: "Regional Medical Practice" },
                { industry: "Real Estate", result: "300% Increase", metric: "in qualified leads", company: "Luxury Real Estate Team" },
                { industry: "Legal", result: "70% Faster", metric: "document review process", company: "Corporate Law Firm" }
              ].map((story, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-background border border-border rounded-xl p-6 text-center"
                >
                  <Badge variant="secondary" className="mb-4">{story.industry}</Badge>
                  <div className="text-3xl font-bold text-primary mb-2">{story.result}</div>
                  <div className="text-lg mb-4">{story.metric}</div>
                  <div className="text-sm text-muted-foreground">{story.company}</div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                <a href="/case-studies">View All Case Studies</a>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready for <GradientText>Industry-Specific AI?</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Let's discuss how AI can transform your industry-specific challenges into competitive advantages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Book Industry Consultation
                </Button>
                <Button size="lg" variant="outline">
                  Download Industry Guide
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}