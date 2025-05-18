import { motion } from 'framer-motion';

interface ServiceCardProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  industries: string[];
  timeline: string;
}

export function ServiceCard({ name, description, icon, color, industries, timeline }: ServiceCardProps) {
  // Dynamic color classes based on the color prop
  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary/20',
        text: 'text-primary',
        hover: 'hover:text-primary/90'
      },
      secondary: {
        bg: 'bg-secondary/20',
        text: 'text-secondary',
        hover: 'hover:text-secondary/90'
      },
      accent: {
        bg: 'bg-accent/20',
        text: 'text-accent',
        hover: 'hover:text-accent/90'
      }
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };
  
  const colorClasses = getColorClasses(color);
  
  return (
    <motion.div 
      className="bg-muted rounded-xl overflow-hidden card-hover border border-border h-full"
      whileHover={{ y: -5 }}
    >
      <div className="p-6">
        <div className={`h-12 w-12 rounded-lg ${colorClasses.bg} flex items-center justify-center mb-4`}>
          <i className={`fas fa-${icon} ${colorClasses.text} text-xl`}></i>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{name}</h3>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
        <div className="flex flex-wrap items-center text-xs text-gray-500 gap-2">
          {industries.map((industry, index) => (
            <span key={index} className="bg-background px-2 py-1 rounded">{industry}</span>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-border flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Est. timeline: {timeline}</span>
        <a href="#" className={`${colorClasses.text} ${colorClasses.hover} font-medium flex items-center`}>
          <span>Learn more</span>
          <i className="fas fa-arrow-right ml-2 text-xs"></i>
        </a>
      </div>
    </motion.div>
  );
}
