import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center mr-2">
                <i className="fas fa-brain text-white"></i>
              </div>
              <span className="text-white font-bold text-xl">Advanta<span className="text-primary">AI</span></span>
            </div>
            <p className="text-muted-foreground mb-6">
              Engineering the future of intelligence with custom AI solutions that drive measurable business outcomes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Solutions */}
          <div>
            <h3 className="text-white font-bold mb-6">Solutions</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">NeuroAds™</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">PromptCore™</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">SignalFlow™</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">VisionBoard™</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Custom AI Development</Link></li>
            </ul>
          </div>
          
          {/* Industries */}
          <div>
            <h3 className="text-white font-bold mb-6">Industries</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">eCommerce</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">SaaS & Technology</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Finance & Insurance</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Healthcare</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Manufacturing & Logistics</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="#case-studies" className="text-muted-foreground hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link href="/calculator" className="text-muted-foreground hover:text-white transition-colors">AI Cost Calculator</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">Whitepapers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors">AI Readiness Assessment</Link></li>
              <li><Link href="#contact" className="text-muted-foreground hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright & Legal */}
        <div className="border-t border-muted mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AdvantaAI. All rights reserved. 
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</Link>
            <Link href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</Link>
            <Link href="#" className="text-gray-500 hover:text-gray-400 text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
