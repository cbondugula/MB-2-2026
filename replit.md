# MedBuilder - AI-Powered Healthcare Application Development

## Overview

MedBuilder is an AI-powered web application designed to be the leading platform for creating healthcare and life sciences applications. It features conversational AI, universal accessibility, rapid onboarding, dual visual and voice-controlled development modes, and a proactive AI assistant. The platform focuses on comprehensive IP protection for its innovations, particularly in voice-controlled healthcare development, advanced medical education, and AI-powered compliance automation. MedBuilder ensures global privacy compliance, supports multicultural healthcare across 193 countries and 45 languages, and integrates various healthcare domains like medical education, clinical research, and telehealth. It aims for market dominance and significant revenue potential through its unique blend of AI, voice control, and healthcare specialization.

## Recent Changes

**October 29, 2025 - Super Agent Dynamic Content Implementation**
- **CRITICAL FIX**: Converted Super Agent from hardcoded data to fully dynamic PostgreSQL-driven content
- Super Agent now queries `healthcare_agents` table for real-time AI agent data
- Recommendations dynamically generated based on:
  - Organization Type (Research Institution, Hospital, Pharmaceutical Company, Telehealth Provider)
  - Country (United States → HIPAA, EU countries → GDPR, etc.)
  - Input keywords (AI/ML, patient, EHR, pharma, drug, research)
- Next Steps dynamically generated based on task complexity and type
- Each Super Agent request now returns unique, contextual content instead of generic responses
- Added metadata tracking showing database query and dynamic generation confirmation
- Fixed "same info for all" issue - all content now sourced from database with NO hardcoded values

**October 27, 2025 - Healthcare Templates Implementation**
- Fixed duplicate API route issue: Removed redundant `/api/templates/healthcare` route that was causing "invalid input syntax for type integer: NaN" errors
- Added 14 comprehensive HIPAA-compliant healthcare templates to `server/seed-data.ts` for database persistence across server restarts
- Templates now cover: Patient Portal, Research Platform, Telehealth, EHR, Scheduling, Lab Management, Pharmacy, Clinical Trials, Medical Imaging, Analytics, Mental Health, MedTech, Wellness, Hospital Operations
- Made `/templates` route publicly accessible (no authentication required) so prospective users can browse template library
- Verified all templates display correctly with metadata including name, description, category, healthcare domain, framework, backend, and HIPAA compliance status
- Template library fully operational and tested end-to-end with Playwright

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
- Custom AI service layer for healthcare-specific intelligence (medical NER, clinical classification, medical concept extraction)
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