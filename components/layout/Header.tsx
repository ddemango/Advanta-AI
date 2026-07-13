"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Blog", href: "/blog" },
  { name: "AI Marketplace", href: "/marketplace" },
  { name: "Free Tools", href: "/free-tools" },
  { name: "ROI Calculator", href: "/roi-calculator" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="circleGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38BDF8"/>
                  <stop offset="100%" stopColor="#6366F1"/>
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="18" fill="url(#circleGrad)"/>
              {/* A shape */}
              <path d="M11 26L18 10L25 26" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M13.5 21H22.5" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
              {/* Network nodes */}
              <circle cx="26" cy="15" r="1.6" fill="white"/>
              <circle cx="28" cy="21" r="1.6" fill="white"/>
              <circle cx="24" cy="25" r="1.6" fill="white"/>
              <line x1="25" y1="26" x2="26" y2="15" stroke="white" strokeWidth="1.2" strokeOpacity="0.7"/>
              <line x1="25" y1="26" x2="28" y2="21" stroke="white" strokeWidth="1.2" strokeOpacity="0.7"/>
              <line x1="26" y1="15" x2="28" y2="21" stroke="white" strokeWidth="1.2" strokeOpacity="0.7"/>
            </svg>
            <span className="text-[1.25rem] font-bold tracking-tight">
              <span style={{background: "linear-gradient(90deg,#3B82F6,#6366F1)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>Advanta</span>
              <span style={{background: "linear-gradient(90deg,#6366F1,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}> AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/ai-stack-builder"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg"
            >
              <div className="px-4 py-4 space-y-1">
                {[{ name: "Home", href: "/" }, ...navigation, { name: "Contact", href: "/contact" }].map(
                  (item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-2.5 px-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  )
                )}
                <div className="pt-3 border-t border-gray-200">
                  <Link
                    href="/ai-stack-builder"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
