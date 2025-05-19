import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { sendContactForm } from '@/lib/contact-service';

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    industry: '',
    message: '',
    consent: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, industry: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, consent: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.company || !formData.industry || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.consent) {
      toast({
        title: "Error",
        description: "Please agree to receive communications.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await sendContactForm(formData);
      
      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        industry: '',
        message: '',
        consent: false
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-background neural-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col lg:flex-row rounded-2xl overflow-hidden bg-muted border border-border"
        >
          <motion.div 
            variants={fadeInUp}
            className="lg:w-1/2 p-8 lg:p-12"
          >
            <h2 className="text-3xl font-bold mb-6">Start Your AI Journey</h2>
            <p className="text-muted-foreground mb-8">
              Fill out the form below and our team will get back to you within 24 hours to discuss your specific needs and how our AI solutions can help.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">Full Name</label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="company" className="block text-white font-medium mb-2">Company Name</label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="industry" className="block text-white font-medium mb-2">Industry</label>
                <Select
                  value={formData.industry}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="industry" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eCommerce">eCommerce</SelectItem>
                    <SelectItem value="SaaS / Technology">SaaS / Technology</SelectItem>
                    <SelectItem value="Finance / Insurance">Finance / Insurance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-white font-medium mb-2">How can we help?</label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="flex items-center mb-6">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={handleCheckboxChange}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="consent" className="ml-2 text-muted-foreground text-sm">
                  I agree to receive communications about Advanta AI services. You can unsubscribe anytime.
                </label>
              </div>
              
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="lg:w-1/2 flex flex-col"
          >
            {/* An AI technology visualization */}
            <div className="h-1/2 p-0">
              <img 
                src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800&h=400" 
                alt="Futuristic AI technology visualization showing data connections" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="h-1/2 bg-background p-8">
              <h3 className="text-xl font-bold text-white mb-4">Book a Discovery Call</h3>
              <p className="text-muted-foreground mb-6">
                Prefer to talk directly? Schedule a no-obligation call with one of our AI consultants to discuss your specific needs.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-calendar-alt text-primary"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">30-Minute Discovery Call</h4>
                    <p className="text-muted-foreground text-sm">Discuss your business goals and challenges</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-lightbulb text-primary"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Custom Solution Overview</h4>
                    <p className="text-muted-foreground text-sm">Get recommendations tailored to your needs</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fas fa-file-alt text-primary"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Detailed Proposal</h4>
                    <p className="text-muted-foreground text-sm">Receive a comprehensive plan and pricing</p>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="lg"
                className="mt-6"
                asChild
              >
                <a href="/calculator">Build My AI Stack</a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
