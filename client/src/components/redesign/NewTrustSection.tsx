import { motion } from 'framer-motion';
import { Star, Users, TrendingUp, Award } from 'lucide-react';

export function NewTrustSection() {
  const stats = [
    {
      icon: Users,
      value: '500+',
      label: 'Businesses Served',
      description: 'From startups to Fortune 500'
    },
    {
      icon: TrendingUp,
      value: '2.5M+',
      label: 'Tasks Automated',
      description: 'Every month across all clients'
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'Client Satisfaction',
      description: 'Based on 200+ reviews'
    },
    {
      icon: Award,
      value: '99.9%',
      label: 'Uptime Guarantee',
      description: 'Enterprise-grade reliability'
    }
  ];

  const testimonials = [
    {
      quote: "Advanta AI transformed our customer service. We're now handling 300% more inquiries with the same team size.",
      author: "Sarah Chen",
      role: "CEO",
      company: "TechFlow Solutions",
      rating: 5
    },
    {
      quote: "The ROI was immediate. Our AI assistant qualified leads better than our sales team ever could.",
      author: "Michael Rodriguez",
      role: "VP Marketing",
      company: "Growth Dynamics",
      rating: 5
    },
    {
      quote: "Implementation was seamless. We were up and running in just 3 days with full support.",
      author: "Jennifer Park",
      role: "Operations Director",
      company: "Retail Plus",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
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
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of businesses that have transformed their operations with our AI solutions.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}