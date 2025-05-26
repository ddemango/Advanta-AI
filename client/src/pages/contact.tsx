import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { GradientText } from '@/components/ui/gradient-text';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { sendContactForm } from '@/lib/contact-service';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Helmet } from 'react-helmet';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  company: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  industry: z.string().min(1, {
    message: 'Please select an industry.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to our privacy policy.',
  }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      industry: '',
      message: '',
      consent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await sendContactForm(values);
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Message sent successfully",
        description: "Thank you for reaching out. Our team will contact you shortly.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again or reach out to us directly via phone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const officeLocations = [
    {
      city: "San Francisco",
      address: "535 Mission St, 14th Floor",
      zipCode: "CA 94105",
      phone: "+1 (415) 555-2671",
      email: "sf@advanta-ai.com",
      hours: "Mon-Fri: 9am-6pm PT"
    },
    {
      city: "New York",
      address: "175 Varick St, 8th Floor",
      zipCode: "NY 10014",
      phone: "+1 (212) 555-8943",
      email: "nyc@advanta-ai.com",
      hours: "Mon-Fri: 9am-6pm ET"
    },
    {
      city: "London",
      address: "201 Borough High St",
      zipCode: "SE1 1JA",
      phone: "+44 20 7946 0521",
      email: "london@advanta-ai.com",
      hours: "Mon-Fri: 9am-6pm GMT"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | Advanta AI</title>
        <meta name="description" content="Get in touch with our AI experts. Whether you have a question about our services, pricing, or want to schedule a demo - we're here to help." />
        <meta name="keywords" content="contact, AI consultation, enterprise AI, AI services support, business AI solutions" />
        <meta property="og:title" content="Contact Us | Advanta AI" />
        <meta property="og:description" content="Get in touch with our AI experts. Whether you have a question about our services, pricing, or want to schedule a demo - we're here to help." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main>
        {/* AI Agents Business Benefits Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px] opacity-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Why <GradientText>AI Agents</GradientText> Are Transforming Business
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
                  Our intelligent AI agents deliver tangible business outcomes across every department
                </motion.p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div variants={fadeInUp} className="bg-gradient-to-br from-gray-900 to-black/90 border border-white/10 rounded-xl p-6 shadow-xl">
                  <div className="bg-primary/20 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                    <i className="fas fa-chart-line text-primary text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Revenue Acceleration</h3>
                  <p className="text-gray-300 mb-4">AI agents increase sales conversion rates by 28% through personalized customer interactions and predictive analytics.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">24/7 lead qualification and nurturing</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">67% faster sales cycle completion</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">42% increase in upsell opportunities</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="bg-gradient-to-br from-gray-900 to-black/90 border border-white/10 rounded-xl p-6 shadow-xl">
                  <div className="bg-blue-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                    <i className="fas fa-coins text-blue-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Cost Reduction</h3>
                  <p className="text-gray-300 mb-4">Our enterprise clients achieve an average 35% reduction in operational costs through AI-powered process automation.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">78% reduction in manual data processing</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">$1.4M average annual labor savings</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">62% decrease in error-related costs</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="bg-gradient-to-br from-gray-900 to-black/90 border border-white/10 rounded-xl p-6 shadow-xl">
                  <div className="bg-purple-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                    <i className="fas fa-bolt text-purple-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Competitive Advantage</h3>
                  <p className="text-gray-300 mb-4">Enterprises deploying our AI agents report gaining significant market advantages within just 90 days of implementation.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">85% faster market intelligence analysis</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">3.2x increase in innovation pipeline</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">41% improvement in business agility</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              
              <motion.div variants={fadeInUp} className="mt-12 text-center">
                <div className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-px rounded-xl mb-8">
                  <div className="bg-black/80 rounded-xl px-6 py-4">
                    <p className="text-lg font-medium">
                      "Our custom-built AI agents delivered a 312% ROI within the first year, fundamentally transforming how we operate."
                    </p>
                    <div className="mt-2 text-sm text-gray-400">— CTO, Fortune 500 Financial Services Company</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <motion.div 
                variants={fadeIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="bg-background border border-white/10 rounded-lg p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  
                  {isSuccess ? (
                    <div className="text-center p-8">
                      <div className="text-primary text-5xl mb-4">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
                      <p className="text-gray-400 mb-6">
                        Thank you for reaching out. One of our AI specialists will be in touch with you shortly.
                      </p>
                      <Button onClick={() => setIsSuccess(false)}>
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Smith" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@company.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Acme Corp" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="industry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Industry</FormLabel>
                                <FormControl>
                                  <select className="w-full p-2 border border-input bg-background rounded-md" {...field}>
                                    <option value="">Select your industry</option>
                                    <option value="technology">Technology</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="finance">Finance</option>
                                    <option value="retail">Retail</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="education">Education</option>
                                    <option value="real-estate">Real Estate</option>
                                    <option value="consulting">Consulting</option>
                                    <option value="other">Other</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about your AI needs or questions..." 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="consent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the <a href="#" className="text-primary">privacy policy</a> and consent to being contacted regarding my inquiry.
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              </motion.div>
              
              {/* Contact Information */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="lg:col-span-1"
              >
                <motion.div variants={fadeIn} className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                    <p className="text-gray-400 mb-6">
                      Have questions about our AI solutions? Our team of experts is ready to help you transform your business.
                    </p>
                    
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full mr-4">
                        <i className="fas fa-phone text-primary"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Call Us</h3>
                        <p className="text-gray-400">Main: +1 (800) 555-7890</p>
                        <p className="text-gray-400">Sales: +1 (800) 555-7891</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full mr-4">
                        <i className="fas fa-envelope text-primary"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Email Us</h3>
                        <p className="text-gray-400">General: info@advanta-ai.com</p>
                        <p className="text-gray-400">Support: support@advanta-ai.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full mr-4">
                        <i className="fas fa-calendar text-primary"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Schedule a Demo</h3>
                        <p className="text-gray-400">Book a personalized demo with our AI specialists</p>
                        <Button variant="link" className="p-0 h-auto text-primary mt-1">
                          Schedule Now <i className="fas fa-arrow-right ml-1"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Office Locations</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {officeLocations.map((office, index) => (
                        <Card key={index} className="bg-background border border-white/10 p-4">
                          <h3 className="text-lg font-bold">{office.city}</h3>
                          <p className="text-gray-400">{office.address}</p>
                          <p className="text-gray-400 mb-2">{office.zipCode}</p>
                          <p className="text-gray-400 flex items-center">
                            <i className="fas fa-phone text-primary mr-2 text-xs"></i> {office.phone}
                          </p>
                          <p className="text-gray-400 flex items-center">
                            <i className="fas fa-envelope text-primary mr-2 text-xs"></i> {office.email}
                          </p>
                          <p className="text-gray-400 flex items-center mt-1">
                            <i className="fas fa-clock text-primary mr-2 text-xs"></i> {office.hours}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
                    <div className="flex space-x-3">
                      <a href="#" className="bg-background border border-white/10 p-3 rounded-full hover:bg-primary/10 transition-colors">
                        <i className="fab fa-linkedin-in text-primary"></i>
                      </a>
                      <a href="#" className="bg-background border border-white/10 p-3 rounded-full hover:bg-primary/10 transition-colors">
                        <i className="fab fa-twitter text-primary"></i>
                      </a>
                      <a href="#" className="bg-background border border-white/10 p-3 rounded-full hover:bg-primary/10 transition-colors">
                        <i className="fab fa-facebook-f text-primary"></i>
                      </a>
                      <a href="#" className="bg-background border border-white/10 p-3 rounded-full hover:bg-primary/10 transition-colors">
                        <i className="fab fa-instagram text-primary"></i>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              

            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-black/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-4">
                Frequently Asked <GradientText>Questions</GradientText>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 max-w-3xl mx-auto">
                Find answers to common questions about our AI services.
              </motion.p>
            </motion.div>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    question: "How quickly can you implement an AI solution?",
                    answer: "Most of our AI solutions can be implemented within 14-30 days, depending on complexity and integration requirements. Our expedited implementation option can deliver basic solutions in as little as 7 days."
                  },
                  {
                    question: "What industries do you specialize in?",
                    answer: "We have deep expertise in Finance, Healthcare, Retail, Manufacturing, Technology, Real Estate, and Education. However, our AI frameworks are adaptable to virtually any industry."
                  },
                  {
                    question: "Do you offer custom training for AI models?",
                    answer: "Yes, we specialize in training AI models on your proprietary data to ensure maximum relevance and effectiveness for your specific business context."
                  },
                  {
                    question: "How secure is my business data with your AI solutions?",
                    answer: "We maintain SOC 2 Type II certification, GDPR and CCPA compliance, and implement end-to-end encryption for all data. Your data security is our top priority."
                  },
                  {
                    question: "What ongoing support do you provide?",
                    answer: "All our AI solutions include comprehensive support packages with multiple tiers available - from standard business hours support to 24/7 dedicated support with guaranteed response times."
                  },
                  {
                    question: "Can I integrate your AI solutions with my existing systems?",
                    answer: "Absolutely. Our solutions feature robust API capabilities and pre-built integrations with most enterprise systems including Salesforce, HubSpot, SAP, Oracle, Microsoft Dynamics, and many more."
                  }
                ].map((faq, index) => (
                  <motion.div 
                    key={index}
                    variants={fadeIn} 
                    className="bg-background border border-white/10 rounded-lg p-6"
                  >
                    <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div variants={fadeInUp} className="text-center mt-10">
                <p className="text-gray-300 mb-4">
                  Don't see your question here? Reach out to us directly.
                </p>
                <Button variant="outline" asChild>
                  <a href="mailto:info@advanta-ai.com">
                    <i className="fas fa-envelope mr-2"></i>
                    Email Our Support Team
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        {/* AI Agents Business Benefits Section */}
        <section className="py-16 bg-black/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Why <GradientText>AI Agents</GradientText> Are Transforming Business
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Our intelligent AI agents deliver tangible business outcomes across every department
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div variants={fadeInUp} className="bg-gradient-to-br from-gray-900 to-black/90 border border-white/10 rounded-xl p-6 shadow-xl">
                  <div className="bg-primary/20 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                    <i className="fas fa-chart-line text-primary text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Revenue Acceleration</h3>
                  <p className="text-gray-300 mb-4">AI agents increase sales conversion rates by 28% through personalized customer interactions and predictive analytics.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">24/7 lead qualification and nurturing</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">67% faster sales cycle completion</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">42% increase in upsell opportunities</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="bg-gradient-to-br from-gray-900 to-black/90 border border-white/10 rounded-xl p-6 shadow-xl">
                  <div className="bg-blue-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                    <i className="fas fa-coins text-blue-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Cost Reduction</h3>
                  <p className="text-gray-300 mb-4">Our enterprise clients achieve an average 35% reduction in operational costs through AI-powered process automation.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">78% reduction in manual data processing</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">$1.4M average annual labor savings</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">62% decrease in error-related costs</span>
                    </li>
                  </ul>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="bg-gradient-to-br from-gray-900 to-black/90 border border-white/10 rounded-xl p-6 shadow-xl">
                  <div className="bg-purple-500/20 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                    <i className="fas fa-bolt text-purple-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Competitive Advantage</h3>
                  <p className="text-gray-300 mb-4">Enterprises deploying our AI agents report gaining significant market advantages within just 90 days of implementation.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">85% faster market intelligence analysis</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">3.2x increase in innovation pipeline</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-300">41% improvement in business agility</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              
              <motion.div variants={fadeInUp} className="mt-12 text-center">
                <div className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-px rounded-xl mb-8">
                  <div className="bg-black/80 rounded-xl px-6 py-4">
                    <p className="text-lg font-medium">
                      "Our custom-built AI agents delivered a 312% ROI within the first year, fundamentally transforming how we operate."
                    </p>
                    <div className="mt-2 text-sm text-gray-400">— CTO, Fortune 500 Financial Services Company</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-20 bg-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Business with <GradientText>Enterprise AI</GradientText>?
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8">
                Schedule a consultation with our AI specialists to explore how our custom AI agents can be tailored to your specific business challenges.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Schedule Consultation
                </Button>
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}