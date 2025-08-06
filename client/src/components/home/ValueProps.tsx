import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function ValueProps() {
  const props = [
    { text: "AI Workflow Automation: Free your team from manual work", icon: "⚡" },
    { text: "Custom API & ChatGPT Integrations: Smarter websites and systems", icon: "🔗" },
    { text: "Industry-Specific AI Learning: AI tailored to your business", icon: "🧠" },
    { text: "AI-Powered Customer Interactions: 24/7 automated engagement", icon: "💬" },
    { text: "Data-Driven Optimization: Improve performance continuously", icon: "📊" },
    { text: "Free AI Resources: Templates and tools to start automating today", icon: "🎯" }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      {props.map((prop, index) => (
        <motion.div
          key={index}
          className="flex items-start space-x-3 text-sm text-gray-300 bg-gray-800/30 p-4 rounded-lg backdrop-blur-sm border border-gray-700/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + index * 0.1 }}
        >
          <span className="text-lg flex-shrink-0">{prop.icon}</span>
          <span>{prop.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}