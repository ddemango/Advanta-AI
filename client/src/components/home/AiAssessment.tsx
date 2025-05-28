import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

// Define questions and answer options
const questions = [
  {
    id: 1,
    text: "What's your primary goal with AI implementation?",
    options: [
      { id: "1a", text: "Automate routine tasks", score: 3 },
      { id: "1b", text: "Improve customer experience", score: 4 },
      { id: "1c", text: "Gain business insights from data", score: 5 },
      { id: "1d", text: "Reduce operational costs", score: 2 }
    ]
  },
  {
    id: 2,
    text: "How would you describe your organization's data infrastructure?",
    options: [
      { id: "2a", text: "Well-organized with centralized databases", score: 5 },
      { id: "2b", text: "Some digital systems but data is fragmented", score: 3 },
      { id: "2c", text: "Mostly manual with limited digital records", score: 1 },
      { id: "2d", text: "Mix of digital and paper-based systems", score: 2 }
    ]
  },
  {
    id: 3,
    text: "What's your team's experience with technology adoption?",
    options: [
      { id: "3a", text: "Early adopters, embrace new tech quickly", score: 5 },
      { id: "3b", text: "Cautious but open to proven solutions", score: 3 },
      { id: "3c", text: "Resistant to change, prefer established methods", score: 1 },
      { id: "3d", text: "Mixed - some departments are progressive", score: 2 }
    ]
  },
  {
    id: 4,
    text: "What's your timeline for implementing AI solutions?",
    options: [
      { id: "4a", text: "Immediately (0-3 months)", score: 5 },
      { id: "4b", text: "Near future (3-6 months)", score: 4 },
      { id: "4c", text: "Medium term (6-12 months)", score: 3 },
      { id: "4d", text: "Long term planning (1+ years)", score: 1 }
    ]
  },
  {
    id: 5,
    text: "What's your budget allocation for digital transformation?",
    options: [
      { id: "5a", text: "Significant investment planned", score: 5 },
      { id: "5b", text: "Moderate budget available", score: 3 },
      { id: "5c", text: "Limited budget, seeking high ROI solutions", score: 2 },
      { id: "5d", text: "Exploring options before budget allocation", score: 1 }
    ]
  }
];

// Define assessment steps
type AssessmentStep = 'intro' | 'questions' | 'results';

export default function AiAssessment() {
  // State for the assessment
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { id: string, score: number }>>({});
  const [finalScore, setFinalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Start the assessment
  const handleStartAssessment = () => {
    setCurrentStep('questions');
  };
  
  // Handle selection of an option
  const handleOptionSelect = (questionId: number, optionId: string, score: number) => {
    // Save the answer
    const newAnswers = { 
      ...answers, 
      [questionId]: { id: optionId, score } 
    };
    setAnswers(newAnswers);
    
    // If this is the last question, calculate results
    if (currentQuestionIndex === questions.length - 1) {
      setIsLoading(true);
      
      // Simulate processing time
      setTimeout(() => {
        // Calculate final score
        let totalScore = 0;
        let count = 0;
        
        Object.values(newAnswers).forEach(answer => {
          totalScore += answer.score;
          count++;
        });
        
        const avgScore = totalScore / count;
        setFinalScore(avgScore);
        setCurrentStep('results');
        setIsLoading(false);
      }, 1500);
    } else {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Restart the assessment
  const restartAssessment = () => {
    setCurrentStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFinalScore(0);
  };
  
  // Calculate readiness level based on score
  const getReadinessLevel = () => {
    if (finalScore >= 4) return { level: "Advanced", description: "Your organization is well-positioned for advanced AI solutions." };
    if (finalScore >= 3) return { level: "Prepared", description: "Your business has a solid foundation for AI adoption with a few key improvements needed." };
    if (finalScore >= 2) return { level: "Developing", description: "With targeted preparation in key areas, you can successfully implement AI solutions." };
    return { level: "Emerging", description: "Your business would benefit from foundational preparations before complex AI implementation." };
  };
  
  const readinessInfo = getReadinessLevel();
  const progress = ((currentQuestionIndex) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <section id="ai-assessment" className="py-20 bg-background neural-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction State */}
        {currentStep === 'intro' && (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="flex flex-col lg:flex-row items-center bg-muted rounded-2xl overflow-hidden border border-border"
          >
            <motion.div 
              variants={fadeInUp}
              className="lg:w-1/2 p-8 lg:p-12"
            >
              <h2 className="text-3xl font-bold mb-4">Is Your Business AI-Ready?</h2>
              <p className="text-muted-foreground mb-6">
                Our AI Readiness Assessment tool analyzes your current operations and identifies the highest-value AI opportunities specific to your business.
              </p>
              
              <div className="bg-background rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Answer 5 Questions to Get:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                    <span className="text-gray-300">Custom AI opportunity roadmap</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                    <span className="text-gray-300">Implementation timeline & cost estimates</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                    <span className="text-gray-300">Projected ROI analysis for your industry</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                    <span className="text-gray-300">Technology stack recommendations</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleStartAssessment}
              >
                Start Free Assessment
              </Button>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="lg:w-1/2 p-8 lg:p-0"
            >
              {/* A digital transformation visualization */}
              <img 
                src="/attached_assets/image_1748399978739.png" 
                alt="Professional AI workspace with holographic AI interface and data visualizations" 
                className="rounded-xl lg:rounded-l-none w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          </motion.div>
        )}
        
        {/* Questions State */}
        {currentStep === 'questions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-sm font-medium">{Math.floor(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <Card className="border-border/40 bg-background/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{currentQuestion.text}</CardTitle>
                <CardDescription>Select the option that best describes your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup>
                  <div className="grid gap-4">
                    {currentQuestion.options.map((option) => (
                      <div 
                        key={option.id} 
                        className="flex items-center space-x-2 rounded-lg border border-muted p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleOptionSelect(currentQuestion.id, option.id, option.score)}
                      >
                        <RadioGroupItem value={option.id} id={option.id} className="hidden" />
                        <Label htmlFor={option.id} className="flex flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Loading State */}
        {currentStep === 'questions' && isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto flex flex-col items-center justify-center py-12"
          >
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold mb-2">Analyzing Your Responses</h3>
            <p className="text-muted-foreground text-center">
              Our AI is crunching the numbers and preparing your personalized assessment...
            </p>
          </motion.div>
        )}
        
        {/* Results State */}
        {currentStep === 'results' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-4xl mx-auto text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Your AI Readiness Assessment</h2>
              <p className="text-muted-foreground">Based on your responses, here's your organization's AI readiness level</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
              {/* Readiness Score */}
              <Card className="md:col-span-5 bg-background/30 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle>Readiness Score</CardTitle>
                  <CardDescription>Your overall AI implementation readiness</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        className="text-muted opacity-20" 
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="8" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (283 * (finalScore / 5))}
                        className="text-primary" 
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-5xl font-bold">{finalScore.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">out of 5.0</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-1">{readinessInfo.level}</h3>
                    <p className="text-muted-foreground">{readinessInfo.description}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recommendations */}
              <Card className="md:col-span-7 bg-background/30 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                  <CardDescription>Tailored recommendations for your AI journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <i className="fas fa-arrow-right text-xs text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium">Download your detailed assessment report</p>
                        <p className="text-sm text-muted-foreground">Receive a comprehensive breakdown of your AI readiness with actionable insights</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <i className="fas fa-arrow-right text-xs text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium">Schedule a free consultation with an AI specialist</p>
                        <p className="text-sm text-muted-foreground">Get personalized guidance on your AI transformation strategy</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <i className="fas fa-arrow-right text-xs text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium">Explore our industry-specific AI solutions</p>
                        <p className="text-sm text-muted-foreground">See tailored AI applications that match your readiness level and goals</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Button variant="outline" size="sm" onClick={restartAssessment}>
                    Retake Assessment
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Download Report
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Implementation Timeline */}
              <Card className="md:col-span-6 bg-background/30 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle>Implementation Timeline</CardTitle>
                  <CardDescription>Estimated timeframe based on your readiness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Planning & Strategy</span>
                      <span className="font-medium">{finalScore >= 4 ? "2-3 weeks" : finalScore >= 3 ? "3-4 weeks" : "4-6 weeks"}</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Implementation</span>
                      <span className="font-medium">{finalScore >= 4 ? "4-6 weeks" : finalScore >= 3 ? "6-8 weeks" : "8-12 weeks"}</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Testing & Optimization</span>
                      <span className="font-medium">{finalScore >= 4 ? "2 weeks" : finalScore >= 3 ? "3 weeks" : "4 weeks"}</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Training & Deployment</span>
                      <span className="font-medium">{finalScore >= 4 ? "1-2 weeks" : finalScore >= 3 ? "2-3 weeks" : "3-4 weeks"}</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              {/* ROI Analysis */}
              <Card className="md:col-span-6 bg-background/30 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle>ROI Projection</CardTitle>
                  <CardDescription>Expected return on investment</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pt-4">
                  <div className="text-5xl font-bold mb-2 text-primary">
                    {finalScore >= 4 ? "210" : finalScore >= 3 ? "175" : finalScore >= 2 ? "140" : "115"}
                    <span className="text-3xl">%</span>
                  </div>
                  <p className="text-center text-muted-foreground mb-4">
                    Estimated 12-month return on investment
                  </p>
                  <div className="w-full max-w-sm bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-sm">
                      Based on similar implementations for organizations
                      at your readiness level in your industry
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
