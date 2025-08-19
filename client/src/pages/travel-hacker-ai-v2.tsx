import { Helmet } from "react-helmet";
import TravelHackerAIV3 from "../components/TravelHackerAIV3";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://advanta-ai.com";
const PAGE_URL = `${SITE_URL}/travel-hacker-ai-v2`;
const OG_IMAGE = `${SITE_URL}/og/travel-hacker-ai-v2.png`;

export default function TravelHackerAIV2() {
  return (
    <div>
      <Helmet>
        <title>Travel Hacker AI — Cheap Flights, Mistake Fares, Hotels & Cars</title>
        <meta name="description" content="AI-powered travel search to find ultra-cheap flights, mistake-fare-like deals, hotels and car rentals with flexible dates." />
        <meta name="keywords" content="cheap flights, mistake fares, travel deals, flight search, hotel booking, car rental, AI travel planner, ultra-cheap flights, weekend travel" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content="Travel Hacker AI — Cheap Flights & Mistake Fares" />
        <meta property="og:description" content="Find ultra-cheap flights and mistake-fare-like deals, plus hotels and cars. Flexible dates & weekend mode." />
        <meta property="og:site_name" content="Advanta AI" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Travel Hacker AI" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Travel Hacker AI — Cheap Flights & Mistake Fares" />
        <meta name="twitter:description" content="AI travel search for ultra-cheap flights, hotels, and cars. Flexible dates & weekend mode." />
        <meta name="twitter:image" content={OG_IMAGE} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Travel Hacker AI",
            url: PAGE_URL,
            applicationCategory: "TravelApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: { "@type": "Organization", name: "Advanta AI", url: SITE_URL }
          })}
        </script>
      </Helmet>
      
      <TravelHackerAIV3 />
    </div>
  );
}