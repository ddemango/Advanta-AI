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
- June 23, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```