import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-muted' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="text-white font-bold text-xl flex items-center" onClick={() => setLocation('/')}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center mr-2">
                <i className="fas fa-brain text-white"></i>
              </div>
              <span>Advanta<span className="text-primary">AI</span></span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="text-gray-300 hover:text-white font-medium transition-colors">Services</a>
            <a href="#case-studies" className="text-gray-300 hover:text-white font-medium transition-colors">Case Studies</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white font-medium transition-colors">Testimonials</a>
            <a href="#ai-demo" className="text-gray-300 hover:text-white font-medium transition-colors">AI Demo</a>
            <a href="#contact" className="text-gray-300 hover:text-white font-medium transition-colors">Contact</a>
          </nav>
          
          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href="#contact">Book a Call</a>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} pb-4`}>
          <div className="flex flex-col space-y-4">
            <a 
              href="#services" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
              onClick={closeMenu}
            >
              Services
            </a>
            <a 
              href="#case-studies" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
              onClick={closeMenu}
            >
              Case Studies
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
              onClick={closeMenu}
            >
              Testimonials
            </a>
            <a 
              href="#ai-demo" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
              onClick={closeMenu}
            >
              AI Demo
            </a>
            <a 
              href="#contact" 
              className="text-gray-300 hover:text-white font-medium transition-colors"
              onClick={closeMenu}
            >
              Contact
            </a>
            <div className="pt-2">
              <Button asChild className="bg-primary hover:bg-primary/90 w-full">
                <a href="#contact" onClick={closeMenu}>Book a Call</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
