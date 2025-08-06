import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { GradientText } from '@/components/ui/gradient-text';
import { Helmet } from 'react-helmet';

export default function APIIntegrations() {
  const integrationCategories = [
    {
      category: "CRM & Sales",
      integrations: ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "Close", "Copper"],
      description: "Connect your AI workflows with customer relationship management systems"
    },
    {
      category: "Communication",
      integrations: ["Slack", "Microsoft Teams", "Discord", "Zoom", "Gmail", "Outlook"],
      description: "Integrate with your team communication and email platforms"
    },
    {
      category: "Marketing",
      integrations: ["Mailchimp", "ConvertKit", "ActiveCampaign", "Google Ads", "Facebook Ads", "LinkedIn Ads"],
      description: "Automate marketing campaigns and lead nurturing workflows"
    },
    {
      category: "E-commerce",
      integrations: ["Shopify", "WooCommerce", "Magento", "BigCommerce", "Stripe", "PayPal"],
      description: "Sync with your online store and payment processing systems"
    },
    {
      category: "Project Management",
      integrations: ["Asana", "Trello", "Monday.com", "Jira", "ClickUp", "Notion"],
      description: "Connect AI workflows with your project and task management tools"
    },
    {
      category: "Analytics & Reporting",
      integrations: ["Google Analytics", "Mixpanel", "Segment", "Tableau", "Power BI", "Looker"],
      description: "Pull data from analytics platforms for AI-driven insights"
    }
  ];

  const customIntegrations = [
    {
      title: "Custom API Development",
      description: "We build custom API integrations for proprietary systems and legacy software",
      features: ["REST API development", "GraphQL endpoints", "Webhook setup", "Authentication handling"],
      timeline: "2-3 weeks"
    },
    {
      title: "Database Connections",
      description: "Direct integration with your existing databases for real-time data access",
      features: ["SQL database integration", "NoSQL database support", "Data synchronization", "Security protocols"],
      timeline: "1-2 weeks"
    },
    {
      title: "Enterprise Systems",
      description: "Connect with enterprise software like SAP, Oracle, and Microsoft Dynamics",
      features: ["ERP integration", "Single sign-on (SSO)", "Enterprise security", "Scalable architecture"],
      timeline: "3-4 weeks"
    }
  ];

  return (
    <>
      <Helmet>
        <title>API Integrations - Advanta AI</title>
        <meta name="description" content="Connect your AI workflows with 500+ business tools and systems. Custom API integrations for CRM, marketing, e-commerce, and enterprise platforms." />
        <meta name="keywords" content="API integration, business automation, CRM integration, marketing automation, enterprise software integration" />
        <meta property="og:title" content="API Integrations - Advanta AI" />
        <meta property="og:description" content="Connect your AI workflows with 500+ business tools and systems through seamless API integrations." />
        <meta property="og:type" content="website" />
      </Helmet>

      <NewHeader />

      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-blue-600/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-6 text-green-600 border-green-600/50">
                  API Integrations
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Connect Your AI with <GradientText>Everything</GradientText>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Seamlessly integrate your AI workflows with 500+ business tools and systems. From CRM to analytics, we connect your AI with the tools you already use.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <a href="#contact">Plan My Integrations</a>
                  </Button>
                  <Button size="lg" variant="outline">
                    <a href="#integrations">Browse Integrations</a>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Integration Categories */}
        <section id="integrations" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <GradientText>500+</GradientText> Pre-Built Integrations
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Connect with the tools your business already uses
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {integrationCategories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-xl font-bold mb-3">{category.category}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.integrations.slice(0, 4).map((integration, intIndex) => (
                      <Badge key={intIndex} variant="secondary" className="text-xs">
                        {integration}
                      </Badge>
                    ))}
                    {category.integrations.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.integrations.length - 4} more
                      </Badge>
                    )}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    View All Integrations
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Integrations */}
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
                Need a <GradientText>Custom Integration?</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We build custom integrations for proprietary systems and unique business requirements
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {customIntegrations.map((integration, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-background border border-border rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4">{integration.title}</h3>
                  <p className="text-muted-foreground mb-6">{integration.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {integration.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-primary/10 rounded-lg p-3 mb-6">
                    <div className="text-sm font-medium">Timeline: {integration.timeline}</div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <a href="#contact">Request Quote</a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How Integration Works */}
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
                How <GradientText>Integration</GradientText> Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Seamless setup process with zero downtime
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "System Audit", description: "We analyze your current tools and identify integration points" },
                { step: "2", title: "Integration Planning", description: "Design the optimal data flow and automation triggers" },
                { step: "3", title: "Secure Connection", description: "Set up authenticated connections with enterprise-grade security" },
                { step: "4", title: "Testing & Launch", description: "Thorough testing before going live with full monitoring" }
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

        {/* Security & Compliance */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Enterprise-Grade <GradientText>Security</GradientText>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Your data is protected with industry-leading security standards
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: "🔒", title: "End-to-End Encryption" },
                  { icon: "🛡️", title: "SOC 2 Compliant" },
                  { icon: "🔑", title: "OAuth 2.0 Authentication" },
                  { icon: "📋", title: "GDPR Compliant" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                  </motion.div>
                ))}
              </div>
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
                Ready to <GradientText>Connect Everything?</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Let's discuss your integration needs and create a custom plan for connecting your AI workflows with your existing tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Book Integration Consultation
                </Button>
                <Button size="lg" variant="outline">
                  View Integration Examples
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