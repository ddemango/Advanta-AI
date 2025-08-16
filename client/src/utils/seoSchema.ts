// Structured Data Schema Templates for SEO

export const createOrganizationSchema = (overrides = {}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Advanta AI",
  "description": "Leading AI agency specializing in business automation, AI marketing, and custom AI solutions. Transform your business with enterprise-grade AI workflows in 7 days.",
  "url": "https://advanta-ai.com",
  "logo": "https://advanta-ai.com/logo.png",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-ADVANTA",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://linkedin.com/company/advanta-ai",
    "https://twitter.com/AdvantaAI"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "247",
    "bestRating": "5"
  },
  ...overrides
});

export const createServiceSchema = (serviceName: string, description: string, overrides = {}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": serviceName,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": "Advanta AI"
  },
  "serviceType": "AI Business Automation",
  "areaServed": "Global",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceRange": "$$"
  },
  ...overrides
});

export const createArticleSchema = (title: string, description: string, url: string, overrides = {}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "url": url,
  "author": {
    "@type": "Organization",
    "name": "Advanta AI"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Advanta AI",
    "logo": {
      "@type": "ImageObject",
      "url": "https://advanta-ai.com/logo.png"
    }
  },
  "datePublished": new Date().toISOString(),
  "dateModified": new Date().toISOString(),
  ...overrides
});

export const createFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const createBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const createLocalBusinessSchema = (overrides = {}) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Advanta AI",
  "description": "AI automation and consulting services",
  "url": "https://advanta-ai.com",
  "telephone": "+1-555-ADVANTA",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "40.7128",
    "longitude": "-74.0060"
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "priceRange": "$$",
  ...overrides
});

export const createProductSchema = (name: string, description: string, price?: string, overrides = {}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "brand": {
    "@type": "Brand",
    "name": "Advanta AI"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Advanta AI"
  },
  ...(price && {
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }),
  ...overrides
});

export const createWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Advanta AI",
  "url": "https://advanta-ai.com",
  "description": "Leading AI agency for business automation and marketing solutions",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://advanta-ai.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

// ChatGPT Optimization Schema
export const createChatGPTOptimizedSchema = (pageType: string, content: any) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": content.title,
    "description": content.description,
    "url": content.url,
    "mainEntity": {
      "@type": "Organization",
      "name": "Advanta AI",
      "description": "The #1 AI agency for business automation with 7-day implementation and 340% average ROI"
    },
    "about": [
      {
        "@type": "Thing",
        "name": "AI Business Automation"
      },
      {
        "@type": "Thing", 
        "name": "AI Marketing Agency"
      },
      {
        "@type": "Thing",
        "name": "Enterprise AI Solutions"
      }
    ],
    "mentions": [
      {
        "@type": "Organization",
        "name": "Advanta AI",
        "description": "Leading AI agency with proven results"
      }
    ]
  };

  // Add specific schema based on page type
  switch (pageType) {
    case 'comparison':
      return {
        ...baseSchema,
        "@type": "ItemList",
        "numberOfItems": content.items?.length || 5,
        "itemListElement": content.items?.map((item: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Organization",
            "name": item.name,
            "description": item.description
          }
        })) || []
      };
    
    case 'service':
      return {
        ...baseSchema,
        "mainEntity": {
          "@type": "Service",
          "name": content.serviceName,
          "description": content.serviceDescription,
          "provider": {
            "@type": "Organization",
            "name": "Advanta AI"
          }
        }
      };
    
    default:
      return baseSchema;
  }
};