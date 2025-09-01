# Advanta AI - Full-Stack Application

## Overview
Advanta AI is a comprehensive AI automation platform that delivers enterprise-grade AI solutions in 7 days instead of 6+ months. The platform features automated AI daily blog generation (3 posts daily), individual service pages for AI workflow automation, website AI assistants, API integrations, and industry-specific solutions. The redesigned website showcases the new hero headline "AI Automation for Your Business – Build, Launch, and Scale AI Workflows in Days, Not Months" with enhanced unique value propositions, case studies, How It Works visual diagram, cookie consent compliance, and full SEO optimization including structured data and Open Graph integration.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI/Styling**: Shadcn/ui, Radix UI primitives, Tailwind CSS with custom theming
- **State Management**: TanStack Query for server state, React hooks for local state
- **Animations**: Framer Motion for smooth interactions
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js
- **Language**: TypeScript
- **API**: REST endpoints
- **Authentication**: Passport.js with Google OAuth and local strategies; session-based with secure cookie management, role-based access control, and demo accounts.
- **Build Process**: ESBuild

### Data Storage Solutions
- **Primary Database**: PostgreSQL 16 (Neon serverless)
- **ORM**: Drizzle ORM with migration support
- **Schema**: Modular schema supporting user management, blog posts, workflows, quotes, and analytics.

### Key Features
- **Fully Automated AI Blog System**: Generates exactly 3 professional AI blog posts daily at 8am, 12pm, and 6pm EST using GPT-4, with zero manual intervention and complete content authenticity. Updated on 2025-08-20 with hardened security (HTML sanitization, unified markdown processing) and unified API architecture (/api/blog/* endpoints) for consistent content delivery across all blog features.
- **Comprehensive Service Pages**: Updated on 2025-08-06 with detailed industry-specific applications covering 15+ industries per service. Services include AI Workflow Automation, Custom API & ChatGPT Integrations, Industry-Specific AI Learning, AI-Powered Customer Interactions, Data-Driven Optimization, and Free AI Resources & Tools with real-world implementation examples.
- **Enhanced Website Launch**: New hero headline, unique value proposition highlighting 7-day deployment vs 6-month industry standard, How It Works visual diagram, and updated case studies with real business results.
- **SEO & Compliance Ready**: Complete meta tags, Open Graph integration, structured data markup, cookie consent banner, privacy policy compliance, and XML sitemap generation.
- **Modern Navigation & UX**: Updated header with "Book a Demo" and "Get Started" CTAs, smooth anchor scrolling, mobile-optimized design following OpenAI/Apple/Replit aesthetic standards.
- **Performance Optimized**: Fast loading times, responsive design, and production-ready deployment configuration for immediate website launch.
- **Client Suite Portal Waitlist**: Exclusive waitlist page with compelling design and messaging to drive engagement before portal launch. Form functionality fully working with email confirmations and database storage. Login/signup pages preserved in admin directory for future activation.
- **AI Workflow Builder Portal**: Complete natural language workflow generation system at /client-portal with database persistence, deployment capabilities, and real-time status monitoring. Features JSON schema generation, visual workflow preview, and Server-Sent Events for live updates. Updated on 2025-08-14.
- **AI Stack Builder Wizard**: Production-ready AI infrastructure recommendation engine at /ai-stack-builder with comprehensive 8-step wizard interface, industry-specific recommendations for 20+ industries, budget and compliance filtering (HIPAA, PCI, SOC2), professional HTML email delivery via Resend API, and integration with free tools directory. Features real-time AI recommendations engine, downloadable markdown reports, and sophisticated UI with animations. Fully tested and operational with email delivery confirmed. Updated on 2025-08-24.
- **Private AI Portal**: Enterprise-grade AI development environment at /ai-portal with password-protected access exclusively for Advanta AI team. Features include multi-model AI chat (GPT-4o, GPT-4o-mini, GPT-4, GPT-3.5-turbo), Python code execution with security timeouts, web search integration via DuckDuckGo, text-to-speech generation, advanced text humanization with 6 tone presets (professional, humorous, caring, bold, technical, casual), CSV/Excel data analysis with visualization capabilities, **Operator-style virtual computer with containerized execution** (Docker isolation in production, secure local fallback in development), isolated workspace persistence, usage tracking with token counting, project management system, team collaboration features, credits system, and comprehensive audit logging. Built with modern React architecture, production-ready database schema including teams, operator sessions, and credit ledger tables, and enterprise security measures. **Includes Abacus.AI-style chat interface** with pixel-perfect responsive design matching production chat applications, complete with model selector, project management sidebar, quick-prompt chips, and professional tool integration. Updated on 2025-09-01.
- **Lead Magnet Builder Platform**: Complete lead generation system at /lead-magnet-builder with professional templates (eBook, Checklist, Calculator, Webinar, Coupon, Quiz), visual form builder, A/B testing capabilities, multi-delivery options, integration hub (Webhook, Mailchimp, HubSpot, Klaviyo, Salesforce, Google Sheets), real-time analytics, and embed code generation. Features deterministic A/B bucketing, lead scoring, consent management, email delivery via Postmark/SMTP, and comprehensive backend with Prisma ORM for production deployment. Updated on 2025-08-24.
- **AI Marketplace Page**: Pioneering "first AI marketplace" landing page with coming soon notifications, early access signup system, automated welcome emails, and comprehensive database infrastructure for marketplace waitlist management. Updated on 2025-08-06.
- **Travel Hacker AI Pro**: Advanced AI-powered travel planning system at /travel-hacker-ai-v2 with comprehensive Deal Finder functionality including multi-city search, nearby airports, flexible date options (exact/±3d/weekend/month), regional search ("anywhere" in Europe/Asia), advanced filters (cabin class, max stops, airline preferences), mistake fare prioritization, and integrated hotels/cars search. Built with modern React architecture replacing static HTML/JS implementation for better maintainability and user experience. Updated on 2025-08-22 with live Amadeus API integration for real-time flight search and price calendar functionality, replacing mock data with authentic airline pricing and availability.
- **Competitor Intel Scanner**: Production-ready intelligent scanning system at /competitor-intel-scanner with smart fetch technology that automatically escalates from static HTML to headless Puppeteer for JavaScript-rendered sites. Provides comprehensive business intelligence including SEO analysis, tech stack detection with evidence tracking, marketing sophistication analysis, performance metrics with Core Web Vitals, and social presence detection. Features include mode indicators showing fetch method used, enhanced error handling, markdown report downloads, and detailed scoring across 5 pillars (SEO, Tech, Structure, Performance, Marketing). Updated on 2025-08-23 with smart fetch capabilities and enhanced data extraction.
- **About Page**: Comprehensive company overview at /about featuring founder story, mission, core services (Marketing Ops, Revenue Ops, Analytics Ops), values, work methodology, and clear calls-to-action. Includes detailed background on Davide DeMango's experience with Hilton Worldwide, Millennium Hotels, and Grampresso platform. Emphasizes practical AI automation and real-world impact philosophy. Updated on 2025-08-19.
- **Comprehensive SEO Optimization Strategy**: Implemented complete SEO infrastructure targeting top Google rankings and ChatGPT recommendations for AI agency services. Includes 4 dedicated landing pages (/best-ai-agency, /ai-marketing-agency, /top-ai-agencies-2025, /ai-automation-services), advanced SEO components (SEOMetadata, ChatGPTOptimized, InternalLinkStrategy), strategic keyword mapping across 50+ terms, structured data schemas, and conversational AI optimization. Updated on 2025-08-16.
- **Admin Access System**: Protected administrative access for team members with preserved client portal components for future launch.

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: GPT-4 for NLP and content generation
- **Google OAuth**: Authentication provider
- **Amadeus Self-Service API**: Live flight search, hotels, and price calendar data for Travel Hacker AI Pro with authentic airline pricing and availability
- **RapidAPI**: For streaming platform data (Movie/TV Matchmaker)
- **Sleeper API**: For NFL player data (Fantasy Football tools)

### Development & Services
- **Replit**: Primary development and auto-deployment environment
- **Stripe**: Payment processing
- **Resend**: Email delivery service (for newsletters and welcome emails)
- **HubSpot**: CRM integration

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Framer Motion**: Animation library