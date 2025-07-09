import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { ChevronRight, Star, ArrowRight, Target, Brain, Sparkles } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: { value: string; label: string; icon?: string }[];
}

interface QuizResult {
  title: string;
  description: string;
  tools: {
    name: string;
    description: string;
    price: string;
    rating: number;
    category: string;
    link: string;
    isAdvantaAI?: boolean;
  }[];
  nextSteps: string[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your primary role?",
    options: [
      { value: 'marketer', label: 'Marketing Professional', icon: '📈' },
      { value: 'founder', label: 'Founder/Entrepreneur', icon: '🚀' },
      { value: 'designer', label: 'Designer/Creative', icon: '🎨' },
      { value: 'developer', label: 'Developer/Tech', icon: '💻' },
      { value: 'manager', label: 'Business Manager', icon: '👔' },
      { value: 'consultant', label: 'Consultant/Freelancer', icon: '💼' }
    ]
  },
  {
    id: 2,
    question: "What's your main goal with AI?",
    options: [
      { value: 'automation', label: 'Automate repetitive tasks', icon: '⚡' },
      { value: 'content', label: 'Create content faster', icon: '✍️' },
      { value: 'analysis', label: 'Analyze data & insights', icon: '📊' },
      { value: 'customer', label: 'Improve customer experience', icon: '🤝' },
      { value: 'productivity', label: 'Boost team productivity', icon: '📈' },
      { value: 'innovation', label: 'Drive innovation', icon: '💡' }
    ]
  },
  {
    id: 3,
    question: "What's your monthly AI budget?",
    options: [
      { value: 'free', label: 'Free tools only', icon: '💸' },
      { value: 'low', label: '$0 - $100/month', icon: '💰' },
      { value: 'medium', label: '$100 - $500/month', icon: '💳' },
      { value: 'high', label: '$500 - $2000/month', icon: '💎' },
      { value: 'enterprise', label: '$2000+/month', icon: '🏢' },
      { value: 'unlimited', label: 'Budget not a concern', icon: '🚀' }
    ]
  },
  {
    id: 4,
    question: "What's your experience level with AI?",
    options: [
      { value: 'beginner', label: 'Complete beginner', icon: '🌱' },
      { value: 'basic', label: 'Basic user', icon: '📚' },
      { value: 'intermediate', label: 'Regular user', icon: '⚡' },
      { value: 'advanced', label: 'Power user', icon: '🚀' },
      { value: 'expert', label: 'AI expert', icon: '🧠' }
    ]
  },
  {
    id: 5,
    question: "Which area needs the most improvement?",
    options: [
      { value: 'writing', label: 'Writing & Content Creation', icon: '✏️' },
      { value: 'design', label: 'Design & Visuals', icon: '🎨' },
      { value: 'data', label: 'Data Analysis', icon: '📊' },
      { value: 'sales', label: 'Sales & Marketing', icon: '💼' },
      { value: 'support', label: 'Customer Support', icon: '🎧' },
      { value: 'operations', label: 'Business Operations', icon: '⚙️' }
    ]
  }
];

export default function AIToolQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion + 1]: value });
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateResults();
    }
  };

  const generateResults = () => {
    const role = answers[1];
    const goal = answers[2];
    const budget = answers[3];
    const experience = answers[4];
    const focus = answers[5];

    // Logic for recommending tools based on answers
    let recommendedTools = [];

    // Budget-based filtering
    if (budget === 'free') {
      recommendedTools = [
        {
          name: 'ChatGPT Free',
          description: 'Best free AI assistant for general tasks',
          price: 'Free',
          rating: 4.2,
          category: 'General AI',
          link: 'https://chat.openai.com'
        },
        {
          name: 'Claude.ai',
          description: 'Free AI with great writing capabilities',
          price: 'Free',
          rating: 4.3,
          category: 'Writing',
          link: 'https://claude.ai'
        }
      ];
    } else if (budget === 'enterprise') {
      recommendedTools = [
        {
          name: 'Advanta AI Enterprise Suite',
          description: 'Complete AI transformation platform for Fortune 500 companies',
          price: 'Custom pricing',
          rating: 4.9,
          category: 'Enterprise AI',
          link: '/marketplace',
          isAdvantaAI: true
        },
        {
          name: 'Custom AI Development',
          description: 'Tailored AI solutions built specifically for your business',
          price: 'Starting at $25k',
          rating: 4.9,
          category: 'Custom AI',
          link: '/contact',
          isAdvantaAI: true
        }
      ];
    } else {
      // Medium budget recommendations
      recommendedTools = [
        {
          name: 'Advanta AI Templates',
          description: 'Professional AI solutions ready for deployment',
          price: '$4,999 - $29,999',
          rating: 4.8,
          category: 'Business AI',
          link: '/marketplace',
          isAdvantaAI: true
        },
        {
          name: 'ChatGPT Plus',
          description: 'Advanced AI assistant with latest features',
          price: '$20/month',
          rating: 4.5,
          category: 'General AI',
          link: 'https://openai.com/chatgpt'
        },
        {
          name: 'Claude Pro',
          description: 'Premium AI for complex reasoning tasks',
          price: '$20/month',
          rating: 4.4,
          category: 'Analysis',
          link: 'https://claude.ai'
        }
      ];
    }

    // Role and goal-based customization
    if (role === 'marketer' || goal === 'content') {
      recommendedTools.unshift({
        name: 'AI Content Marketing Suite',
        description: 'Complete content creation and marketing automation',
        price: '$4,999',
        rating: 4.6,
        category: 'Marketing',
        link: '/template-demo?template=content-marketing-ai',
        isAdvantaAI: true
      });
    }

    if (goal === 'customer' || focus === 'support') {
      recommendedTools.unshift({
        name: 'Enterprise Customer AI',
        description: 'Automate 85% of customer inquiries with AI',
        price: '$12,999',
        rating: 4.9,
        category: 'Customer Service',
        link: '/template-demo?template=enterprise-customer-ai',
        isAdvantaAI: true
      });
    }

    const result: QuizResult = {
      title: getResultTitle(role, goal, budget),
      description: getResultDescription(role, goal, budget),
      tools: recommendedTools.slice(0, 4),
      nextSteps: getNextSteps(role, budget)
    };

    setResults(result);
    setShowResults(true);
  };

  const getResultTitle = (role: string, goal: string, budget: string): string => {
    if (budget === 'enterprise') {
      return "Enterprise AI Transformation Recommended";
    }
    if (role === 'founder') {
      return "Startup-Ready AI Stack";
    }
    if (role === 'marketer') {
      return "Marketing AI Powerhouse";
    }
    return "Your Personalized AI Toolkit";
  };

  const getResultDescription = (role: string, goal: string, budget: string): string => {
    return `Based on your role as a ${role}, focus on ${goal}, and budget preferences, here are the AI tools that will deliver the biggest impact for your specific needs.`;
  };

  const getNextSteps = (role: string, budget: string): string[] => {
    if (budget === 'enterprise') {
      return [
        "Schedule a strategy call with our AI experts",
        "Get a custom AI implementation roadmap",
        "Start with a pilot project in your highest-impact area"
      ];
    }
    return [
      "Start with the highest-rated tool for your budget",
      "Test the free trials before committing",
      "Join our AI newsletter for implementation tips"
    ];
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults && results) {
    return (
      <>
        <Helmet>
          <title>Your AI Tool Recommendations | Advanta AI</title>
          <meta name="description" content="Get personalized AI tool recommendations based on your role, goals, and budget. Find the perfect AI solutions for your business." />
        </Helmet>
        
        <NewHeader />
        
        <main className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-primary mr-3" />
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {results.title}
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                  {results.description}
                </p>
              </motion.div>

              {/* Recommended Tools */}
              <motion.div variants={fadeInUp} className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Recommended AI Tools</h2>
                <div className="grid gap-6">
                  {results.tools.map((tool, index) => (
                    <Card key={index} className={`p-6 ${tool.isAdvantaAI ? 'border-primary bg-primary/5' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{tool.name}</h3>
                            {tool.isAdvantaAI && (
                              <Badge className="bg-primary">Recommended</Badge>
                            )}
                            <Badge variant="outline">{tool.category}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{tool.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < Math.floor(tool.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                                />
                              ))}
                              <span className="ml-2 text-sm">{tool.rating}</span>
                            </div>
                            <span className="font-semibold text-primary">{tool.price}</span>
                          </div>
                        </div>
                        <Button asChild className="ml-4">
                          <a href={tool.link} target={tool.isAdvantaAI ? '_self' : '_blank'}>
                            {tool.isAdvantaAI ? 'View Demo' : 'Learn More'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-500/10">
                  <h3 className="text-xl font-bold mb-4">Your Next Steps</h3>
                  <ul className="space-y-3 mb-6">
                    {results.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        {step}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" onClick={() => window.location.href = '/contact'}>
                      <Target className="w-4 h-4 mr-2" />
                      Get Custom AI Strategy
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => {
                      setShowResults(false);
                      setCurrentQuestion(0);
                      setAnswers({});
                    }}>
                      Retake Quiz
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Tool Recommendation Quiz | Find Your Perfect AI Stack</title>
        <meta name="description" content="Take our 2-minute quiz to discover the best AI tools for your role, goals, and budget. Get personalized recommendations from AI experts." />
      </Helmet>
      
      <NewHeader />
      
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-3xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  AI Tool Recommendation Quiz
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                Answer 5 quick questions to discover the perfect AI tools for your specific needs and budget
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge className="bg-green-500">2 Minutes</Badge>
                <Badge variant="outline">Personalized Results</Badge>
                <Badge variant="outline">Expert Recommendations</Badge>
              </div>
            </motion.div>

            {/* Progress */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>

            {/* Question */}
            <motion.div variants={fadeInUp}>
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-8 text-center">
                  {quizQuestions[currentQuestion].question}
                </h2>
                
                <div className="grid gap-4">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="p-6 h-auto text-left justify-start hover:border-primary hover:bg-primary/5"
                      onClick={() => handleAnswer(option.value)}
                    >
                      <div className="flex items-center w-full">
                        <span className="text-2xl mr-4">{option.icon}</span>
                        <span className="flex-1">{option.label}</span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}