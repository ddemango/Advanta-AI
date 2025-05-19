import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { GlassCard } from '@/components/ui/glass-card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@/lib/animations';

// This component creates an interactive demo sandbox for AI products

export default function AiProductSandbox() {
  const [activeDemo, setActiveDemo] = useState<string>('chatbot');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  
  // Chatbot demo state
  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string}>>([
    {role: 'ai', content: 'Hello! I\'m your AI assistant. How can I help you today?'}
  ]);
  const [chatPersonality, setChatPersonality] = useState<string>('helpful');
  
  // Image generation demo state
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState<string>('photorealistic');
  const [imageSize, setImageSize] = useState<[number]>([512]);
  
  // Text analysis demo state
  const [analysisText, setAnalysisText] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<string>('sentiment');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  // Mock AI responses for demo purposes
  const mockAiChatResponses: Record<string, string[]> = {
    'helpful': [
      "I'd be happy to help you with that! Here's what you need to know...",
      "Great question! The answer is...",
      "Based on the latest information, the recommended approach would be...",
      "I understand what you're looking for. Let me provide some insights..."
    ],
    'technical': [
      "According to technical specifications, the optimal implementation requires...",
      "The underlying architecture supports multiple approaches, but I recommend...",
      "From a technical perspective, you should consider the following variables...",
      "Let me break down the technical aspects for you in detail..."
    ],
    'creative': [
      "What an interesting idea! We could expand on that by...",
      "I love your creative thinking! Here's how we might approach this uniquely...",
      "That sparks several innovative possibilities! Let's explore...",
      "Thinking outside the box, we could combine these approaches to create..."
    ]
  };
  
  // Handle chat submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newUserMessage = { role: 'user' as const, content: chatInput };
    setChatHistory([...chatHistory, newUserMessage]);
    setChatInput('');
    setLoading(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const responses = mockAiChatResponses[chatPersonality];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setChatHistory(prev => [
        ...prev, 
        { role: 'ai', content: randomResponse }
      ]);
      setLoading(false);
    }, 1500);
  };
  
  // Handle image generation
  const handleImageGeneration = () => {
    if (!imagePrompt.trim()) return;
    
    setLoading(true);
    setGeneratedImageUrl(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      // In a real implementation, this would call an API like DALL-E
      setGeneratedImageUrl('https://via.placeholder.com/512x512/0072f5/ffffff?text=AI+Generated+Image');
      setLoading(false);
    }, 2000);
  };
  
  // Handle text analysis
  const handleTextAnalysis = () => {
    if (!analysisText.trim()) return;
    
    setLoading(true);
    setAnalysisResult(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Mock analysis results based on analysis type
      if (analysisType === 'sentiment') {
        setAnalysisResult({
          positive: 0.72,
          neutral: 0.18,
          negative: 0.10,
          summary: 'The text has a predominantly positive sentiment.'
        });
      } else if (analysisType === 'entities') {
        setAnalysisResult({
          entities: [
            { type: 'PERSON', text: 'John Smith', confidence: 0.92 },
            { type: 'ORG', text: 'Acme Corporation', confidence: 0.87 },
            { type: 'LOCATION', text: 'New York', confidence: 0.95 }
          ],
          summary: '3 entities detected with high confidence.'
        });
      } else {
        setAnalysisResult({
          keywords: [
            { text: 'artificial intelligence', relevance: 0.95 },
            { text: 'machine learning', relevance: 0.88 },
            { text: 'neural networks', relevance: 0.82 },
            { text: 'deep learning', relevance: 0.79 }
          ],
          summary: 'The text focuses on AI and related technologies.'
        });
      }
      setLoading(false);
    }, 1500);
  };
  
  return (
    <section className="py-20 relative overflow-hidden" id="ai-sandbox">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive AI Demo Sandbox</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of our AI products firsthand. Test different features and see the results in real-time.
          </p>
        </motion.div>
        
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <GlassCard>
            <Tabs defaultValue="chatbot" onValueChange={setActiveDemo} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="chatbot">AI Chatbot</TabsTrigger>
                <TabsTrigger value="image-gen">Image Generation</TabsTrigger>
                <TabsTrigger value="text-analysis">Text Analysis</TabsTrigger>
              </TabsList>
              
              {/* AI Chatbot Demo */}
              <TabsContent value="chatbot" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-2/3">
                    <div className="bg-background rounded-lg border border-border p-4 h-[400px] overflow-y-auto flex flex-col">
                      <div className="flex-1 space-y-4">
                        {chatHistory.map((message, index) => (
                          <div 
                            key={index} 
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.role === 'user' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted text-foreground'
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                        {loading && (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted text-foreground">
                              <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2">
                      <Input 
                        placeholder="Type your message here..." 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="submit" 
                        disabled={loading || !chatInput.trim()}
                      >
                        Send
                      </Button>
                    </form>
                  </div>
                  
                  <div className="md:w-1/3 space-y-4">
                    <div>
                      <Label>AI Personality</Label>
                      <Select value={chatPersonality} onValueChange={setChatPersonality}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select personality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="helpful">Helpful</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">About this demo</h4>
                      <p className="text-sm text-muted-foreground">
                        This interactive chatbot demonstrates our conversational AI capabilities.
                        Try asking questions about products, services, or technical information.
                        The AI adapts its responses based on the selected personality.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Image Generation Demo */}
              <TabsContent value="image-gen" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2 space-y-4">
                    <div>
                      <Label>Image Description</Label>
                      <Textarea 
                        placeholder="Describe the image you want to generate..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="h-32"
                      />
                    </div>
                    
                    <div>
                      <Label>Style</Label>
                      <Select value={imageStyle} onValueChange={setImageStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photorealistic">Photorealistic</SelectItem>
                          <SelectItem value="abstract">Abstract</SelectItem>
                          <SelectItem value="cartoon">Cartoon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <Label>Image Size</Label>
                        <span className="text-muted-foreground text-sm">{imageSize[0]}px</span>
                      </div>
                      <Slider 
                        value={imageSize} 
                        min={256} 
                        max={1024} 
                        step={256} 
                        onValueChange={setImageSize}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleImageGeneration} 
                      disabled={loading || !imagePrompt.trim()} 
                      className="w-full"
                    >
                      {loading ? 'Generating...' : 'Generate Image'}
                    </Button>
                  </div>
                  
                  <div className="md:w-1/2">
                    <div className="bg-muted aspect-square rounded-lg overflow-hidden flex items-center justify-center border border-border">
                      {generatedImageUrl ? (
                        <img 
                          src={generatedImageUrl} 
                          alt="AI Generated" 
                          className="w-full h-full object-cover"
                        />
                      ) : loading ? (
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                          <p className="mt-4 text-muted-foreground">Generating your image...</p>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <div className="text-5xl text-muted-foreground mb-4">
                            <i className="fas fa-image"></i>
                          </div>
                          <p className="text-muted-foreground">Your generated image will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Text Analysis Demo */}
              <TabsContent value="text-analysis" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2 space-y-4">
                    <div>
                      <Label>Text to Analyze</Label>
                      <Textarea 
                        placeholder="Enter text for analysis..."
                        value={analysisText}
                        onChange={(e) => setAnalysisText(e.target.value)}
                        className="h-32"
                      />
                    </div>
                    
                    <div>
                      <Label>Analysis Type</Label>
                      <Select value={analysisType} onValueChange={setAnalysisType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select analysis type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                          <SelectItem value="entities">Entity Recognition</SelectItem>
                          <SelectItem value="keywords">Keyword Extraction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleTextAnalysis} 
                      disabled={loading || !analysisText.trim()} 
                      className="w-full"
                    >
                      {loading ? 'Analyzing...' : 'Analyze Text'}
                    </Button>
                  </div>
                  
                  <div className="md:w-1/2">
                    <div className="bg-background rounded-lg border border-border h-full p-4">
                      <h3 className="font-medium mb-4">Analysis Results</h3>
                      
                      {loading ? (
                        <div className="h-64 flex items-center justify-center">
                          <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                            <p className="mt-2 text-muted-foreground">Processing analysis...</p>
                          </div>
                        </div>
                      ) : analysisResult ? (
                        <div className="space-y-4">
                          {analysisType === 'sentiment' && (
                            <>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>Positive</span>
                                  <span>{Math.round(analysisResult.positive * 100)}%</span>
                                </div>
                                <div className="w-full bg-muted h-2 rounded-full">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${analysisResult.positive * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>Neutral</span>
                                  <span>{Math.round(analysisResult.neutral * 100)}%</span>
                                </div>
                                <div className="w-full bg-muted h-2 rounded-full">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    style={{ width: `${analysisResult.neutral * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>Negative</span>
                                  <span>{Math.round(analysisResult.negative * 100)}%</span>
                                </div>
                                <div className="w-full bg-muted h-2 rounded-full">
                                  <div 
                                    className="bg-red-500 h-2 rounded-full" 
                                    style={{ width: `${analysisResult.negative * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </>
                          )}
                          
                          {analysisType === 'entities' && (
                            <div className="space-y-2">
                              {analysisResult.entities.map((entity: any, index: number) => (
                                <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                                  <div className="font-medium mr-2">{entity.type}:</div>
                                  <div className="flex-1">{entity.text}</div>
                                  <div className="text-sm text-muted-foreground">{Math.round(entity.confidence * 100)}%</div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {analysisType === 'keywords' && (
                            <div className="space-y-2">
                              {analysisResult.keywords.map((keyword: any, index: number) => (
                                <div key={index} className="flex justify-between p-2 bg-muted rounded-md">
                                  <div>{keyword.text}</div>
                                  <div className="text-sm text-muted-foreground">Relevance: {Math.round(keyword.relevance * 100)}%</div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="pt-4 border-t border-border">
                            <h4 className="font-medium mb-2">Summary</h4>
                            <p className="text-muted-foreground">{analysisResult.summary}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center text-center">
                          <div>
                            <div className="text-5xl text-muted-foreground mb-4">
                              <i className="fas fa-chart-bar"></i>
                            </div>
                            <p className="text-muted-foreground">Enter text and click "Analyze Text" to see results</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </GlassCard>
        </motion.div>
        
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Want to integrate these AI capabilities into your own applications?
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <a href="/calculator">Build My AI Stack</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}