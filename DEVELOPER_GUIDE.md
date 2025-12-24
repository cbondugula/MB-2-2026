# MedBuilder Developer Guide

## Overview

MedBuilder is an AI-powered healthcare application development platform built with React, TypeScript, Express.js, and PostgreSQL. This guide covers everything developers need to build, extend, and deploy the application.

---

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/cbondugula/MB-2-2026.git
cd MB-2-2026

# Install dependencies
npm install

# Set up environment variables (see Environment Variables section)

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

---

## Project Structure

```
medbuilder/
├── client/                 # Frontend React application
│   └── src/
│       ├── components/     # Reusable UI components
│       │   └── ui/         # shadcn/ui components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility functions
│       ├── pages/          # Page components (routes)
│       ├── App.tsx         # Main app with routing
│       ├── main.tsx        # Entry point
│       └── index.css       # Global styles
├── server/                 # Backend Express application
│   ├── orchestrators/      # Domain-specific service orchestrators
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route modules
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # Main API routes
│   ├── storage.ts          # Database storage interface
│   ├── db.ts               # Database connection
│   └── *.ts                # Service modules
├── shared/                 # Shared code between frontend/backend
│   └── schema.ts           # Drizzle ORM schema definitions
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── drizzle.config.ts       # Drizzle ORM configuration
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (frontend + backend) |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema changes to database |

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Radix UI** - Accessible primitives
- **TanStack Query** - Data fetching
- **Wouter** - Routing
- **React Hook Form** - Form handling
- **Zod** - Validation
- **JSZip** - ZIP file generation for exports
- **file-saver** - File download functionality

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **Passport.js** - Authentication
- **Winston** - Logging
- **Socket.io** - Real-time features

### AI Integrations
- **OpenAI GPT-4o** - Code generation & assistance
- **Anthropic Claude** - AI analysis
- **Google Gemini** - AI features

---

## Environment Variables

Create a `.env` file or set these in your environment:

```bash
# Database (Required)
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication (Required)
SESSION_SECRET=your-session-secret

# AI Services (Optional - for AI code generation)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GEMINI_API_KEY=...

# Payments (Optional - for subscription billing)
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...
```

See `.env.example` for a complete template.

---

## Key Features

### 1. Live Preview
The workspace includes a real-time preview panel that updates as you code:
- **Live updating** - Changes reflect immediately
- **Full-screen mode** - Expand preview for better visibility
- **Pop-out window** - Open preview in a new browser tab
- **Refresh control** - Manual refresh option

### 2. Deploy to Replit
Export your project as a Replit-ready ZIP package:
- Includes `.replit` configuration file
- Includes `replit.nix` for dependencies
- Pre-configured `package.json` with scripts
- Ready to import and run on Replit

### 3. AI Code Assistant
AI-powered code generation for healthcare applications:
- HIPAA-aware code suggestions
- Healthcare template generation
- Code review and compliance checking

### 4. Settings & User Preferences
Comprehensive settings page with:
- Profile management
- Security settings (2FA, password)
- Notification preferences
- Theme preferences (dark mode)
- HIPAA compliance information
- Data export/download

---

## Database Schema

The database uses Drizzle ORM with PostgreSQL. Key tables:

### Core Tables
- `users` - User accounts (supports Replit Auth + email/password)
- `projects` - User projects with code and configuration
- `templates` - Healthcare app templates (14 seeded templates)
- `sessions` - Authentication sessions

### Healthcare-Specific
- `auditLogs` - HIPAA-compliant audit trail
- `healthcareBlueprints` - FHIR, telehealth blueprints
- `complianceChecks` - HIPAA/SOC2 compliance status

### Modify Schema
1. Edit `shared/schema.ts`
2. Run `npm run db:push` to sync

---

## Adding a New Page

1. Create page component in `client/src/pages/`:

```tsx
// client/src/pages/my-page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Page content here</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

2. Register route in `client/src/App.tsx`:

```tsx
import MyPage from "@/pages/my-page";

// In the Router component:
<Route path="/my-page" component={MyPage} />
```

---

## Adding an API Endpoint

1. Add route in `server/routes.ts`:

```typescript
// GET endpoint
app.get('/api/my-endpoint', async (req, res) => {
  try {
    const data = await storage.getMyData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// POST endpoint with validation
app.post('/api/my-endpoint', async (req, res) => {
  try {
    const validated = mySchema.parse(req.body);
    const result = await storage.createMyData(validated);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});
```

2. Add storage method in `server/storage.ts`:

```typescript
interface IStorage {
  // ... existing methods
  getMyData(): Promise<MyData[]>;
  createMyData(data: InsertMyData): Promise<MyData>;
}

class DatabaseStorage implements IStorage {
  async getMyData(): Promise<MyData[]> {
    return db.select().from(myTable);
  }
  
  async createMyData(data: InsertMyData): Promise<MyData> {
    const [result] = await db.insert(myTable).values(data).returning();
    return result;
  }
}
```

---

## Fetching Data (Frontend)

Use TanStack Query for data fetching:

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Fetch data
export function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/my-endpoint'],
  });

  if (isLoading) return <Skeleton />;
  if (error) return <div>Error loading data</div>;

  return <div>{JSON.stringify(data)}</div>;
}

// Mutate data
export function CreateForm() {
  const mutation = useMutation({
    mutationFn: (data: MyData) => apiRequest('/api/my-endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-endpoint'] });
    },
  });

  return (
    <Button onClick={() => mutation.mutate({ name: 'Test' })}>
      Create
    </Button>
  );
}
```

---

## UI Components

Import shadcn/ui components from `@/components/ui/`:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
```

Icons from Lucide React:

```tsx
import { Home, Settings, User, Search, Plus, Check, X, Eye, Rocket, Download } from "lucide-react";
```

---

## Authentication

MedBuilder supports Replit Auth. Check authentication status:

```tsx
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Skeleton />;
  if (!isAuthenticated) return <Redirect to="/login" />;

  return <div>Welcome, {user.firstName}!</div>;
}
```

Protected API routes:

```typescript
// server/routes.ts
app.get('/api/protected', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Handle authenticated request
});
```

---

## Healthcare Compliance

### HIPAA Audit Logging

All data access is logged for HIPAA compliance:

```typescript
import { createAuditLog } from './audit-logger';

await createAuditLog({
  userId: req.user.id,
  action: 'READ',
  tableName: 'patients',
  recordId: patientId,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

### PHI Detection

Scan code for Protected Health Information:

```typescript
import { scanCodeForPhi } from './phi-scanner';

const results = scanCodeForPhi(codeContent);
// Returns detected PHI patterns like SSN, MRN, etc.
```

---

## Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/user` | GET | Get current user |
| `/api/templates` | GET | List all templates (14 healthcare templates) |
| `/api/projects` | GET | List user projects |
| `/api/projects` | POST | Create new project |
| `/api/projects/:id` | GET | Get project details |
| `/api/projects/:id` | PATCH | Update project |
| `/api/projects/:id/ai-assist` | POST | AI code generation |
| `/api/projects/:id/deploy` | POST | Generate deployment package |
| `/api/healthcare/blueprints` | GET | Get healthcare blueprints |
| `/api/compliance-checks` | GET | Get compliance status |
| `/api/compliance-frameworks` | GET | List compliance frameworks |
| `/api/pricing/tiers` | GET | Get pricing tiers |

---

## Workspace Features

### Live Preview Panel
- Real-time rendering of React components
- Uses Babel standalone for in-browser transpilation
- Supports JSX/TSX files

### Export to Replit
The workspace generates Replit-ready packages:

```typescript
// Generated package includes:
// - .replit (run configuration)
// - replit.nix (Nix dependencies)
// - package.json (npm scripts)
// - index.js (Express server)
// - public/index.html (frontend)
// - README.md (documentation)
```

### Full-Screen Preview
- Click "Preview" button in toolbar
- Use expand icon on preview panel
- "Open in New Tab" for external viewing

---

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Requirements
- Node.js 20+
- PostgreSQL database
- Environment variables configured

### Deploy to Replit
1. Export project using "Deploy to Replit" button
2. Download the generated ZIP file
3. Go to replit.com → Create Repl → Import from ZIP
4. Upload the ZIP file
5. Click Run - your app is live!

### Alternative Deployment
Export the ZIP and deploy to:
- Vercel
- AWS
- Heroku
- Any Node.js hosting platform

---

## Troubleshooting

### Database Issues
```bash
# Reset database schema
npm run db:push --force
```

### Type Errors
```bash
# Check TypeScript
npm run check
```

### Port Issues
The app runs on port 5000 by default. Ensure no other services use this port.

### Preview Not Loading
- Check browser console for errors
- Ensure App.tsx exists in project files
- Try refreshing the preview panel

---

## Recent Updates (December 2025)

### Deploy to Replit Feature
- Generate Replit-ready ZIP packages with .replit config
- One-click export with auto-redirect to replit.com
- Includes proper Node.js configuration

### Enhanced Live Preview
- Prominent "Preview" button in workspace toolbar
- Full-screen preview modal
- Expand/popout buttons on preview panel
- Live updating indicator

### Settings Page
- Profile management
- Security settings (2FA, password)
- Notification preferences
- Dark mode toggle
- HIPAA compliance info
- Data download option

### Self-Testing Capabilities
- Automated health checks
- API endpoint verification
- Database connectivity testing

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes and test
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin feature/my-feature`
6. Create Pull Request

---

## Support

For questions or issues, contact the development team or create a GitHub issue.

---

*Last updated: December 24, 2025*
