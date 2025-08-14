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
- **Fully Automated AI Blog System**: Generates exactly 3 professional AI blog posts daily at 8am, 12pm, and 6pm EST using GPT-4, with zero manual intervention and complete content authenticity. Updated on 2025-08-06 to incorporate Advanta AI's core capabilities (AI Workflow Automation, Custom API & ChatGPT Integrations, Industry-Specific AI Learning, AI-Powered Customer Interactions, Data-Driven Optimization, Free AI Resources) and business value messaging into all generated content.
- **Comprehensive Service Pages**: Updated on 2025-08-06 with detailed industry-specific applications covering 15+ industries per service. Services include AI Workflow Automation, Custom API & ChatGPT Integrations, Industry-Specific AI Learning, AI-Powered Customer Interactions, Data-Driven Optimization, and Free AI Resources & Tools with real-world implementation examples.
- **Enhanced Website Launch**: New hero headline, unique value proposition highlighting 7-day deployment vs 6-month industry standard, How It Works visual diagram, and updated case studies with real business results.
- **SEO & Compliance Ready**: Complete meta tags, Open Graph integration, structured data markup, cookie consent banner, privacy policy compliance, and XML sitemap generation.
- **Modern Navigation & UX**: Updated header with "Book a Demo" and "Get Started" CTAs, smooth anchor scrolling, mobile-optimized design following OpenAI/Apple/Replit aesthetic standards.
- **Performance Optimized**: Fast loading times, responsive design, and production-ready deployment configuration for immediate website launch.
- **Client Suite Portal Waitlist**: Exclusive waitlist page with compelling design and messaging to drive engagement before portal launch. Form functionality fully working with email confirmations and database storage. Login/signup pages preserved in admin directory for future activation.
- **AI Workflow Builder Portal**: Complete natural language workflow generation system at /client-portal with database persistence, deployment capabilities, and real-time status monitoring. Features JSON schema generation, visual workflow preview, and Server-Sent Events for live updates. Updated on 2025-08-14.
- **AI Marketplace Page**: Pioneering "first AI marketplace" landing page with coming soon notifications, early access signup system, automated welcome emails, and comprehensive database infrastructure for marketplace waitlist management. Updated on 2025-08-06.
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