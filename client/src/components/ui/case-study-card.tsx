import { motion } from 'framer-motion';

interface Metric {
  label: string;
  value: string;
}

interface CaseStudyCardProps {
  caseStudy: {
    id: number;
    title: string;
    client: string;
    logo: string;
    industry: string;
    image: string;
    metrics: Metric[];
    quote: string;
    color: string;
  };
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  // Dynamic color classes based on the color prop
  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: {
        border: 'border-primary',
        text: 'text-primary',
        hover: 'hover:text-primary/90'
      },
      secondary: {
        border: 'border-secondary',
        text: 'text-secondary',
        hover: 'hover:text-secondary/90'
      },
      accent: {
        border: 'border-accent',
        text: 'text-accent',
        hover: 'hover:text-accent/90'
      }
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };
  
  const colorClasses = getColorClasses(caseStudy.color);
  
  return (
    <motion.div 
      className="bg-background rounded-xl overflow-hidden card-hover"
      whileHover={{ y: -5 }}
    >
      {/* Case Study Image */}
      <img 
        src={caseStudy.image} 
        alt={`${caseStudy.client} case study visualization`} 
        className="w-full h-48 object-cover"
      />
      
      <div className="p-6">
        {/* Client Info */}
        <div className="flex items-center mb-4">
          <div className="bg-muted h-10 w-10 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-semibold">{caseStudy.logo}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{caseStudy.client}</h3>
            <p className="text-xs text-muted-foreground">{caseStudy.industry} Platform</p>
          </div>
        </div>
        
        {/* Case Study Title */}
        <h4 className="text-xl font-bold text-white mb-3">{caseStudy.title}</h4>
        
        {/* Metrics */}
        <div className="space-y-2 mb-4">
          {caseStudy.metrics.map((metric, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="text-white font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
        
        {/* Quote */}
        <blockquote className={`italic text-muted-foreground text-sm border-l-2 ${colorClasses.border} pl-3 mb-4`}>
          "{caseStudy.quote}"
        </blockquote>
        
        {/* CTA Link */}
        <a href="#" className={`${colorClasses.text} ${colorClasses.hover} font-medium flex items-center`}>
          <span>Read case study</span>
          <i className="fas fa-arrow-right ml-2 text-xs"></i>
        </a>
      </div>
    </motion.div>
  );
}
