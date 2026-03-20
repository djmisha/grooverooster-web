# AGENTS.md — GrooveRooster Web

Comprehensive guidance for AI coding agents (GitHub Copilot, Codex, Claude, etc.) working on this repository. Agents should read this file in full before making any changes.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Layout](#2-repository-layout)
3. [Environment Setup](#3-environment-setup)
4. [Development Commands](#4-development-commands)
5. [Agent Workflow](#5-agent-workflow)
6. [Code Quality Standards](#6-code-quality-standards)
7. [File & Naming Conventions](#7-file--naming-conventions)
8. [TypeScript Guidelines](#8-typescript-guidelines)
9. [React Component Guidelines](#9-react-component-guidelines)
10. [Styling Guidelines](#10-styling-guidelines)
11. [Next.js Guidelines](#11-nextjs-guidelines)
12. [Database & Supabase Patterns](#12-database--supabase-patterns)
13. [API Route Patterns](#13-api-route-patterns)
14. [Security Guidelines](#14-security-guidelines)
15. [Error Handling Patterns](#15-error-handling-patterns)
16. [Performance Guidelines](#16-performance-guidelines)
17. [Testing & Debugging](#17-testing--debugging)
18. [Git & PR Workflow](#18-git--pr-workflow)
19. [Environment Variables](#19-environment-variables)
20. [Pre-Submission Checklist](#20-pre-submission-checklist)
21. [Common Pitfalls](#21-common-pitfalls)

---

## 1. Project Overview

GrooveRooster is a **Next.js 15** web application for discovering electronic music events. It aggregates events from multiple external APIs (EDMTrain, SDHM, LastFM, Ticketmaster), applies location-based filtering, and provides user authentication via Supabase.

### Technology Stack

| Concern          | Technology                                          |
| ---------------- | --------------------------------------------------- |
| Framework        | Next.js 15.x (App Router)                           |
| Language         | TypeScript (strict)                                 |
| Styling          | Tailwind CSS + ShadCN UI + Radix UI                 |
| State            | React Context API (`AppContext`)                    |
| Database / Auth  | Supabase (PostgreSQL + RLS)                         |
| Package Manager  | Yarn v1.22.19                                       |
| Node Version     | 20.0.0 (pinned by Volta — patch updates acceptable) |
| Linting          | ESLint (Airbnb + Next.js config)                    |
| Formatting       | Prettier                                            |
| Pre-commit hooks | Husky                                               |
| Deployment       | Vercel                                              |

### Brand Color Palette

Always use these Tailwind utility classes; never hard-code hex values in JSX/TSX:

| Class token   | Hex       |
| ------------- | --------- |
| `blue`        | `#1c94a5` |
| `black`       | `#04092c` |
| `pink`        | `#ce3197` |
| `orange`      | `#f97316` |
| `green`       | `#10b981` |
| `light-grey`  | `#f6f6fb` |
| `border-grey` | `#d3d3dc` |
| `light-pink`  | `#fbe5f3` |

---

## 2. Repository Layout

```
/
├── app/                      # Next.js App Router pages & API routes
│   ├── api/                  # Serverless API routes
│   ├── layout.tsx            # Root layout with global providers
│   └── [page]/page.tsx       # Route-based pages
├── components/               # Feature-based component subdirectories
│   ├── EventCard/            # Individual event card + modal
│   ├── EventsModule/         # Main events list with filtering/pagination
│   ├── GenreNav/             # Horizontal scrollable genre pills
│   └── ui/                   # ShadCN component library (do not edit directly)
├── features/
│   ├── AppContext.tsx         # Global React Context (location, auth)
│   └── Supabase.ts           # Supabase client factory
├── hooks/                    # Custom React hooks
├── lib/
│   └── validation/
│       └── schemas.ts        # Zod validation schemas for all inputs
├── middleware.ts              # Supabase session-based route protection
├── public/                   # Static assets
├── styles/                   # Global CSS (Tailwind base)
├── types/
│   └── database.ts           # Supabase-generated DB types
├── utils/
│   ├── apiSecurity.ts        # Bearer-token validation for API routes
│   ├── appRouterSecurity.ts  # Security adapter for App Router handlers
│   ├── edmTrainTransformer.ts # API response → internal Event shape
│   ├── locationService.ts    # Location cookie management
│   └── searchFilter.ts       # Client-side event filtering logic
├── vercel.json               # Vercel deployment + redirects config
├── .copilot-instructions.md  # Root-level Copilot coding guidelines
└── .github/
    ├── copilot-instructions.md   # Additional Copilot architecture guidance
    └── workflows/
        └── copilot-setup-steps.yml  # CI setup for Copilot agents
```

### Key Relationships

- **Data flow**: External APIs → `edmTrainTransformer.ts` → internal `Event` type → components
- **Auth flow**: `middleware.ts` ↔ Supabase session ↔ `AppContext`
- **Security**: All non-whitelisted API routes → `appRouterSecurity.ts` → `apiSecurity.ts` → bearer-token check
- **Validation**: All external inputs → Zod schemas in `lib/validation/schemas.ts`

---

## 3. Environment Setup

```bash
# 1. Copy environment variables template
cp .env.example .env.local

# 2. Fill in all required keys in .env.local (see Section 19)

# 3. Install dependencies (use Yarn — never npm or pnpm)
yarn install

# 4. Start development server (Turbopack)
yarn dev        # http://localhost:3000
```

> **Note for agents**: Do not run `npm install` or any command that modifies `package.json`. Use `yarn add` / `yarn remove` only if a dependency change is explicitly required by the task. `npx tsc --noEmit` (type-checking without install) is always safe to run.

---

## 4. Development Commands

| Command             | Purpose                           |
| ------------------- | --------------------------------- |
| `yarn dev`          | Start dev server with Turbopack   |
| `yarn build`        | Production build                  |
| `yarn start`        | Start production server           |
| `yarn lint`         | Run ESLint                        |
| `yarn format`       | Format all files with Prettier    |
| `yarn format:check` | Check formatting without writing  |
| `npx tsc --noEmit`  | Type-check without emitting files |

Run `yarn lint` and `npx tsc --noEmit` after every non-trivial change before committing.

---

## 5. Agent Workflow

Follow this workflow for every task:

1. **Read before writing** — Explore relevant files to understand existing patterns before making any change. Check whether a component, hook, or utility already exists.
2. **Minimal changes** — Make the smallest change that fully addresses the requirement. Do not refactor unrelated code.
3. **One concern per commit** — Keep commits atomic and focused.
4. **Lint & type-check early** — Run `yarn lint` and `npx tsc --noEmit` before and after changes.
5. **Verify in browser** — For UI changes, confirm the result at `http://localhost:3000`.
6. **Security review** — Ensure no secrets are committed and no new vulnerabilities are introduced.
7. **Update docs** — If a change affects architecture, update the relevant section of this file or the inline JSDoc.

### Exploration Checklist (before editing)

- [ ] Does a component/utility with this behavior already exist?
- [ ] Does a Zod schema already validate this input shape?
- [ ] Does a ShadCN UI component satisfy this UI requirement?
- [ ] Is the relevant data already available in `AppContext`?
- [ ] Will this change affect API security (`FRONTEND_OPEN_ENDPOINTS`)?

---

## 6. Code Quality Standards

### Style Guide

- Follow the **Airbnb JavaScript Style Guide** strictly.
- Write self-documenting, production-ready code.
- Use **ES6+** features consistently.
- Prefer `const` over `let`; never use `var`.
- Use **arrow functions** for components and callbacks.
- **Destructure** props, state, and object returns.
- Use **template literals** for string interpolation.
- Always use **semicolons**.
- Use **2-space indentation**.
- Use **single quotes** for strings.

### Import Order

1. React and React-related imports
2. Next.js imports
3. Third-party libraries
4. Internal utilities and helpers
5. Components (general to specific)
6. Styles (if any)

### Documentation

- Use **JSDoc** for function and module documentation.
- Comment only complex logic and non-obvious business rules.
- Avoid obvious comments (`// increment counter`).
- Keep comments synchronized with code changes.
- Document component props and usage examples in JSDoc.

---

## 7. File & Naming Conventions

| Type                   | Convention                   | Example                       |
| ---------------------- | ---------------------------- | ----------------------------- |
| React component files  | PascalCase                   | `EventCard.tsx`               |
| Utility / helper files | camelCase                    | `searchFilter.ts`             |
| Next.js pages          | kebab-case or nested folders | `app/my-events/page.tsx`      |
| API route directories  | kebab-case                   | `app/api/get-events/route.ts` |
| Hooks                  | `use` prefix, camelCase      | `useEventFilter.ts`           |
| Context files          | PascalCase                   | `AppContext.tsx`              |
| Types/interfaces       | PascalCase                   | `EventCardProps`              |
| Constants              | SCREAMING_SNAKE_CASE         | `MAX_EVENTS_PER_PAGE`         |

---

## 8. TypeScript Guidelines

- TypeScript strict mode is enabled — respect all compiler constraints.
- Never use `any` unless absolutely unavoidable; prefer `unknown` and narrow with guards.
- Prefer `interface` for object shapes used as props or API contracts.
- Use `type` aliases for unions, intersections, and utility types.
- Import the `Database` type from `types/database.ts` for Supabase-typed operations.
- All Zod schemas live in `lib/validation/schemas.ts`; infer TypeScript types from them with `z.infer<>`.

---

## 9. React Component Guidelines

### Structure Template

```tsx
"use client"; // only for client components

import { useState, useEffect, useCallback } from "react";
// ... other imports following import order

interface MyComponentProps {
  events: Event[];
  onSelect: (id: string) => void;
}

const MyComponent = ({ events, onSelect }: MyComponentProps) => {
  // 1. Hooks (useState, useReducer, useContext, custom hooks)
  const [isLoading, setIsLoading] = useState(false);

  // 2. Derived / memoized values

  // 3. Event handlers (handle* prefix)
  const handleClick = useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect]
  );

  // 4. Effects
  useEffect(() => {
    // side effects here
  }, []);

  // 5. Render
  if (isLoading) return <LoadingSpinner />;

  return <section aria-label="My Component">{/* JSX */}</section>;
};

export default MyComponent;
```

### Rules

- Use **functional components with hooks only** — no class components.
- Keep components small and focused (**single responsibility principle**).
- Always handle **loading and error states** explicitly.
- Use **semantic HTML** elements (`<section>`, `<article>`, `<nav>`, `<header>`, `<main>`).
- Add **accessibility attributes** (`aria-label`, `alt`, `role`, keyboard navigation).
- Prefer **derived state** over storing redundant data.
- Use `React.memo()` for frequently re-rendered pure components.
- Use `useMemo()` and `useCallback()` for expensive computations and stable references.

### Context Usage

```tsx
const { currentUserLocation, setUserLocation, supabase, isLoggedIn } =
  useAppContext();
```

---

## 10. Styling Guidelines

### Tailwind CSS (required)

- **All new styling must use Tailwind utility classes** — never create new SCSS files.
- Follow **mobile-first responsive design**: default styles for mobile, add `sm:`, `md:`, `lg:`, `xl:` for larger breakpoints.
- Organize classes by category: layout → spacing → typography → colors → effects.
- Use `@layer components` for repeated multi-class patterns.
- Use `cn()` (from `lib/utils`) to merge conditional Tailwind classes cleanly.

### ShadCN UI

- Check ShadCN for a matching component **before** creating a custom one.
- Extend ShadCN components with brand colors; do not modify files under `components/ui/` directly — create wrapper components.
- Maintain design-system coherence across all components.

### Custom Colors

Use Tailwind tokens — e.g., `text-pink`, `bg-blue`, `border-border-grey` — not raw hex values.

---

## 11. Next.js Guidelines

### App Router Conventions

- Pages live in `app/[route]/page.tsx`.
- Server Components are the default — add `'use client'` only when the component uses browser APIs, event handlers, or React hooks.
- Layouts in `app/layout.tsx` provide global providers (themes, context).
- Dynamic routes use `[param]` folder names; async params are `Promise<{ param: string }>` in Next.js 15.

### Images

- Always use the **`next/image` `Image` component** for optimized images.
- Supply explicit `width` and `height` or use `fill` with a sized container.

### Performance

- Use `static generation` (`generateStaticParams`) where data does not change per request.
- Use **dynamic imports** (`next/dynamic`) for heavy or conditionally rendered components.
- API responses are cached for **6 hours** with `stale-while-revalidate`; respect this in any new fetch logic.
- Monitor and optimize bundle size.

### SEO

- Every page must export a `metadata` object or `generateMetadata` function.

---

## 12. Database & Supabase Patterns

### Client Usage

```typescript
// Client-side (React components, hooks)
import { supabase } from "@/features/Supabase";

// Admin operations (API routes ONLY — never in client components)
import { supabaseAdmin } from "@/features/Supabase";
```

### Rules

- **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in client-side code.
- Always use `supabase` (anon key) for user-scoped operations.
- Use `supabaseAdmin` only inside `app/api/` routes.
- All database operations must be wrapped in `try/catch`.
- Rely on **Row Level Security (RLS) policies** — do not bypass them with admin operations unless absolutely necessary.
- Use the generated `Database` type from `types/database.ts` for type-safe queries.

### Query Pattern

```typescript
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("user_id", userId);

if (error) {
  console.error("Database error:", error);
  throw error;
}
```

---

## 13. API Route Patterns

### File Location

All API routes live in `app/api/[endpoint]/route.ts`.

### Standard Route Template

```typescript
import { NextResponse } from "next/server";
import { secureAppRouterEndpoint } from "@/utils/appRouterSecurity";
import { mySchema } from "@/lib/validation/schemas";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 1. Security check
  const security = secureAppRouterEndpoint(request);
  if (!security.allowed) {
    return NextResponse.json({ error: security.error }, { status: 401 });
  }

  // 2. Parse & validate input
  const params = await context.params;
  const parsed = mySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // 3. Business logic
  try {
    const result = await doWork(parsed.data);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}
```

### Rules

- All non-public endpoints must call `secureAppRouterEndpoint` first.
- To open an endpoint to the frontend, add it to the `FRONTEND_OPEN_ENDPOINTS` array in `utils/apiSecurity.ts`.
- Validate and sanitize **all** inputs before use.
- Return appropriate HTTP status codes (`200`, `400`, `401`, `403`, `404`, `500`).
- Never expose raw database errors or stack traces in responses.
- Follow RESTful naming conventions.

---

## 14. Security Guidelines

- **Validate all user inputs** with Zod schemas before processing.
- **Sanitize data** before rendering to prevent XSS.
- Use **HTTPS** for all external API requests.
- Never commit secrets, API keys, or tokens — use `.env.local` only.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `API_ALLOWED_TOKENS` in client bundles.
- Implement proper **authentication** (`middleware.ts`) and **authorization** (RLS + bearer tokens).
- Rely on the existing bearer-token system (`apiSecurity.ts`) for all internal API-to-API calls.
- Review `vercel.json` redirects when adding new routes to ensure no unintended exposure.
- Monitor Vercel logs for `[API Security]` messages to detect unauthorized access attempts.

---

## 15. Error Handling Patterns

### API Routes

```typescript
try {
  const result = await apiCall();
  return NextResponse.json(result);
} catch (error: unknown) {
  console.error("Error:", error);
  return NextResponse.json(
    { error: "An error occurred processing your request" },
    { status: 500 }
  );
}
```

### Components

- Display loading spinners during async operations.
- Display user-friendly error messages (never raw error objects).
- Use error boundaries for critical subtrees.
- Log errors with `console.error` for debugging but never expose stack traces in the UI.

---

## 16. Performance Guidelines

- Use `React.memo()` for pure components that receive stable props.
- Use `useMemo()` for expensive computations; use `useCallback()` for stable function references.
- Avoid creating new objects or arrays inside render.
- Use **lazy loading** (`next/dynamic`) for heavy components not needed on initial render.
- Use the **`next/image` `Image` component** for all images.
- Tree-shake unused imports — avoid `import * as X`.
- Keep bundle size minimal — evaluate the cost of new dependencies before adding them.

---

## 17. Testing & Debugging

### Running Checks

```bash
yarn lint              # ESLint
npx tsc --noEmit       # TypeScript type checking
yarn build             # Full production build validation
```

### API Testing

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/endpoint
```

### Component Testing

- Use React Testing Library for component behavior tests.
- Test **behavior and user interactions**, not implementation details.
- Mock external dependencies (Supabase client, fetch calls).
- Test loading states, error states, and edge cases.
- Test keyboard navigation and accessibility.

### Build Troubleshooting

- Check TypeScript errors: `npx tsc --noEmit`
- Check for peer-dependency issues: review `yarn.lock` and `package.json`
- Security: monitor Vercel logs for `[API Security]` messages

---

## 18. Git & PR Workflow

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <short description>

feat(events): add genre filtering to EventsModule
fix(auth): handle expired Supabase session in middleware
docs(agents): update AGENTS.md with new API pattern
refactor(utils): extract location logic to locationService
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Rules

- Keep commits **atomic** — one logical change per commit.
- Write in **present tense** (`add`, not `added`).
- Reference issue numbers (`Fixes #42`) in the PR description.
- Never force-push to `main` or shared branches.

### Pull Request Process

1. Fill out the PR template completely.
2. Link the related issue.
3. Describe testing steps.
4. Attach screenshots for UI changes.
5. Ensure all checklist items in the PR template are satisfied.
6. Request review from at least one maintainer.

---

## 19. Environment Variables

All secrets live in `.env.local` (not committed). Copy `.env.example` to get started.

| Variable                              | Used in                  | Purpose                                                   |
| ------------------------------------- | ------------------------ | --------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`            | Client                   | Supabase project URL (public)                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | Client                   | Supabase public anon key                                  |
| `SUPABASE_URL`                        | Server (API routes) only | Supabase project URL for server-side calls                |
| `SUPABASE_ANON_KEY`                   | Server (API routes) only | Supabase anon key for server-side calls                   |
| `SUPABASE_SERVICE_ROLE_KEY`           | Server (API routes) only | Admin key — **never expose client-side**                  |
| `NEXT_PUBLIC_API_KEY_EDMTRAIN`        | Client                   | EDMTrain event data API key                               |
| `NEXT_PUBLIC_API_URL_EDMTRAIN`        | Client                   | EDMTrain events endpoint URL                              |
| `NEXT_PUBLIC_API_URL_EDMTRAIN_ARTIST` | Client                   | EDMTrain artists endpoint URL                             |
| `NEXT_PUBLIC_API_KEY_LASTFM`          | Client                   | LastFM artist metadata API key                            |
| `API_KEY_TICKETMASTER`                | Server                   | Ticketmaster event discovery API key                      |
| `API_KEY_SDHM`                        | Server                   | SDHM event data API key                                   |
| `API_URL_SDHM`                        | Server                   | SDHM API endpoint URL                                     |
| `API_ALLOWED_TOKENS`                  | Server                   | Comma-separated bearer tokens for internal API auth       |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`       | Client                   | hCaptcha public site key                                  |
| `HCAPTCHA_SECRET_KEY`                 | Server                   | hCaptcha secret key — **never expose client-side**        |
| `NEXT_PUBLIC_BASE_URL`                | Client + Server          | Canonical base URL (e.g. `https://www.grooverooster.com`) |

> **Agent rule**: Never hardcode any of these values. Always read from `process.env`. Never log their values.

---

## 20. Pre-Submission Checklist

- [ ] Existing code patterns were reviewed before writing new code
- [ ] No existing component, hook, or utility was unnecessarily duplicated
- [ ] Changes are minimal and focused on the stated requirement
- [ ] Follows Airbnb JavaScript Style Guide
- [ ] TypeScript strict mode: `npx tsc --noEmit` passes with no errors
- [ ] `yarn lint` passes with no errors or warnings
- [ ] All new/modified components are responsive (mobile-first)
- [ ] Accessibility attributes (`aria-*`, `alt`, `role`) are included
- [ ] Loading and error states are handled explicitly
- [ ] All user inputs are validated with Zod schemas
- [ ] API routes call `secureAppRouterEndpoint` before processing
- [ ] No secrets or environment variable values are committed
- [ ] No new SCSS files were created (Tailwind only)
- [ ] ShadCN components were checked before creating custom UI
- [ ] Existing functionality is not broken
- [ ] Console is free of errors and warnings
- [ ] UI changes have been verified in the browser at multiple screen sizes

---

## 21. Common Pitfalls

| Pitfall                               | Correct approach                                               |
| ------------------------------------- | -------------------------------------------------------------- |
| Creating new SCSS files               | Use Tailwind utility classes                                   |
| Using `npm install`                   | Use `yarn add`                                                 |
| Using `var`                           | Use `const` (or `let` if reassignment is needed)               |
| Hardcoding hex colors                 | Use Tailwind brand color tokens                                |
| Skipping PropTypes / TypeScript types | Always type all props and function signatures                  |
| Ignoring accessibility                | Add ARIA attributes and test keyboard navigation               |
| Bypassing Zod validation              | All inputs must be validated before use                        |
| Using `supabaseAdmin` in client code  | `supabaseAdmin` is for server/API routes only                  |
| Exposing secrets in client bundles    | Use server-only env vars for sensitive keys                    |
| Adding `'use client'` unnecessarily   | Default to Server Components; add directive only when required |
| Skipping security check in API routes | Always call `secureAppRouterEndpoint` first                    |
| Large, unfocused commits              | One logical change per commit                                  |
| Breaking existing tests               | Run the full lint + type-check suite before committing         |
