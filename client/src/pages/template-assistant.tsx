import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { TemplateCustomizationAssistant } from '@/components/template-assistant/TemplateCustomizationAssistant';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Terminal, Code, RocketIcon, ServerIcon, LockIcon } from 'lucide-react';

export default function TemplateAssistantPage() {
  return (
    <>
      <Helmet>
        <title>AI Template Customization Assistant | Advanta AI</title>
        <meta name="description" content="Use our AI-powered Template Customization Assistant to create tailored AI solutions for your business needs with personalized code and implementation guidance." />
        <meta property="og:title" content="AI Template Customization Assistant | Advanta AI" />
        <meta property="og:description" content="Use our AI-powered Template Customization Assistant to create tailored AI solutions for your business needs with personalized code and implementation guidance." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-10"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                AI Template <GradientText>Customization Assistant</GradientText>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Leverage our AI to customize templates for your specific business needs. Get tailored solutions with implementation-ready code in minutes.
              </p>
            </motion.div>
            
            {/* Floating elements in background */}
            <div className="absolute -z-10 top-0 left-0 right-0 bottom-0 overflow-hidden">
              <div className="absolute top-[10%] left-[5%] w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="absolute top-[40%] right-[15%] w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </section>
        
        {/* Main Content Section */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                {/* How It Works */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <RocketIcon className="mr-2 h-5 w-5 text-primary" />
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Select & Customize</h3>
                        <p className="text-sm text-muted-foreground">Choose a template and specify your requirements</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium">AI Generation</h3>
                        <p className="text-sm text-muted-foreground">Our AI customizes the template to your needs</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 shrink-0">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Refine & Implement</h3>
                        <p className="text-sm text-muted-foreground">Chat with our AI to refine the solution and implement</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Template Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Terminal className="mr-2 h-5 w-5 text-primary" />
                      Available Templates
                    </CardTitle>
                    <CardDescription>
                      Our most popular template categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span>Customer Service AI</span>
                        <Badge variant="outline">Popular</Badge>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Predictive Analytics</span>
                        <Badge variant="outline">Advanced</Badge>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Content Generation</span>
                        <Badge variant="outline">Beginner</Badge>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Dynamic Pricing</span>
                        <Badge variant="outline">Advanced</Badge>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Personalization</span>
                        <Badge variant="outline">Intermediate</Badge>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                {/* Supported Languages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="mr-2 h-5 w-5 text-primary" />
                      Supported Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-[#f7df1e] text-black hover:bg-[#f7df1e]/80">JavaScript</Badge>
                      <Badge className="bg-[#3776ab] hover:bg-[#3776ab]/80">Python</Badge>
                      <Badge className="bg-[#007396] hover:bg-[#007396]/80">Java</Badge>
                      <Badge className="bg-[#178600] hover:bg-[#178600]/80">C#</Badge>
                      <Badge className="bg-[#777bb4] hover:bg-[#777bb4]/80">PHP</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Security Note */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-sm font-medium">
                      <LockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      Secure Implementation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      All code is generated securely with best practices for authentication, data handling, and API security.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Assistant */}
              <div className="lg:col-span-8">
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle>Template Customization Assistant</CardTitle>
                    <CardDescription>
                      Use our AI to customize a template for your specific needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TemplateCustomizationAssistant />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}