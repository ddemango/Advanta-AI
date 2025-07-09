import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';

interface PricingStrategy {
  recommendedTiers: {
    name: string;
    price: string;
    features: string[];
    targetCustomer: string;
  }[];
  psychologicalTactics: string[];
  valueStack: string[];
  marketComparison: {
    competitor: string;
    price: string;
    positioning: string;
  }[];
}

export default function PricingStrategyAssistant() {
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [productCost, setProductCost] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [strategy, setStrategy] = useState<PricingStrategy | null>(null);

  const analyzePricing = async () => {
    if (!productName || !targetAudience || !productCost) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockStrategy: PricingStrategy = {
        recommendedTiers: [
          {
            name: 'Starter',
            price: '$49/month',
            features: ['Basic AI automation', 'Up to 1,000 tasks/month', 'Email support', 'Standard templates'],
            targetCustomer: 'Small businesses and solopreneurs'
          },
          {
            name: 'Professional',
            price: '$149/month',
            features: ['Advanced AI features', 'Up to 10,000 tasks/month', 'Priority support', 'Custom workflows', 'Analytics dashboard'],
            targetCustomer: 'Growing teams and medium businesses'
          },
          {
            name: 'Enterprise',
            price: '$399/month',
            features: ['Unlimited tasks', 'White-label solution', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'],
            targetCustomer: 'Large organizations and enterprises'
          }
        ],
        psychologicalTactics: [
          'Anchor high with Enterprise tier to make Professional seem reasonable',
          'Use 9-ending prices ($49, $149) for better conversion',
          'Position middle tier as "Most Popular" to drive selection',
          'Offer annual discounts (2 months free) to increase commitment',
          'Include "Free Trial" to reduce purchase friction'
        ],
        valueStack: [
          'Save 15+ hours per week (valued at $750/week)',
          'Reduce operational costs by 40% ($2,000/month savings)',
          'Increase team productivity by 60%',
          'ROI achieved within first 30 days',
          'Award-winning customer support included'
        ],
        marketComparison: [
          {
            competitor: 'Zapier',
            price: '$19-$599/month',
            positioning: 'Position as more AI-focused and user-friendly'
          },
          {
            competitor: 'Monday.com',
            price: '$8-$16/user/month',
            positioning: 'Emphasize automation vs manual project management'
          },
          {
            competitor: 'Notion',
            price: '$8-$15/user/month',
            positioning: 'Highlight AI intelligence vs static documentation'
          }
        ]
      };
      
      setStrategy(mockStrategy);
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <>
      <Helmet>
        <title>Pricing Strategy Assistant | Advanta AI</title>
        <meta name="description" content="Get AI-powered pricing recommendations with psychological tactics, value stacks, and market positioning for your product." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background">
        <section className="py-20 bg-gradient-to-b from-background to-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px] opacity-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6">
                <GradientText>Pricing Strategy</GradientText> Assistant
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Get data-driven pricing recommendations with psychological tactics, value propositions, and competitive positioning
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-8"
              >
                <motion.div variants={fadeIn} className="bg-background border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Product Information</h2>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Name</label>
                        <Input
                          placeholder="e.g., AI Workflow Assistant"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Monthly Cost to Deliver</label>
                        <Input
                          placeholder="e.g., $15 per customer"
                          value={productCost}
                          onChange={(e) => setProductCost(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Audience</label>
                      <Input
                        placeholder="e.g., Small business owners, Marketing teams"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Key Features & Benefits</label>
                      <Textarea
                        placeholder="List the main features and benefits your product provides..."
                        value={keyFeatures}
                        onChange={(e) => setKeyFeatures(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={analyzePricing}
                    disabled={isAnalyzing || !productName || !targetAudience || !productCost}
                    className="w-full mt-6"
                  >
                    {isAnalyzing ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Analyzing Optimal Pricing...
                      </>
                    ) : 'Generate Pricing Strategy'}
                  </Button>
                </motion.div>

                {strategy && (
                  <motion.div variants={fadeIn} className="space-y-6">
                    {/* Pricing Tiers */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-2xl font-bold mb-4">💰 Recommended Pricing Tiers</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {strategy.recommendedTiers.map((tier, index) => (
                          <div key={index} className={`p-4 rounded-lg border ${
                            index === 1 
                              ? 'border-primary bg-primary/10' 
                              : 'border-white/20 bg-gray-800/50'
                          }`}>
                            {index === 1 && (
                              <div className="text-center mb-2">
                                <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                                  MOST POPULAR
                                </span>
                              </div>
                            )}
                            <h4 className="text-lg font-bold mb-2">{tier.name}</h4>
                            <div className="text-2xl font-bold text-primary mb-3">{tier.price}</div>
                            <ul className="space-y-1 text-sm mb-3">
                              {tier.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <i className="fas fa-check text-green-400 mt-1 mr-2 text-xs"></i>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs text-gray-400">{tier.targetCustomer}</p>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Psychological Tactics */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-2xl font-bold mb-4">🧠 Psychological Pricing Tactics</h3>
                      <div className="grid gap-3">
                        {strategy.psychologicalTactics.map((tactic, index) => (
                          <div key={index} className="flex items-start">
                            <div className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-gray-300">{tactic}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Value Stack */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-2xl font-bold mb-4">📈 Value Stack Breakdown</h3>
                      <div className="space-y-3">
                        {strategy.valueStack.map((value, index) => (
                          <div key={index} className="flex items-center p-3 bg-green-500/10 border border-green-500/30 rounded">
                            <i className="fas fa-dollar-sign text-green-400 mr-3"></i>
                            <span className="text-gray-300">{value}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Market Comparison */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-2xl font-bold mb-4">🎯 Competitive Positioning</h3>
                      <div className="grid gap-4">
                        {strategy.marketComparison.map((comp, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded">
                            <div>
                              <h4 className="font-semibold">{comp.competitor}</h4>
                              <p className="text-sm text-gray-400">{comp.positioning}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-primary">{comp.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 p-6">
                      <h3 className="text-xl font-bold mb-3">💡 Implementation Tips</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">A/B Testing:</h4>
                          <ul className="space-y-1 text-gray-300">
                            <li>• Test different price points with small segments</li>
                            <li>• Monitor conversion rates and customer lifetime value</li>
                            <li>• Adjust based on customer feedback and metrics</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Launch Strategy:</h4>
                          <ul className="space-y-1 text-gray-300">
                            <li>• Start with limited-time launch pricing</li>
                            <li>• Offer grandfathered rates for early adopters</li>
                            <li>• Gradually increase prices as demand grows</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}