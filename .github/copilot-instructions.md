# AI Coding Guidelines for GrooveRooster Web

## Project Overview

GrooveRooster is a Next.js 15 web application for discovering electronic music events. It aggregates events from multiple APIs (EDMTrain, LastFM, Ticketmaster, SDHM) and provides location-based filtering with user authentication via Supabase.

## Architecture Patterns

### App Router Structure

- **Pages**: `/app` directory with route-based file organization
- **APIs**: `/app/api/[endpoint]` for serverless functions
- **Components**: `/components` with feature-based subdirectories
- **Layouts**: Root layout in `/app/layout.tsx` provides global providers

### Data Flow

- **External APIs**: Events fetched from EDMTrain/SDHM, transformed via `edmTrainTransformer.ts`
- **Database**: Supabase with Row Level Security (RLS) policies
- **State**: React Context (`AppContext`) for global location/user state
- **Caching**: API responses cached for 6 hours with `stale-while-revalidate`

### Authentication & Security

- **Middleware**: `/middleware.ts` protects routes using Supabase sessions
- **API Security**: Bearer token validation in `apiSecurity.ts`
- **Frontend-open endpoints**: Whitelisted in `FRONTEND_OPEN_ENDPOINTS` array
- **Validation**: Zod schemas in `/lib/validation/schemas.ts` for all inputs

## Development Workflow

### Environment Setup

```bash
cp .env.example .env.local  # Required API keys and Supabase config
npm install
npm run dev  # Uses Turbopack for fast development
```

### Code Quality

- **Pre-commit hooks**: ESLint + Prettier + TypeScript checks via Husky
- **Manual checks**: `npm run lint`, `npm run format`, `npm run format:check`
- **TypeScript**: Strict checking enabled, run `npx tsc --noEmit`

### Build & Deploy

- **Build**: `npm run build` (Next.js production build)
- **Start**: `npm run start` (production server)
- **Deploy**: Vercel with custom redirects in `vercel.json`

## Component Patterns

### Client Components

- Always `"use client"` directive for interactive components
- Import from relative paths: `../../components/...`
- Use hooks from `/hooks` directory

### UI Components

- **ShadCN**: Configured in `components.json` with New York style
- **Tailwind**: Custom theme with brand colors (pink: #ce3197, blue: #1c94a5)
- **Icons**: Lucide React icons
- **Accessibility**: ARIA labels, keyboard navigation, focus management

### Event Components

- **GenreNav**: Horizontal scrollable genre pills with drag/swipe support
- **EventCard**: Individual event display with modal integration
- **EventsModule**: Main events list with filtering/pagination/search

## API Integration Patterns

### External APIs

- **EDMTrain/SDHM**: Event data with transformation in `edmTrainTransformer.ts`
- **LastFM**: Artist metadata and images
- **Ticketmaster**: Additional event discovery
- **Security**: All APIs except whitelisted ones require bearer tokens

### Supabase Integration

- **Client**: `createClient` from `@supabase/supabase-js`
- **SSR**: `createServerClient` from `@supabase/ssr` for middleware
- **Auth**: Session-based with automatic token refresh
- **Database**: Typed with generated Database type from Supabase

## Key Files & Directories

### Core Architecture

- `app/layout.tsx` - Root layout with providers
- `features/AppContext.tsx` - Global state management
- `features/Supabase.ts` - Database client configuration
- `middleware.ts` - Route protection and redirects

### Security & Validation

- `utils/apiSecurity.ts` - API endpoint protection
- `utils/appRouterSecurity.ts` - App Router security adapter
- `lib/validation/schemas.ts` - Zod validation schemas
- `vercel.json` - Deployment configuration and redirects

### Components

- `components/EventsModule/` - Main events display logic
- `components/GenreNav/` - Genre filtering UI
- `components/EventCard/` - Individual event cards
- `components/ui/` - ShadCN component library

### Utilities

- `utils/locationService.ts` - Location management and cookies
- `utils/searchFilter.ts` - Event filtering logic
- `utils/edmTrainTransformer.ts` - API data transformation
- `types/database.ts` - Supabase-generated types

## Common Patterns

### Error Handling

```typescript
try {
  const result = await apiCall();
  return NextResponse.json(result);
} catch (error: any) {
  console.error("Error:", error);
  return NextResponse.json(
    { error: "An error occurred processing your request" },
    { status: 500 }
  );
}
```

### API Route Structure

```typescript
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const security = secureAppRouterEndpoint(request);
  if (!security.allowed) {
    return NextResponse.json({ error: security.error }, { status: 401 });
  }
  // ... validation and business logic
}
```

### Component Props with Events

```tsx
interface ComponentProps {
  events: Event[];
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
}
```

### Context Usage

```tsx
const { currentUserLocation, setUserLocation, supabase, isLoggedIn } =
  useAppContext();
```

## Environment Variables

Required for full functionality:

- `NEXT_PUBLIC_SUPABASE_URL/KEY` - Database and auth
- `NEXT_PUBLIC_API_KEY_EDMTRAIN` - Event data
- `NEXT_PUBLIC_API_KEY_LASTFM` - Artist info
- `API_KEY_TICKETMASTER/SDHM` - Additional event sources
- `API_ALLOWED_TOKENS` - Comma-separated bearer tokens

## Testing & Debugging

- **API Testing**: Use browser dev tools or curl with Authorization headers
- **Component Testing**: Storybook or manual testing in browser
- **Build Issues**: Check TypeScript errors with `npx tsc --noEmit`
- **Security**: Monitor Vercel logs for `[API Security]` messages</content>
  <parameter name="filePath">/Users/mosinovs/workspace/grooverooster-web/.github/copilot-instructions.md
