import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Users, Building, BookOpen } from 'lucide-react';
import advantaLogo from '@assets/06D8F275-04BC-4E3C-A69B-B0E66F70D218_1752082906104.png';

export function NewHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Solutions', href: '/services' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Resources', href: '/resources' },
    { name: 'ROI Calculator', href: '/roi-calculator' },
    { name: 'Pricing', href: '/pricing' }
  ];



  const mobileNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Solutions', href: '/services' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Resources', href: '/resources' },
    { name: 'ROI Calculator', href: '/roi-calculator' },
    { name: 'Contact', href: '/contact' },
    { name: 'Client Suite Portal', href: '/login' }
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setLocation('/')}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={advantaLogo} alt="Advanta AI" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Advanta<span className="text-blue-600">AI</span>
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setLocation(item.href)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            
            {/* Client Suite Portal Button */}
            <button
              onClick={() => setLocation('/login')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Client Suite Portal
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/contact')}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              Book Demo
            </Button>
            <Button
              onClick={() => setLocation('/build-my-ai-stack')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
            >
              <div className="px-4 py-6 space-y-4">
                {mobileNavigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setLocation(item.href);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setLocation('/contact');
                      setIsOpen(false);
                    }}
                    className="w-full justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Book Demo
                  </Button>
                  <Button
                    onClick={() => {
                      setLocation('/build-my-ai-stack');
                      setIsOpen(false);
                    }}
                    className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}