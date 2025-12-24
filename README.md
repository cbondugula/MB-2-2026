# MedBuilder

AI-Powered Healthcare Application Development Platform

## Overview

MedBuilder is a comprehensive no-code/low-code platform for building healthcare and life sciences applications. It combines conversational AI, HIPAA-compliant templates, and voice-controlled development to help teams rapidly build secure medical software.

## Key Features

### Dual Development Modes
- **Healthcare Mode**: HIPAA-compliant templates with PHI protection, audit logging, and medical-specific features
- **General Mode**: Standard app templates for e-commerce, CRM, blogs, chat apps, dashboards, and more
- Easy toggle to switch between modes based on your project needs

### AI-Powered Development
- Real-time AI code completion with GPT-4o
- Intelligent HIPAA compliance checking (Healthcare Mode)
- Architecture review and recommendations
- Smart templates for both healthcare and general applications
- Automated security scanning

### Healthcare Compliance
- Built-in HIPAA compliance tools
- PHI pattern detection (15+ types: SSN, MRN, NPI, DEA, etc.)
- Egress risk analysis for API calls
- AI model safety grading
- Full audit trail support

### Voice-Controlled Development
- Voice commands for code generation
- Intent parsing and command execution
- Hands-free development workflow

### Templates & Blueprints
- 14 HIPAA-compliant healthcare templates
- 13 healthcare blueprints (FHIR, Telehealth, eRx, Labs)
- Categories: EHR, Telemedicine, Patient Portal, Lab Management

### Real-Time Collaboration
- Multiplayer coding with live cursors
- User presence indicators
- Invite link generation
- Version history with one-click restore

### Global Healthcare Support
- 193 countries coverage
- 45+ languages
- Multicultural healthcare considerations
- Alternative medicine integration

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS with shadcn/ui
- TanStack Query (state management)
- Wouter (routing)

### Backend
- Node.js with Express.js
- TypeScript with ES modules
- Drizzle ORM
- PostgreSQL (Neon serverless)

### AI & Machine Learning
- OpenAI GPT-4o
- Healthcare BERT Models (ClinicalBERT, BioBERT, PubMedBERT, etc.)
- Python ML Environment (TensorFlow, PyTorch, scikit-learn)
- Healthcare-specific ML libraries (MedPy, NiBabel, Lifelines)

### Authentication & Security
- Replit Auth with OpenID Connect
- Session management with PostgreSQL storage
- Passport.js integration

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key (for AI features)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `OPENAI_API_KEY` - OpenAI API key for AI features
   - `STRIPE_SECRET_KEY` - Stripe key for payments (optional)

4. Run database migrations:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database operations
│   ├── phi-scanner.ts      # PHI detection service
│   ├── package-health.ts   # Dependency scanning
│   └── python-ml-service.ts # ML pipeline integration
├── shared/                 # Shared code between frontend/backend
│   └── schema.ts           # Database schema (Drizzle ORM)
└── ml_environment/         # Python ML scripts and models
```

## API Endpoints

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Templates
- `GET /api/templates` - List available templates
- `GET /api/templates/:id` - Get template details

### Healthcare Blueprints
- `GET /api/healthcare/blueprints` - List blueprints
- `POST /api/projects/:id/apply-blueprint` - Apply blueprint to project

### Compliance
- `POST /api/projects/:id/phi-scans` - Run PHI scan
- `POST /api/phi/lint` - Real-time PHI linting
- `POST /api/projects/:id/model-safety` - AI model safety check
- `GET /api/projects/:id/packages/scan` - Scan dependencies

### AI Features
- `POST /api/projects/:id/ai-assist` - AI code generation
- `POST /api/projects/:id/ai-plans` - Create AI execution plan

## Pricing Tiers

| Feature | Starter ($29/mo) | Professional ($79/mo) | Enterprise ($299/mo) |
|---------|------------------|----------------------|---------------------|
| Projects | 5 | 25 | Unlimited |
| Templates | 10 | Unlimited | Unlimited |
| AI Calls | 100/mo | 500/mo | Unlimited |
| Deployments | 2 | 10 | Unlimited |
| Team Members | 1 | 5 | Unlimited |
| Support | Community | Priority | Dedicated |

## Compliance & Security

### HIPAA Compliance
- PHI detection and prevention
- Audit logging for all operations
- Encrypted data at rest and in transit
- Role-based access control

### Supported Standards
- FHIR R4
- HL7 v2
- ICD-10
- SNOMED CT
- LOINC

### Privacy Regulations
- HIPAA (USA)
- GDPR (EU)
- PIPEDA (Canada)
- LGPD (Brazil)

## Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [HIPAA Compliance](./HIPAA_COMPLIANCE.md)
- [Monitoring Setup](./MONITORING.md)
- [Rate Limiting](./RATE_LIMITING.md)
- [Error Tracking](./ERROR_TRACKING.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For support inquiries, please contact the MedBuilder team through the platform's support channels.
