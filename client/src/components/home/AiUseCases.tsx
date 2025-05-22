import { motion } from 'framer-motion';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';

const useCases = [
  {
    id: 1,
    title: "Customer Service Automation",
    description: "AI-powered chat systems that handle 85% of customer inquiries without human intervention, available 24/7.",
    icon: "fas fa-headset",
    image: "https://images.unsplash.com/photo-1557838506-7efe1c319d72?w=500&auto=format&fit=crop&q=80",
    stats: "Reduces response time by 74% while increasing customer satisfaction scores by 28%"
  },
  {
    id: 2,
    title: "Predictive Analytics Dashboard",
    description: "Forecast business metrics with 94% accuracy using our proprietary AI algorithms that identify patterns humans miss.",
    icon: "fas fa-chart-line",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80",
    stats: "Organizations using our predictive analytics see an average 31% reduction in operational costs"
  },
  {
    id: 3,
    title: "Content Generation Engine",
    description: "Create SEO-optimized content at scale with our AI that understands your brand voice and audience needs.",
    icon: "fas fa-pen-fancy",
    image: "https://images.unsplash.com/photo-1603791239531-1dda55e194a6?w=500&auto=format&fit=crop&q=80",
    stats: "Produces content 15x faster than human writers with 3.2x higher engagement metrics"
  },
  {
    id: 4,
    title: "Intelligent Document Processing",
    description: "Extract, classify, and validate information from documents with 99.3% accuracy, including complex unstructured data.",
    icon: "fas fa-file-alt",
    image: "https://images.unsplash.com/photo-1581094283808-22e9b869daf6?w=500&auto=format&fit=crop&q=80",
    stats: "Reduces document processing time by 89% while eliminating manual data entry errors"
  },
  {
    id: 5,
    title: "Supply Chain Optimization",
    description: "AI algorithms that continuously optimize inventory levels, shipping routes, and production schedules in real-time.",
    icon: "fas fa-truck",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80",
    stats: "Clients achieve 23% reduction in inventory costs and 18% faster delivery times"
  },
  {
    id: 6,
    title: "Personalized Recommendation Engine",
    description: "Deliver hyper-relevant product or content recommendations that evolve with each customer interaction.",
    icon: "fas fa-bullseye",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&auto=format&fit=crop&q=80",
    stats: "Increases conversion rates by 41% and customer lifetime value by 37%"
  }
];

export default function AiUseCases() {
  return (
    <section className="py-20 bg-muted relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-grid-white/5 bg-[length:30px_30px] opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-grid-white/5 bg-[length:20px_20px] opacity-20 rotate-12"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI Solutions for Real Business Challenges
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Proven use cases with measurable ROI across industries
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {useCases.map((useCase) => (
            <motion.div key={useCase.id} variants={fadeIn} className="h-full">
              <Card className="h-full bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                <div className="h-48 overflow-hidden relative">
                  {/* Optimized image loading with lazy loading and low-quality placeholder */}
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  <img 
                    src={useCase.image} 
                    alt={useCase.title} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.previousElementSibling?.classList.add('hidden')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        <i className={`${useCase.icon} text-primary`}></i>
                      </div>
                      <h3 className="text-xl font-bold text-white">{useCase.title}</h3>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-4">{useCase.description}</p>
                  <div className="bg-black/30 p-3 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary mb-1">Business Impact:</p>
                    <p className="text-sm text-gray-300">{useCase.stats}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a 
            href="/case-studies" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            View detailed case studies
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}