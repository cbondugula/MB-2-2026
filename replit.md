# replit.md

## Overview

This is a healthcare-focused web application called "MedBuilder" - a development platform specifically designed for creating HIPAA-compliant healthcare applications. The application provides pre-built templates, verified components, and integrated compliance tools to help developers build healthcare software 10x faster.

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
- **Tables**: Users, projects, templates, components, API integrations, activities, sessions
- **Migrations**: Managed through drizzle-kit

### Frontend Components
- **Dashboard**: Main application hub with stats and quick actions
- **Code Editor**: In-browser code editing interface
- **Templates**: Healthcare-specific application templates
- **Components Library**: Pre-built HIPAA-compliant UI components
- **HIPAA Tools**: Compliance checking and documentation tools
- **Preview**: Application preview with responsive testing

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
- Express.js with middleware
- TypeScript for type safety
- Vite for build tooling

### Database & ORM
- Drizzle ORM with PostgreSQL dialect
- @neondatabase/serverless for database connection
- Zod for schema validation

### Authentication
- Replit Auth with OpenID Connect
- Passport.js integration
- Session management dependencies

### UI & Styling
- Tailwind CSS for styling
- Radix UI for accessible components
- Lucide React for icons
- shadcn/ui component library

### Development Tools
- tsx for TypeScript execution
- ESBuild for production builds
- PostCSS for CSS processing

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