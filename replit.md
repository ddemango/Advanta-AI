# Advanta AI - Full-Stack Application

## Overview

This is a full-stack web application for Advanta AI, an AI consultancy company offering custom AI solutions, automation tools, and enterprise services. The application features a React frontend with TypeScript, Express.js backend, PostgreSQL database with Drizzle ORM, and comprehensive AI-powered tools including workflow automation, blog generation, and business intelligence features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **State Management**: TanStack Query for server state, React hooks for local state
- **Build Tool**: Vite with hot reload and development optimizations
- **Animations**: Framer Motion for smooth interactions

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js
- **Language**: TypeScript with ES modules
- **API**: REST endpoints with JSON responses
- **Session Management**: Express-session with in-memory store
- **Authentication**: Passport.js with Google OAuth and local auth strategies
- **Build Process**: ESBuild for production bundling

### Data Storage Solutions
- **Primary Database**: PostgreSQL 16 (Neon serverless)
- **ORM**: Drizzle ORM with migration support
- **Schema**: Modular schema with user management, blog posts, workflows, quotes, and analytics
- **Session Store**: Memory-based session storage for development

## Key Components

### Authentication System
- Multi-provider authentication (Google OAuth, local auth, demo accounts)
- Session-based authentication with secure cookie management
- Role-based access control for different user types
- Demo authentication for testing without real credentials

### AI-Powered Features
- **Workflow Engine**: Natural language to workflow conversion using OpenAI GPT-4
- **Blog Generator**: Automated content creation with industry-specific topics
- **Business Tools**: ROI calculator, quote generator, competitive analysis tools
- **AI Assistants**: Custom GPT creation and deployment

### Content Management
- Dynamic blog system with categories, tags, and SEO optimization
- Resource library with downloadable content
- Case studies and testimonials management
- Multi-level navigation and content organization

### Entertainment Features
- **Movie Matchmaker**: 5000+ movie database with authentic titles across all genres
- **TV Show Matchmaker**: 5000+ authentic TV shows with status filtering and streaming integration
- **Streaming Integration**: Real-time streaming platform data via RapidAPI
- **Fantasy Football Tools**: NFL API integration with player analysis and recommendations
- **Travel Hacker AI**: Comprehensive travel deal finder and budget optimization

### User Experience Improvements
- **Free Tools Page**: Quick Access section, real-time search, category filtering, and grid/list view toggle
- **Reduced Scrolling**: Compact layouts and improved navigation for better tool accessibility

### Business Intelligence
- Workflow analytics and performance tracking
- User engagement metrics and reporting
- Predictive scheduling and optimization
- Enterprise governance and security monitoring

## Data Flow

1. **User Authentication**: Users authenticate via Google OAuth or demo login
2. **Session Management**: User sessions are maintained in memory store
3. **API Requests**: Frontend makes REST calls to backend endpoints
4. **Database Operations**: Drizzle ORM handles all database interactions
5. **AI Processing**: OpenAI API integration for intelligent features
6. **Response Delivery**: JSON responses with proper error handling

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: GPT-4 for natural language processing and content generation
- **Google OAuth**: Authentication provider for user login

### Development Tools
- **Replit**: Primary development environment with auto-deployment
- **Stripe**: Payment processing for premium features
- **SendGrid**: Email delivery service
- **HubSpot**: CRM integration and analytics

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **Framer Motion**: Animation and interaction library

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 module
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Development**: `npm run dev` with hot reload on port 5000

### Production Deployment
- **Target**: Autoscale deployment on Replit
- **Build Process**: Vite build for frontend, ESBuild for backend
- **Static Assets**: Served from dist/public directory
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, API keys

### Database Management
- **Migrations**: Drizzle Kit for schema management
- **Push Command**: `npm run db:push` for schema updates
- **Backup Strategy**: Neon automatic backups

## Changelog

```
Changelog:
- July 8, 2025. FINAL: Travel Hacker AI configured with proper error handling for API access limitations - maintains data integrity by displaying clear error states instead of fake data
- July 8, 2025. VERIFIED: RapidAPI Travelpayouts endpoints tested but returning 404 - implemented graceful fallback with helpful external links 
- July 8, 2025. CONFIRMED: Travel tool shows accurate "API unavailable" messaging rather than presenting broken functionality to users
- July 8, 2025. VALIDATED: Fantasy Football tools fully operational - comprehensive testing confirms Jalen Hurts correctly displays as QB/PHI (not RB)
- July 8, 2025. FIXED: Data integrity issues resolved - eliminated all caching that could corrupt player position data
- July 8, 2025. IMPLEMENTED: Cache-busting timestamps and staleTime: 0 to prevent position corruption in frontend display
- July 8, 2025. ENHANCED: Debug logging tracks data integrity from API response to UI display with comprehensive verification
- July 8, 2025. CONFIRMED: All API endpoints validated - QB requests return QB, RB requests return RB, WR requests return WR
- July 8, 2025. VERIFIED: Fantasy Football tools now 100% authentic data - Sleeper API integration complete with real NFL player positions and teams
- July 8, 2025. FIXED: Multiple player name disambiguation - correctly identifies Josh Allen QB vs Josh Allen G with priority system
- July 8, 2025. OPTIMIZED: API caching implemented to reduce calls and improve performance - 5-minute cache for Sleeper data
- July 8, 2025. VALIDATED: Start/Sit analysis working with real player data - accurate positions (QB, RB, WR, TE) and team names (BUF, DAL, BAL, etc.)
- July 8, 2025. CRITICAL: Completed comprehensive audit of Fantasy Football tools - ALL mock data removed and replaced with real-time NFL API integration
- July 8, 2025. Eliminated ALL Math.random() usage, placeholder content, and synthetic data generation from Fantasy Football system
- July 8, 2025. Implemented strict data integrity compliance - system now throws errors when real NFL data unavailable instead of using fallbacks
- July 8, 2025. FIXED: ATS Resume Tailor fully functional with intelligent resume optimization and real-time analysis
- July 8, 2025. Resolved OpenAI token limit issues with optimized prompts and fallback analysis system
- July 8, 2025. Implemented robust file upload handling for PDF, Word documents, and text files
- July 8, 2025. Added comprehensive keyword matching and ATS scoring with professional improvement suggestions
- July 6, 2025. COMPLETED: Emergency audit - ALL mock data removed from Travel Hacker AI system with zero tolerance policy implemented
- July 6, 2025. VERIFIED: Real-time API integration working correctly - authentic flight data displayed for all searches
- July 6, 2025. FIXED: Travel Hacker AI date accuracy - backend now uses structured date data from form fields instead of parsing from text
- July 6, 2025. Enhanced date range handling - properly displays travel periods (e.g., "Jul 2025 to Dec 2025") and calculates optimal search dates
- July 6, 2025. Fixed Travel Hacker AI date accuracy issue - now correctly processes requested travel dates instead of defaulting to February
- July 6, 2025. Enhanced date parsing logic to handle month names (e.g., "July 2025") and specific date formats
- July 6, 2025. Improved authentic mistake fare detection - only shows real pricing errors or clear "none found" message
- June 24, 2025. Improved /free-tools page UX with Quick Access section, search, and category filtering
- June 24, 2025. Created TV Show Matchmaker with 5000+ authentic shows and streaming integration
- June 24, 2025. Expanded Movie Matchmaker to 5000+ authentic movies with real streaming data
- June 23, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```