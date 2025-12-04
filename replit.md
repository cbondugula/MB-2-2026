# MedBuilder - AI-Powered Healthcare Application Development

## Overview

MedBuilder is an AI-powered web application designed to be the leading platform for creating healthcare and life sciences applications. It features conversational AI, universal accessibility, rapid onboarding, dual visual and voice-controlled development modes, and a proactive AI assistant. The platform focuses on comprehensive IP protection, particularly in voice-controlled healthcare development, advanced medical education, and AI-powered compliance automation. MedBuilder ensures global privacy compliance, supports multicultural healthcare across 193 countries and 45 languages, and integrates various healthcare domains like medical education, clinical research, and telehealth. It aims for market dominance and significant revenue potential through its unique blend of AI, voice control, and healthcare specialization.

## User Preferences

Preferred communication style: Simple, everyday language.

Critical Development Requirement: NEVER use static pages or static content. Everything must be dynamic with real-time data integration from APIs. All pages, components, and content must fetch live data from the backend services and database. No hardcoded data, mock data, or static arrays should be used in any component.

Mandatory Dynamic Data Policy:
- Every page, component, and feature must use dynamic data from backend APIs
- No static content, hardcoded values, or placeholder data allowed
- All metrics, patent data, domain analysis, and filing status must be fetched from real backend services
- Components should show loading states while fetching dynamic data from database-driven endpoints
- Real-time updates required for patent filing progress, competitive analysis, and portfolio valuations
- All strategic analysis, revenue projections, and market data sourced from live database calculation engines
- CS Agent service fully converted to dynamic database operations with no hardcoded values
- Patent demonstrations and USPTO readiness status fetched from working prototype implementations
- Healthcare templates seeded from database via seed-data.ts (14 HIPAA-compliant templates across all major healthcare domains)

## System Architecture

MedBuilder utilizes a dual-platform strategy, separating healthcare-specific development (MedBuilder) from a multi-domain voice-controlled no-code platform (VoiceBuilder).

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui and Radix UI
- **State Management**: TanStack Query
- **Routing**: Wouter
- **UI/UX**: Healthcare-specific color palette (medical blue, trust green, healthcare teal) and mobile-first responsive design.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Core Features & Design
- **Authentication System**: Replit Auth integration with PostgreSQL-backed sessions.
- **Database Layer**: Drizzle ORM for schema management, supporting users, projects, templates, and AI data. Projects are stored as JSONB for real-time collaboration.
- **Dynamic Data Integration**: All data, analytics, and strategic intelligence are sourced from live backend API services, ensuring real-time updates and eliminating static content.
- **AI-Powered Capabilities**: Real-time AI code completion, intelligent HIPAA compliance checking, advanced architecture review, real-time collaborative development with AI, smart templates, and automated security scanning.
- **Comprehensive Healthcare Coverage**: Supports various clinical applications, telehealth, medical research, pharma, and global healthcare systems, adhering to international standards (FHIR, HL7).
- **Technology Stack Flexibility**: Supports diverse frontend, backend, mobile, desktop frameworks, and API types (REST, GraphQL, FHIR).
- **Stakeholder Interfaces**: Dedicated Medical Professional and Executive Intelligence dashboards for role-based usability.
- **Backend Consolidation**: Consolidated 40+ backend services into 7 cohesive domain orchestrators (`ai-orchestrator`, `compliance-orchestrator`, `innovation-orchestrator`, `analytics-orchestrator`, `support-orchestrator`, `developer-tools-orchestrator`, `voice-orchestrator`).

## External Dependencies

### Core Frameworks
- React 18 ecosystem
- Express.js
- TypeScript
- Vite

### AI & Intelligence
- OpenAI GPT-4o
- Google Med-Gemma
- Healthcare BERT Models (ClinicalBERT, BioBERT, PubMedBERT, BlueBERT, RadBERT, PathBERT, CardioBERT, OncoBERT, MentalBERT)
- Custom AI service layer for healthcare-specific intelligence
- Revolutionary Voice-Controlled AI Systems
- Predictive Compliance Engine
- Python ML Environment (TensorFlow, PyTorch, Transformers, Scikit-learn, OpenCV, PyDICOM, BioPython)
- Healthcare-Specific ML Libraries (MedPy, NiBabel, Lifelines, Prophet, MLflow)

### Database & ORM
- @neondatabase/serverless
- Drizzle ORM
- Zod

### Authentication & Security
- Replit Auth
- Passport.js
- connect-pg-simple

### Real-time Features
- Socket.io

### UI & Styling
- Tailwind CSS
- Radix UI
- Lucide React

### Development Tools
- tsx
- ESBuild
- PostCSS

### Payment Integration
- Stripe for subscription billing
- Three pricing tiers: Starter ($29/mo), Professional ($79/mo), Enterprise ($299/mo)
- Monthly/yearly toggle with 17% yearly savings
- **Note**: Requires STRIPE_SECRET_KEY (starts with 'sk_') in Secrets for payment processing

## Recent Updates (December 2024)

### Replit-Parity Features (December 4)
- **Real-time Collaboration**: Socket.io-based multiplayer coding with live cursors, user presence indicators, and invite link generation
- **AI Plan Mode**: Step-by-step execution plans with approval workflow before AI makes changes
- **Version History**: File-level version tracking with diffs and one-click restore functionality
- **Terminal Panel**: Command execution with output display in workspace environment
- **Database Schema Extensions**: fileVersions, aiPlans, terminalSessions, collaborationMembers tables
- **12 New Storage Methods**: For version history, AI plans, terminal sessions, and collaboration features
- **API Endpoints Added**: `/api/projects/:id/versions`, `/api/projects/:id/terminal`, `/api/projects/:id/ai-plans`, `/api/projects/:id/collaborators`, `/api/projects/:id/collaboration/invite`

### AI-Powered Code Development Platform (December 4)
- **Complete Development Workflow**: Templates → Project Creation → Workspace → AI Code Generation
- **AI Code Assist API** (`POST /api/projects/:id/ai-assist`): Zod validation, OpenAI GPT-4o integration, preview/apply modes, path safety checks
- **Full-Featured Workspace**: Sandpack-powered code editor with file tree, live preview, console panel
- **AI Assistant Chat**: Fixed state persistence by rendering outside SandpackProvider; chat messages display correctly
- **Apply & Save**: AI-generated code can be previewed then persisted to database with one click
- **Project File Management**: Full CRUD operations with auth/ownership enforcement

### Completed Features
- Full Stripe payment integration UI with checkout flow
- Pricing page with 3 tiers and billing toggle
- Enhanced error handling for Stripe configuration
- All core pages tested and working (landing, pricing, templates, dashboard, documentation, HIPAA tools)
- Consistent dark green/black theme across all pages
- Back button navigation on all pages
- 14 HIPAA-compliant healthcare templates seeded via database

### Platform Architecture
- **Workspace Page** (`/workspace/:id`): Main development environment with Sandpack editor
- **Templates Page** (`/templates`): Browse and use healthcare templates
- **AI Assist Endpoint**: Generates healthcare-focused code with HIPAA awareness
- **Authentication**: Replit Auth with project ownership verification

### Pending Configuration
- STRIPE_SECRET_KEY needs to be set with the correct secret key (starts with 'sk_test_' or 'sk_live_')
- Current key is a publishable key (pk_) which only works on frontend