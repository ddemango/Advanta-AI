import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';

interface CustomBot {
  name: string;
  systemPrompt: string;
  instructions: string[];
  usageExamples: string[];
  bestPractices: string[];
}

export default function CustomGPTGenerator() {
  const [topic, setTopic] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [botType, setBotType] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customBot, setCustomBot] = useState<CustomBot | null>(null);

  const generateBot = async () => {
    if (!topic || !targetUser || !botType) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockBot: CustomBot = {
        name: `${topic} ${botType} Assistant`,
        systemPrompt: `You are a specialized ${topic.toLowerCase()} ${botType.toLowerCase()} designed to help ${targetUser.toLowerCase()}. Your expertise includes ${topic.toLowerCase()} strategy, best practices, and actionable advice. Always provide specific, practical recommendations based on current industry standards. ${specialRequirements ? `Additional requirements: ${specialRequirements}` : ''} 

Key behaviors:
- Ask clarifying questions when context is unclear
- Provide step-by-step guidance when appropriate
- Reference industry best practices and current trends
- Offer multiple solutions when possible
- Maintain a professional yet approachable tone
- Always prioritize actionable, implementable advice`,
        instructions: [
          `Copy the system prompt and paste it into your AI assistant's system/custom instructions`,
          `Test the bot with sample questions related to ${topic.toLowerCase()}`,
          `Fine-tune the prompt based on the responses you receive`,
          `Save successful prompt variations for different use cases`,
          `Train the bot with specific examples from your ${topic.toLowerCase()} domain`,
          `Set up conversation starters that guide users to ask the right questions`
        ],
        usageExamples: [
          `"Help me create a ${topic.toLowerCase()} strategy for ${targetUser.toLowerCase()}"`,
          `"What are the current best practices in ${topic.toLowerCase()}?"`,
          `"Can you review my ${topic.toLowerCase()} approach and suggest improvements?"`,
          `"What metrics should I track for ${topic.toLowerCase()} success?"`,
          `"How do I get started with ${topic.toLowerCase()} if I'm a beginner?"`
        ],
        bestPractices: [
          `Regularly update the system prompt with new industry insights`,
          `Create conversation templates for common ${topic.toLowerCase()} scenarios`,
          `Document successful interactions to improve future responses`,
          `Set clear boundaries about what the bot can and cannot do`,
          `Provide sources and references when giving specific advice`,
          `Test the bot with edge cases to ensure robust responses`
        ]
      };
      
      setCustomBot(mockBot);
      setIsGenerating(false);
    }, 2500);
  };

  const copyPrompt = () => {
    if (!customBot) return;
    navigator.clipboard.writeText(customBot.systemPrompt);
  };

  return (
    <>
      <Helmet>
        <title>Custom GPT Bot Generator | Advanta AI</title>
        <meta name="description" content="Create custom AI assistants with specialized prompts and instructions. Generate sales coaches, marketing advisors, and domain-specific AI bots." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background">
        <section className="pt-24 pb-20 bg-gradient-to-b from-background to-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px] opacity-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6">
                <GradientText>Custom GPT Bot</GradientText> Generator
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Create specialized AI assistants with custom prompts and instructions. Perfect for sales coaches, marketing advisors, and domain-specific bots.
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
                  <h2 className="text-2xl font-bold mb-6">Bot Configuration</h2>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Topic/Domain</label>
                        <Input
                          placeholder="e.g., Sales, Marketing, Real Estate"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Target User</label>
                        <Input
                          placeholder="e.g., Small business owners, Sales teams"
                          value={targetUser}
                          onChange={(e) => setTargetUser(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Bot Type</label>
                      <Select value={botType} onValueChange={setBotType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bot type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Coach">Coach</SelectItem>
                          <SelectItem value="Advisor">Advisor</SelectItem>
                          <SelectItem value="Consultant">Consultant</SelectItem>
                          <SelectItem value="Assistant">Assistant</SelectItem>
                          <SelectItem value="Mentor">Mentor</SelectItem>
                          <SelectItem value="Analyzer">Analyzer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Special Requirements (Optional)</label>
                      <Textarea
                        placeholder="Any specific behaviors, constraints, or expertise areas..."
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateBot}
                    disabled={isGenerating || !topic || !targetUser || !botType}
                    className="w-full mt-6"
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Creating Your Custom Bot...
                      </>
                    ) : 'Generate Custom Bot'}
                  </Button>
                </motion.div>

                {customBot && (
                  <motion.div variants={fadeIn} className="space-y-6">
                    {/* Bot Overview */}
                    <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 p-6">
                      <h3 className="text-2xl font-bold mb-4">🤖 {customBot.name}</h3>
                      <p className="text-gray-300">
                        Your specialized AI assistant is ready! Use the system prompt below to create a custom bot that understands {topic.toLowerCase()} and provides expert guidance to {targetUser.toLowerCase()}.
                      </p>
                    </Card>

                    {/* System Prompt */}
                    <Card className="bg-background border border-white/10 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">📝 System Prompt</h3>
                        <Button variant="outline" onClick={copyPrompt}>
                          <i className="fas fa-copy mr-2"></i>
                          Copy Prompt
                        </Button>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded font-mono text-sm text-gray-300 leading-relaxed">
                        {customBot.systemPrompt}
                      </div>
                    </Card>

                    {/* Setup Instructions */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-xl font-bold mb-4">⚙️ Setup Instructions</h3>
                      <div className="space-y-3">
                        {customBot.instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start">
                            <div className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-gray-300">{instruction}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Usage Examples */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-xl font-bold mb-4">💬 Usage Examples</h3>
                      <div className="space-y-3">
                        {customBot.usageExamples.map((example, index) => (
                          <div key={index} className="p-3 bg-gray-800/50 rounded">
                            <span className="text-gray-300 italic">"{example}"</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Best Practices */}
                    <Card className="bg-background border border-white/10 p-6">
                      <h3 className="text-xl font-bold mb-4">🎯 Best Practices</h3>
                      <div className="grid gap-3">
                        {customBot.bestPractices.map((practice, index) => (
                          <div key={index} className="flex items-start">
                            <i className="fas fa-lightbulb text-yellow-400 mt-1 mr-3"></i>
                            <span className="text-gray-300">{practice}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Implementation Guide */}
                    <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 p-6">
                      <h3 className="text-xl font-bold mb-3">🚀 Implementation Guide</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">Platform Options:</h4>
                          <ul className="space-y-1 text-gray-300">
                            <li>• Custom GPTs (ChatGPT Plus)</li>
                            <li>• Claude Projects (Claude Pro)</li>
                            <li>• API integration with your app</li>
                            <li>• Internal chatbot platforms</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Enhancement Tips:</h4>
                          <ul className="space-y-1 text-gray-300">
                            <li>• Add knowledge base documents</li>
                            <li>• Create conversation starters</li>
                            <li>• Set up feedback collection</li>
                            <li>• Monitor usage patterns</li>
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