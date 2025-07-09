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

interface ValidationResult {
  overallScore: number;
  targetAudience: string;
  monetizationModel: string;
  goToMarket: string;
  aiIntegration: string;
  investorReady: boolean;
  strengths: string[];
  challenges: string[];
  nextSteps: string[];
}

export default function BusinessIdeaValidator() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const validateIdea = async () => {
    if (!businessIdea.trim()) return;
    
    setIsValidating(true);
    
    // This would integrate with OpenAI API for real validation
    setTimeout(() => {
      const mockValidation: ValidationResult = {
        overallScore: 78,
        targetAudience: "Small to medium businesses (50-500 employees) in professional services, particularly law firms, consulting agencies, and marketing companies looking to automate client communication and reduce manual administrative tasks.",
        monetizationModel: "SaaS subscription model with tiered pricing: Starter ($49/month), Professional ($149/month), Enterprise ($399/month). Additional revenue through implementation services and custom integrations.",
        goToMarket: "Direct sales to SMBs through digital marketing, partnerships with business consultants, content marketing targeting business automation keywords, and freemium model to drive adoption.",
        aiIntegration: "Implement GPT-4 for intelligent email responses, Claude for document analysis, custom AI models for industry-specific workflows, and machine learning for predictive analytics and user behavior optimization.",
        investorReady: true,
        strengths: [
          "Clear pain point with measurable ROI",
          "Large addressable market ($12B+)",
          "Strong differentiation through AI integration",
          "Recurring revenue model",
          "Low customer acquisition cost potential"
        ],
        challenges: [
          "High competition in business automation space",
          "Need for significant upfront AI development",
          "Customer education required for AI adoption",
          "Data privacy and security concerns",
          "Integration complexity with existing systems"
        ],
        nextSteps: [
          "Develop MVP with core AI features",
          "Conduct customer interviews with 20+ prospects",
          "Build strategic partnerships with business consultants",
          "Secure seed funding for AI development team",
          "Create detailed technical architecture plan"
        ]
      };
      
      setValidation(mockValidation);
      setIsValidating(false);
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>Business Idea Validator | Advanta AI</title>
        <meta name="description" content="Validate your startup idea with AI-powered analysis. Get target audience insights, monetization strategies, and investor readiness scores." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
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
                <GradientText>Business Idea</GradientText> Validator
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Get comprehensive analysis of your startup idea including target audience, monetization models, and investor readiness score
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Validator Section */}
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
                  <h2 className="text-2xl font-bold mb-6">Describe Your Business Idea</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Idea Description</label>
                      <Textarea
                        placeholder="Describe your business idea in detail. What problem does it solve? How does it work? What makes it unique?"
                        value={businessIdea}
                        onChange={(e) => setBusinessIdea(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Industry/Sector</label>
                        <Input
                          placeholder="e.g., Healthcare, FinTech, E-commerce"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Target Market Size</label>
                        <Input
                          placeholder="e.g., Small businesses, Enterprise, Consumers"
                          value={targetMarket}
                          onChange={(e) => setTargetMarket(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={validateIdea}
                    disabled={isValidating || !businessIdea.trim()}
                    className="w-full mt-6"
                  >
                    {isValidating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Analyzing Your Idea...
                      </>
                    ) : 'Validate Business Idea'}
                  </Button>
                </motion.div>

                {validation && (
                  <motion.div variants={fadeIn} className="space-y-6">
                    {/* Score Card */}
                    <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 p-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{validation.overallScore}/100</div>
                        <div className="text-lg font-semibold mb-2">Validation Score</div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          validation.investorReady 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {validation.investorReady ? '✅ Investor Pitch-Ready' : '⚠️ Needs Development'}
                        </div>
                      </div>
                    </Card>

                    {/* Analysis Sections */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-background border border-white/10 p-6">
                        <h3 className="text-xl font-bold mb-4">🎯 Target Audience</h3>
                        <p className="text-gray-300">{validation.targetAudience}</p>
                      </Card>

                      <Card className="bg-background border border-white/10 p-6">
                        <h3 className="text-xl font-bold mb-4">💰 Monetization Model</h3>
                        <p className="text-gray-300">{validation.monetizationModel}</p>
                      </Card>

                      <Card className="bg-background border border-white/10 p-6">
                        <h3 className="text-xl font-bold mb-4">🚀 Go-to-Market Strategy</h3>
                        <p className="text-gray-300">{validation.goToMarket}</p>
                      </Card>

                      <Card className="bg-background border border-white/10 p-6">
                        <h3 className="text-xl font-bold mb-4">🤖 AI Integration Opportunities</h3>
                        <p className="text-gray-300">{validation.aiIntegration}</p>
                      </Card>
                    </div>

                    {/* Strengths and Challenges */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-green-500/10 border border-green-500/30 p-6">
                        <h3 className="text-xl font-bold mb-4 text-green-400">💪 Strengths</h3>
                        <ul className="space-y-2">
                          {validation.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <i className="fas fa-check text-green-400 mt-1 mr-2"></i>
                              <span className="text-gray-300">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>

                      <Card className="bg-yellow-500/10 border border-yellow-500/30 p-6">
                        <h3 className="text-xl font-bold mb-4 text-yellow-400">⚠️ Challenges</h3>
                        <ul className="space-y-2">
                          {validation.challenges.map((challenge, index) => (
                            <li key={index} className="flex items-start">
                              <i className="fas fa-exclamation-triangle text-yellow-400 mt-1 mr-2"></i>
                              <span className="text-gray-300">{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>

                    {/* Next Steps */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-xl font-bold mb-4">📋 Recommended Next Steps</h3>
                      <div className="grid gap-3">
                        {validation.nextSteps.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <div className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-gray-300">{step}</span>
                          </div>
                        ))}
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