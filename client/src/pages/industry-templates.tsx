import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import IndustryTemplates from '@/components/home/IndustryTemplates';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

export default function IndustryTemplatesPage() {
  return (
    <>
      <Helmet>
        <title>Industry AI Solutions | Advanta AI</title>
        <meta name="description" content="Explore our industry-specific AI solutions designed to meet the unique challenges and opportunities in your sector. From Real Estate to Healthcare, find the perfect AI tools for your business." />
        <meta property="og:title" content="Industry AI Solutions | Advanta AI" />
        <meta property="og:description" content="Explore our industry-specific AI solutions designed to meet the unique challenges and opportunities in your sector." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Banner */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-background/80">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                AI Solutions Tailored to Your <span className="text-primary">Industry</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                We've built specialized AI templates for different industries, each designed to address 
                unique challenges and opportunities in your specific sector.
              </p>
              <Button size="lg" className="mb-8">
                Schedule a Consultation
              </Button>
            </motion.div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -top-[250px] -left-[100px] opacity-50"></div>
            <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl -bottom-[200px] -right-[100px] opacity-40"></div>
          </div>
        </section>
        
        {/* Industry Templates Section */}
        <IndustryTemplates />
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background/90 to-background">
          <div className="container mx-auto px-4">
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 p-8 md:p-12 rounded-2xl max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Don't See Your Industry?</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  We create custom AI solutions for any business type. Tell us about your specific challenges, 
                  and we'll build a tailored AI solution just for you.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="default">
                  Request Custom Solution
                </Button>
                <Button size="lg" variant="outline">
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}