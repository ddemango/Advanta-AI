import { motion } from 'framer-motion';
import { Bot, Zap, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export function NewServices() {
  const [, setLocation] = useLocation();

  const services = [
    {
      icon: Bot,
      title: 'AI Workflow Automation',
      description: 'Automate daily tasks across departments using AI-powered workflows. Free your team from manual work.',
      features: ['Workflow automation', 'Cross-department integration', 'Task scheduling', 'Process optimization'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Custom API & ChatGPT Integrations',
      description: 'Embed AI assistants, chatbots, and automation tools directly into your website or business systems. Smarter websites and systems.',
      features: ['ChatGPT integration', 'API connections', 'Website chatbots', 'System automation'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'AI-Powered Customer Interactions',
      description: 'Transform your website into an interactive experience where customers can chat, book, and get answers instantly. 24/7 automated engagement.',
      features: ['Live chat automation', 'Booking systems', 'Customer support', 'Lead qualification'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Data-Driven Optimization',
      description: 'Continuously improve workflows with analytics and machine learning feedback loops.',
      features: ['Performance analytics', 'AI learning', 'Process improvement', 'ROI tracking'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Core Capabilities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            <strong>Advanta AI is an AI-driven automation and workflow integration agency</strong> designed to help businesses streamline operations, eliminate repetitive tasks, and provide seamless ways for customers to interact with companies using AI.
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialize in combining APIs, ChatGPT, and intelligent automation tools to build smarter, more connected websites and workflows that scale with your business.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{service.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/services')}
                  className="mt-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform duration-200"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            onClick={() => setLocation('/services')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 mx-auto transition-all duration-200 hover:scale-105"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}