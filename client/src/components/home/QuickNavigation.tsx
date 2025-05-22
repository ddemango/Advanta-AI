import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'why-advanta', label: 'Benefits' },
  { id: 'services', label: 'Solutions' },
  { id: 'roi-calculator', label: 'ROI' },
  { id: 'case-studies', label: 'Results' },
  { id: 'contact', label: 'Contact' }
];

export default function QuickNavigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isSticky, setIsSticky] = useState(false);

  // Track scroll position to determine active section
  useEffect(() => {
    const handleScroll = () => {
      // Make the navigation sticky after scrolling past the hero
      if (window.scrollY > 300) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Determine which section is currently in view
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div 
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className={`fixed z-50 left-1/2 transform -translate-x-1/2 ${
        isSticky 
          ? 'top-4 bg-background/80 backdrop-blur-md shadow-lg border border-primary/20 rounded-full px-4 py-2' 
          : 'top-[calc(100vh-120px)] bg-transparent'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex space-x-1 md:space-x-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`relative px-3 py-2 text-sm md:text-base rounded-full transition-all duration-300 ${
              activeSection === item.id 
                ? 'text-white font-medium' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {activeSection === item.id && (
              <motion.div
                layoutId="activeSection"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ duration: 0.3 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}