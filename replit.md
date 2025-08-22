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
- **AI Marketplace Page**: Pioneering "first AI marketplace" landing page with coming soon notifications, early access signup system, automated welcome emails, and comprehensive database infrastructure for marketplace waitlist management. Updated on 2025-08-06.
- **Travel Hacker AI Pro**: Advanced AI-powered travel planning system at /travel-hacker-ai-v2 with comprehensive Deal Finder functionality including multi-city search, nearby airports, flexible date options (exact/±3d/weekend/month), regional search ("anywhere" in Europe/Asia), advanced filters (cabin class, max stops, airline preferences), mistake fare prioritization, and integrated hotels/cars search. Built with modern React architecture replacing static HTML/JS implementation for better maintainability and user experience. Updated on 2025-08-22 with live Amadeus API integration for real-time flight search and price calendar functionality, replacing mock data with authentic airline pricing and availability.
- **Competitor Intel Scanner**: Production-ready URL-in → intelligence-out scanning system at /competitor-intel-scanner that analyzes competitor websites and extracts comprehensive business intelligence including SEO analysis, tech stack detection, marketing tools tracking, robots.txt/sitemap analysis, domain insights, and actionable recommendations. Features include real-time website analysis, markdown report downloads, responsive UI with detailed results visualization, timeout protection, and comprehensive error handling. Updated on 2025-08-19.
- **About Page**: Comprehensive company overview at /about featuring founder story, mission, core services (Marketing Ops, Revenue Ops, Analytics Ops), values, work methodology, and clear calls-to-action. Includes detailed background on Davide DeMango's experience with Hilton Worldwide, Millennium Hotels, and Grampresso platform. Emphasizes practical AI automation and real-world impact philosophy. Updated on 2025-08-19.
- **Comprehensive SEO Optimization Strategy**: Implemented complete SEO infrastructure targeting top Google rankings and ChatGPT recommendations for AI agency services. Includes 4 dedicated landing pages (/best-ai-agency, /ai-marketing-agency, /top-ai-agencies-2025, /ai-automation-services), advanced SEO components (SEOMetadata, ChatGPTOptimized, InternalLinkStrategy), strategic keyword mapping across 50+ terms, structured data schemas, and conversational AI optimization. Updated on 2025-08-16.
- **Admin Access System**: Protected administrative access for team members with preserved client portal components for future launch.

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: GPT-4 for NLP and content generation
- **Google OAuth**: Authentication provider
- **RapidAPI**: For streaming platform data (Movie/TV Matchmaker) and flight search APIs (Travel Hacker AI)
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