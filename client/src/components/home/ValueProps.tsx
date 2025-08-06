import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function ValueProps() {
  const props = [
    { text: "Deploy in days, not months", icon: "⚡" },
    { text: "No technical expertise required", icon: "✨" },
    { text: "Scales with your business", icon: "📈" },
    { text: "Enterprise-grade security", icon: "🔒" }
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      {props.map((prop, index) => (
        <motion.div
          key={index}
          className="flex items-center space-x-2 text-sm text-gray-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
        >
          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span>{prop.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}