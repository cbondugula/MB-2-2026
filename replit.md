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

### PHI Guardrail & Compliance Scanner (December 4)
- **PHI Pattern Detection**: 15+ pattern types (SSN, MRN, NPI, DEA, phone, email, DOB, address, diagnosis codes, CPT codes, medications, lab values, vital signs, insurance IDs, credit cards)
- **Egress Risk Analysis**: Detection of outbound API calls to untrusted domains with risk categorization (high/medium/low)
- **AI Model Safety Grading**: 5 checks (BAA coverage, PHI in prompts, response logging, model context limits, error handling)
- **Scan Types**: Static (pattern matching), Dynamic (pattern + egress), Egress (outbound risk only), Full (all checks + model safety)
- **New API Endpoints**: `POST /api/projects/:id/phi-scans`, `POST /api/phi/lint` (real-time linting), `POST /api/projects/:id/model-safety`, `POST /api/projects/:id/egress-check`
- **Implementation Files**: server/phi-scanner.ts with scanCodeForPhi, performStaticAnalysis, performEgressAnalysis, gradeModelSafety

### Package Health & Debugger (December 4)
- **Dependency Scanning**: Automatic vulnerability detection with severity levels (critical, high, moderate, low)
- **HIPAA-Safe Recommendations**: Prioritized upgrade suggestions based on security and compliance requirements
- **License Compliance**: Checking for GPL and other potentially problematic licenses in healthcare contexts
- **Dependency Graph**: Visual representation of package relationships
- **Project Health Dashboard**: Combined score from package vulnerabilities, PHI scan results, and environment status
- **New API Endpoints**: `POST /api/projects/:id/packages/scan`, `GET /api/projects/:id/packages/hipaa-recommendations`, `GET /api/projects/:id/packages/dependency-graph`, `GET /api/projects/:id/debug/health`, `POST /api/debug/logs`
- **Implementation Files**: server/package-health.ts with scanPackageJson, getHipaaUpgradeRecommendations, getDependencyGraph

### Healthcare Blueprint Library (December 4)
- **13 Comprehensive Blueprints**: FHIR Patient CRUD, FHIR Observation, FHIR Encounter, Telehealth Video, Remote Patient Monitoring, Async Telehealth, eRx Prescribing, Medication Reconciliation, Lab Order Management, POCT, Pathology Workflow, Patient Portal, Appointment Scheduling
- **Blueprint Categories**: fhir, telehealth, erx, labs, patient-intake, scheduling
- **Apply to Project**: Blueprints can be merged into project configuration with compliance checks preserved
- **API Endpoints**: `GET /api/healthcare/blueprints`, `GET /api/healthcare/blueprints/:id`, `POST /api/projects/:id/apply-blueprint`, `GET /api/healthcare/blueprints/categories/stats`

### HIPAA Deploy & Secrets Manager (December 4)
- **8 New Database Tables**: projectEnvironments, projectSecrets, hipaaDeployments, complianceAuditEvents, gitIntegrations, healthcareBlueprints, phiScanResults, packageHealth
- **Environment Management**: Support for development, staging, production environments with HIPAA compliance settings
- **Secrets Manager**: Environment-scoped secrets with rotation tracking, masked values, and audit logging
- **HIPAA Deployments**: Full deployment lifecycle with SSL/WAF/encryption verification and rollback capability
- **Compliance Audit Trail**: All sensitive operations logged with BAA evidence export functionality
- **Git Integration**: Repository linking with branch management and sync status
- **30+ New API Endpoints**: Full CRUD for environments, secrets, deployments, audit events, git sync, blueprints, PHI scans, and package health
- **Security Features**: Authentication checks, ownership verification, secret value masking, compliance audit logging for all sensitive operations

### Replit-Parity Features (December 4)
- **Real-time Collaboration**: Socket.io-based multiplayer coding with live cursors, user presence indicators, and invite link generation
- **AI Plan Mode**: Step-by-step execution plans with approval workflow before AI makes changes
- **Version History**: File-level version tracking with diffs and one-click restore functionality
- **Terminal Panel**: Command execution with output display in workspace environment
- **Git Workflow Panel**: Repository connection, branch management, push/pull sync, sync history tracking
- **Package Manager Panel**: Package installation/uninstall, vulnerability scanning, HIPAA-safe upgrade recommendations
- **Database Schema Extensions**: fileVersions, aiPlans, terminalSessions, collaborationMembers, packageHealth tables
- **Storage Methods Added**: createPackageHealth, deletePackageHealth for individual package tracking
- **API Endpoints Added**: `/api/projects/:id/versions`, `/api/projects/:id/terminal`, `/api/projects/:id/ai-plans`, `/api/projects/:id/collaborators`, `/api/projects/:id/collaboration/invite`, `/api/projects/:id/packages/install`, `/api/projects/:id/packages/:packageName` (DELETE)

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

### Viral Growth Features (December 4)
- **Public Template Gallery** (`/gallery`): Browse, search, and fork HIPAA-compliant healthcare templates without login
- **Community Showcase** (`/showcase`): Featured projects, voting system, category filters (clinical, telehealth, research, admin, patient-facing)
- **Template Marketplace** (`/marketplace`): Premium templates with pricing, free tier, purchase flow, seller program (80% revenue share)
- **MedBuilder Academy** (`/academy`): Learning platform with courses, HIPAA certification path, progress tracking, badges
- **Database Schema**: 30+ new tables including publicTemplates, sharedLinks, showcases, showcaseVotes, usageQuotas, wearableIntegrations, telehealthSessions, ehrIntegrations, voiceCommands, translations, locales, marketplaceTemplates, badges, userBadges, courses, lessons, enrollments, teams, teamMembers, teamInvites, whiteLabelBranding, complianceRecommendations
- **Backend Routes** (`/api/viral/*`): Full API for all viral growth features with auth checks, usage quotas, and HIPAA compliance
- **Free Tier Limits**: 3 projects, 5 templates, 50 AI calls/month, 1 deployment, community support
- **Healthcare Integrations**: Wearables (Apple Health, Google Fit, Fitbit), Telehealth (Jitsi, Doxy.me), EHR (Epic, Cerner, Allscripts)
- **Voice Commands**: Voice-controlled development with intent parsing and command execution
- **Gamification**: Badges, points, leaderboards, course completion awards
- **Teams & Enterprise**: Organization management, team invites, seat management, white-label branding
- **AI Compliance Coach**: Automated compliance scanning with recommendations and resolution tracking

### Pending Configuration
- STRIPE_SECRET_KEY needs to be set with the correct secret key (starts with 'sk_test_' or 'sk_live_')
- Current key is a publishable key (pk_) which only works on frontend