# MedBuilder Design Guidelines

## Design Approach
**Reference-Based Strategy**: Drawing from v0.dev's clean sophistication, Linear's precision typography, and Stripe's professional trust cues, adapted for healthcare developers. The design balances clinical professionalism with modern developer tool aesthetics.

## Typography System
- **Primary Font**: Inter (Google Fonts) - clean, technical, highly legible
- **Monospace Font**: JetBrains Mono - for code snippets and technical elements
- **Hierarchy**:
  - Hero headline: text-6xl font-bold tracking-tight (96px desktop)
  - Section headlines: text-4xl font-bold (48px)
  - Feature titles: text-2xl font-semibold (32px)
  - Body text: text-lg (18px) with leading-relaxed
  - Code snippets: text-sm font-mono (14px)

## Layout System
**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 (e.g., p-4, mt-12, gap-8)
- Section padding: py-24 desktop, py-16 mobile
- Container: max-w-7xl mx-auto px-6
- Content grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Component spacing: gap-8 to gap-12 between cards/elements

## Page Structure (7 Sections)

### 1. Hero Section (80vh)
**Layout**: Full-width background image with centered content overlay
- **Image Description**: Clean, modern medical workspace - doctor/developer at dual monitors showing medical interface and code editor side-by-side, soft natural lighting, professional clinical setting with subtle tech elements, high-quality photography with slight desaturation for professionalism
- **Content**: 
  - Headline + subheadline (max-w-4xl centered)
  - Trust badge row: "HIPAA Compliant • SOC 2 Type II • HL7 FHIR Compatible"
  - Two CTAs side-by-side: "Start Building Free" (primary with backdrop-blur-md bg-white/20 border border-white/30) + "View Documentation" (secondary with same blur treatment)
  - Social proof: "Trusted by 500+ Healthcare Developers" with avatar stack

### 2. Real-Time Code Generation Demo (Full viewport)
**Layout**: Split-screen horizontal on desktop (50/50), stacked on mobile
- **Left Panel**: Chat interface mockup with example prompts:
  - "Create a HIPAA-compliant patient intake form with validation"
  - "Build a medication dosage calculator with safety warnings"
  - Dark interface with medical-themed syntax highlighting
- **Right Panel**: Live preview mockup showing generated medical form
- **Center Divider**: Animated pulse indicator showing "real-time sync"
- Background: Subtle medical grid pattern (ECG-inspired)

### 3. Healthcare Component Library (3-column grid)
**Layout**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-8
- **9 Component Cards** with:
  - Icon (Heroicons medical/code icons)
  - Component name (text-xl font-semibold)
  - Brief description (text-base text-gray-600)
  - Visual preview thumbnail (mini screenshot mockup)
  - "Compliance badge" corner tag
- Components: Patient Portal, Medical Charts, HIPAA Forms, Telehealth UI, Lab Results, Prescription Pad, Appointment Scheduler, Clinical Notes, Vital Signs Dashboard

### 4. Voice-Controlled Development Feature
**Layout**: Asymmetric 60/40 split
- **Left (60%)**: Large illustration/mockup showing waveform visualization + voice command examples floating
- **Right (40%)**: Feature benefits list with:
  - Microphone icon + headline
  - 4-5 bullet points with icons
  - "Try Voice Mode" CTA button
- Background: Gradient panel (clinical blue to white)

### 5. Developer Workflow Timeline
**Layout**: Horizontal timeline with 4 stages
- **Visual**: Connected nodes showing: Design → Generate → Preview → Deploy
- Each node: 
  - Large icon
  - Stage name
  - 2-3 line description
  - Estimated time saved metric
- Desktop: horizontal with connecting line
- Mobile: vertical stack

### 6. Trust & Compliance Section (2-column)
**Layout**: Split left/right
- **Left Column**: 
  - "Enterprise-Grade Security" headline
  - Certification badges grid: HIPAA, SOC 2, ISO 27001, HL7 FHIR
  - Security features list with checkmarks
- **Right Column**:
  - **Image Description**: Abstract visualization of secure data transmission - medical crosses and code symbols flowing through encrypted pathways, blue/white color scheme, clean vector-style illustration
  - Testimonial quote overlay with healthcare CTO attribution

### 7. CTA + Footer
**CTA Section** (centered, py-20):
- Bold headline: "Start Building HIPAA-Compliant Apps Today"
- Two-tier CTA buttons
- Feature highlights: "Free tier available • No credit card required • Deploy in minutes"

**Footer** (4-column grid):
- Column 1: Logo + tagline
- Column 2: Product links (Features, Templates, Docs, Pricing)
- Column 3: Resources (Blog, API Reference, Community, Support)
- Column 4: Newsletter signup + social icons
- Bottom bar: Copyright + compliance links + status indicator

## Component Library

### Navigation
- Fixed header: backdrop-blur-lg with border-b
- Logo left, nav center, CTA right
- Mobile: Hamburger with slide-in panel

### Cards
- Rounded-lg with subtle border
- Hover: subtle lift (translate-y-1)
- Padding: p-6 to p-8
- Shadow: shadow-sm default, shadow-md on hover

### Buttons
- Primary: Solid with rounded-lg, px-6 py-3
- Secondary: Outlined with same dimensions
- Icon buttons: Square with p-2 or p-3
- All buttons on images: backdrop-blur-md with bg-white/20 border border-white/30

### Code Blocks
- Background: Dark (near-black)
- Syntax highlighting: Medical theme (blue for functions, green for strings)
- Border-radius: rounded-md
- Padding: p-4
- Font: JetBrains Mono

### Form Elements
- Input fields: border-2 with focus ring in brand accent
- Labels: text-sm font-medium above inputs
- Validation: Inline with icon indicators
- Spacing: gap-4 between form groups

## Animations
**Minimal & Purposeful**:
- Fade-in on scroll for section entry
- Pulse animation on "real-time sync" indicator only
- Smooth transitions on hover (150ms ease)
- NO scroll-jacking, NO parallax, NO complex animations

## Images Summary
1. **Hero Image**: Medical professional at workstation with code/medical UI - full-width background, slight overlay for text legibility
2. **Trust Section Image**: Abstract secure data visualization - right column placement

## Icons
**Library**: Heroicons (CDN)
- Use outline style for navigation and UI
- Use solid style for feature highlights and confirmation states