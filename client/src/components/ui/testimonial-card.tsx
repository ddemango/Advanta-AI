import { motion } from 'framer-motion';

interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    position: string;
    image: string;
    quote: string;
    rating: number;
    tags: string[];
  };
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars to reach 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <motion.div 
      className="bg-muted p-8 rounded-xl border border-border h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-6">
        <div className="mr-4">
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
          <p className="text-sm text-muted-foreground">{testimonial.position}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex text-yellow-400 mb-2">
          {renderStars(testimonial.rating)}
        </div>
        <p className="text-gray-300 italic">
          "{testimonial.quote}"
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {testimonial.tags.map((tag, index) => (
          <span 
            key={index} 
            className="text-xs bg-primary bg-opacity-20 text-white px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
