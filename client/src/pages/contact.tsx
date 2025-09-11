import { useState } from 'react';
import { motion } from 'framer-motion';
import { NewHeader } from '@/components/redesign/NewHeader';
import { NewFooter } from '@/components/redesign/NewFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { 
  Send, 
  Mail, 
  Clock, 
  Shield, 
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  Globe
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
  consent: boolean;
}

export default function ContactPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.consent) {
      setError('You must agree to the Privacy Policy to continue.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', company: '', message: '', consent: false });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const teamMembers = [
    { name: 'AI', avatar: '🤖', role: 'AI Assistant' },
    { name: 'Team', avatar: '👥', role: 'Leadership' },
    { name: 'Support', avatar: '💬', role: 'Customer Success' }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - Let's Build Smarter, Together | Advanta AI</title>
        <meta name="description" content="Have questions or want to start your AI project? Get in touch and we'll respond within 1 business day." />
        <meta name="keywords" content="contact Advanta AI, AI consultation, business automation contact, AI project inquiry" />
        
        <meta property="og:title" content="Contact Us - Let's Build Smarter, Together | Advanta AI" />
        <meta property="og:description" content="Have questions or want to start your AI project? Get in touch and we'll respond within 1 business day." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <NewHeader />
        
        <main>
          {/* Hero Section */}
          <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl"></div>
              <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Let's Build{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Smarter
                  </span>
                  , Together
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Have questions or want to start your AI project? Get in touch and we'll respond within 1 business day.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contact Form & Details */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                    
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanks! We'll get back to you shortly.</h3>
                        <p className="text-gray-600">Your message has been received and our team will respond within 1 business day.</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                          >
                            {error}
                          </motion.div>
                        )}

                        <div>
                          <Label htmlFor="name" className="text-gray-700 font-medium">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="mt-2 h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your full name"
                            required
                            aria-invalid={error ? 'true' : 'false'}
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="mt-2 h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your email address"
                            required
                            aria-invalid={error ? 'true' : 'false'}
                          />
                        </div>

                        <div>
                          <Label htmlFor="company" className="text-gray-700 font-medium">
                            Company
                          </Label>
                          <Input
                            id="company"
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className="mt-2 h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Your company name (optional)"
                          />
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-gray-700 font-medium">
                            Message *
                          </Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            className="mt-2 min-h-32 px-4 py-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                            placeholder="Tell us about your AI goals, challenges, or questions..."
                            required
                            aria-invalid={error ? 'true' : 'false'}
                          />
                        </div>

                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="consent"
                            checked={formData.consent}
                            onChange={(e) => handleInputChange('consent', e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                            aria-required="true"
                          />
                          <Label htmlFor="consent" className="text-sm text-gray-700">
                            I agree to the{' '}
                            <a 
                              href="/privacy-policy" 
                              className="text-blue-600 hover:text-blue-700 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Privacy Policy
                            </a>{' '}
                            and consent to be contacted about my inquiry.*
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting || !formData.consent}
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-lg flex items-center justify-center space-x-2"
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              <span>Send Message</span>
                            </>
                          )}
                        </Button>

                        <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                          <Shield className="w-4 h-4" />
                          <span>SSL secured form submission</span>
                        </div>

                        <p className="text-center text-gray-500 text-sm">
                          We'll never spam you. Your contact info is safe with us.
                        </p>
                      </form>
                    )}
                  </div>
                </motion.div>

                {/* Contact Details & Team */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-8"
                >
                  {/* Contact Details */}
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Get in touch</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Email us</div>
                          <div className="text-gray-600">hello@advanta-ai.com</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Business hours</div>
                          <div className="text-gray-600">Mon–Fri, 9am–6pm EST</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Global reach</div>
                          <div className="text-gray-600">Serving clients worldwide</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Meet the humans behind the AI</h3>
                    <p className="text-gray-600 mb-6">Your message will be reviewed by our leadership team</p>
                    
                    <div className="flex space-x-4">
                      {teamMembers.map((member, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center"
                        >
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl mb-2 shadow-lg">
                            {member.avatar}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-600">{member.role}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Element */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Solutions</h4>
                    <p className="text-gray-600">Transforming businesses worldwide with intelligent automation</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Demo CTA Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-2xl p-12 shadow-lg"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Prefer to Book a Demo Instead?
                </h2>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  See our AI solutions in action with a personalized demonstration tailored to your business needs.
                </p>
                
                <Button
                  onClick={() => setLocation('/demo')}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule a 15‑Min Call
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        <NewFooter />
      </div>
    </>
  );
}