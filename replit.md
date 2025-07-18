# replit.md

## Overview

This is a healthcare-focused web application called "MedBuilder" - the world's most advanced AI-powered development platform specifically designed for creating ANY healthcare and life sciences application. The platform combines Replit's cloud infrastructure with Cursor-like AI intelligence to support the complete healthcare technology ecosystem:

**Complete Healthcare Coverage:**
- Clinical Applications (EHRs, EMRs, Clinical Decision Support)
- Telehealth & Remote Patient Monitoring
- Medical Research & Clinical Trials
- Pharmaceutical & Drug Discovery
- Medical Device Software & IoT
- Health Analytics & Population Health
- Genomics & Bioinformatics
- Laboratory Information Management
- Medical Imaging & DICOM Processing
- Healthcare Administration & Billing
- Global Healthcare Systems (193 Countries)
- Multilingual Healthcare Applications (10+ Languages)
- International Healthcare Standards (FHIR, HL7, UMLS, SNOMED CT, ICD-10, LOINC, DICOM)

**Technology Stack Flexibility:**
- Frontend: React, Angular, Vue, Flutter, React Native
- Backend: Node.js, Python, Java, Go, Rust, PHP
- Mobile: iOS, Android, Cross-platform
- Desktop: Electron, native applications
- Web: Progressive Web Apps, responsive design
- APIs: REST, GraphQL, FHIR, HL7

**AI-Powered Features:**
- Real-time AI code completion with healthcare-specific context
- Intelligent HIPAA compliance checking and suggestions
- Advanced architecture review and optimization
- Real-time collaborative development with AI assistance
- Smart templates with AI-powered customization
- Automated security scanning and vulnerability detection

The platform helps developers build ANY healthcare software 10x faster with cutting-edge AI technology.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and build processes
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and configurations
├── server/           # Backend Express application
├── shared/           # Shared types and schemas
└── migrations/       # Database migration files
```

## Key Components

### Authentication System
- **Provider**: Replit Auth integration
- **Flow**: OpenID Connect with automatic session management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: HTTPS-only cookies with 7-day TTL

### Database Layer
- **ORM**: Drizzle with TypeScript-first approach
- **Schema**: Shared schema definitions in `/shared/schema.ts`
- **Core Tables**: Users, projects, templates, components, API integrations, activities, sessions
- **AI Tables**: AI sessions, code analysis cache, collaboration sessions, advanced templates, smart components
- **Migrations**: Managed through drizzle-kit with automatic schema updates

### Frontend Components
- **Dashboard**: Main application hub with AI insights and quick actions
- **AI Workspace**: Advanced AI-powered development environment with real-time collaboration
- **AI Code Editor**: Intelligent code editor with healthcare-specific AI completion and analysis
- **Code Editor**: Traditional in-browser code editing interface
- **Templates**: AI-enhanced healthcare-specific application templates
- **Components Library**: Smart HIPAA-compliant UI components with AI context
- **HIPAA Tools**: AI-powered compliance checking and documentation tools
- **Preview**: Application preview with AI-driven responsive testing

### UI Framework
- **Design System**: shadcn/ui with healthcare-specific color palette
- **Theme**: Medical blue, trust green, and healthcare teal color scheme
- **Components**: Comprehensive set including cards, buttons, forms, navigation
- **Responsive**: Mobile-first design with breakpoint utilities

## Data Flow

### Authentication Flow
1. User accesses application
2. Replit Auth middleware checks authentication
3. If unauthenticated, redirects to `/api/login`
4. OpenID Connect flow with Replit
5. Session creation and user data storage
6. Redirect to dashboard

### Application Data Flow
1. Frontend components use TanStack Query for data fetching
2. API requests go through Express routes with authentication middleware
3. Storage layer abstracts database operations
4. Drizzle ORM handles database queries
5. Results returned through standardized API responses

### Project Management
- Projects store code as JSONB in database
- Real-time collaboration through shared project state
- Activity tracking for project changes
- Template-based project initialization

## External Dependencies

### Core Framework Dependencies
- React 18 ecosystem (React, React DOM)
- Express.js with middleware and WebSocket support
- TypeScript for type safety
- Vite for build tooling

### AI & Intelligence
- OpenAI GPT-4o for advanced code analysis and completion
- Google Med-Gemma for specialized medical AI analysis and healthcare domain expertise
- Healthcare BERT Models: ClinicalBERT, BioBERT, PubMedBERT, BlueBERT, RadBERT, PathBERT, CardioBERT, OncoBERT, MentalBERT
- Custom AI service layer for healthcare-specific intelligence with medical NER, clinical classification, and medical concept extraction
- Real-time collaboration with WebSocket integration

### Database & ORM
- Drizzle ORM with PostgreSQL dialect
- @neondatabase/serverless for database connection
- Zod for schema validation
- Advanced caching for AI analysis results

### Authentication & Security
- Replit Auth with OpenID Connect
- Passport.js integration
- Session management with PostgreSQL storage
- HIPAA-compliant security protocols

### Real-time Features
- Socket.io for real-time collaboration
- WebSocket connections for AI assistance
- Live cursor tracking and code synchronization

### UI & Styling
- Tailwind CSS for styling
- Radix UI for accessible components
- Lucide React for icons
- shadcn/ui component library
- Advanced AI-powered code editor components

### Development Tools
- tsx for TypeScript execution
- ESBuild for production builds
- PostCSS for CSS processing
- Advanced debugging and analysis tools

## Deployment Strategy

### Development Environment
- Replit-optimized with hot reload
- Vite dev server with Express backend
- Environment variable management
- Development banner integration

### Production Build
1. Vite builds frontend to `dist/public`
2. ESBuild bundles server code to `dist/index.js`
3. Static file serving from Express
4. Environment-based configuration

### Database Setup
- PostgreSQL provisioning required
- Drizzle migrations for schema setup
- Session table initialization
- Environment variable configuration for DATABASE_URL

### Security Considerations
- HIPAA compliance focus throughout
- Secure session management
- HTTPS enforcement
- Authentication middleware protection
- Environment variable security

The architecture prioritizes healthcare compliance, developer experience, and scalability while maintaining security best practices essential for medical applications.