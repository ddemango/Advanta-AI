import { motion } from 'framer-motion';
import { Zap, Twitter, Linkedin, Github } from 'lucide-react';
import { useLocation } from 'wouter';

export function NewFooter() {
  const [, setLocation] = useLocation();

  const navigation = {
    solutions: [
      { name: 'AI Assistants', href: '/services' },
      { name: 'Process Automation', href: '/services' },
      { name: 'Analytics & Insights', href: '/services' },
      { name: 'Enterprise Security', href: '/services' }
    ],
    resources: [
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Documentation', href: '/resources' },
      { name: 'Blog', href: '/blog' },
      { name: 'Support Center', href: '/support' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Partnerships', href: '/partnerships' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Security', href: '/security' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/advanta_ai' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/advanta-ai' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/advanta-ai' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  Advanta<span className="text-blue-400">AI</span>
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transforming businesses with intelligent AI solutions that scale. 
                From automation to insights, we help you work smarter, not harder.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                  >
                    <social.icon className="w-5 h-5 text-gray-400 hover:text-white" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Navigation Sections */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Solutions</h3>
              <ul className="space-y-3">
                {navigation.solutions.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => setLocation(item.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                {navigation.resources.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => setLocation(item.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => setLocation(item.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => setLocation(item.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-left"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 Advanta AI. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <span>SOC 2 Type II Certified</span>
              <span>GDPR Compliant</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}