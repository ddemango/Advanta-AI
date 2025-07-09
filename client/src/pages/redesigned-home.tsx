import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import { NewHero } from '@/components/redesign/NewHero';
import { NewServices } from '@/components/redesign/NewServices';
import { NewTrustSection } from '@/components/redesign/NewTrustSection';
import { NewCTA } from '@/components/redesign/NewCTA';
import { NewFooter } from '@/components/redesign/NewFooter';


export default function RedesignedHome() {
  return (
    <>
      <Helmet>
        <title>Advanta AI - Transform Your Business with AI-Powered Solutions</title>
        <meta name="description" content="Deploy AI assistants, automate processes, and scale your business in days, not months. Trusted by 500+ companies. Start your free trial today." />
        <meta name="keywords" content="AI automation, business AI, chatbots, process automation, AI assistants, business transformation" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanta AI - Transform Your Business with AI-Powered Solutions" />
        <meta property="og:description" content="Deploy AI assistants, automate processes, and scale your business in days, not months. Trusted by 500+ companies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://advanta-ai.com" />
        <meta property="og:image" content="https://advanta-ai.com/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanta AI - Transform Your Business with AI-Powered Solutions" />
        <meta name="twitter:description" content="Deploy AI assistants, automate processes, and scale your business in days, not months. Trusted by 500+ companies." />
        <meta name="twitter:image" content="https://advanta-ai.com/og-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Advanta AI",
            "url": "https://advanta-ai.com",
            "logo": "https://advanta-ai.com/logo.png",
            "description": "AI-powered business automation and transformation solutions",
            "founder": {
              "@type": "Person",
              "name": "Advanta AI Team"
            },
            "foundingDate": "2024",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-800-ADVANTA",
              "contactType": "Customer Service"
            },
            "sameAs": [
              "https://twitter.com/advanta_ai",
              "https://linkedin.com/company/advanta-ai"
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <NewHeader />
        <main>
          <NewHero />
          <NewServices />
          <NewTrustSection />
          <NewCTA />
        </main>
        <NewFooter />
      </div>
    </>
  );
}