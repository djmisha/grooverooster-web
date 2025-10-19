This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Prerequisites

- Node.js 20.0.0 or later (managed via Volta)
- Yarn 1.22.19 or npm

### Environment Variables

This application requires several environment variables to function properly. Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

- **Supabase Configuration:**
  - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
  - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)

- **HCaptcha Configuration:**
  - `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` - Your HCaptcha site key (get from https://dashboard.hcaptcha.com/)
  - `HCAPTCHA_SECRET_KEY` - Your HCaptcha secret key

- **API Keys:**
  - `NEXT_PUBLIC_API_KEY_EDMTRAIN` - EDM Train API key for music events
  - `NEXT_PUBLIC_API_KEY_LASTFM` - Last.fm API key for artist information
  - `API_KEY_TICKETMASTER` - Ticketmaster API key for event discovery
  - `API_KEY_SDHM` - SDHM API key
  - `API_URL_SDHM` - SDHM API URL

- **Authentication:**
  - `API_ALLOWED_TOKENS` - Comma-separated list of allowed bearer tokens

- **Application Configuration:**
  - `NEXT_PUBLIC_BASE_URL` - Your application's base URL (e.g., https://www.grooverooster.com)

See `.env.example` for a complete list with descriptions.

### Installation

Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Security

This application implements comprehensive security measures including:

- **Content Security Policy (CSP)** - Prevents XSS attacks
- **Security Headers** - X-Frame-Options, X-Content-Type-Options, etc.
- **Route Protection** - Authentication middleware for protected routes
- **Secure Cookies** - HttpOnly, Secure, SameSite flags
- **Bearer Token Authentication** - Strict token validation
- **Row Level Security** - Database-level access control (see `SUPABASE_RLS_POLICIES.md`)

For more details, see the comprehensive security scan report in `SECURITY_SCAN_REPORT.md`.

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable React components
- `/utils` - Utility functions and helpers
- `/lib` - Library code and configurations
- `/types` - TypeScript type definitions
- `/features` - Feature-specific code (e.g., Supabase client)
- `/public` - Static assets
- `/styles` - Global styles and CSS

## API Routes

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `app/api/hello/route.ts`.

The `app/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction).

## Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) to run pre-commit hooks that ensure code quality before commits are made.

### What runs on pre-commit:

1. **ESLint** - Checks for code quality and style issues
2. **Prettier** - Verifies code formatting
3. **TypeScript Compiler** - Type checks the codebase

All three checks must pass for a commit to succeed. If any check fails, the commit will be blocked and you'll need to fix the issues before committing.

### Manual checks:

You can run these checks manually at any time:

```bash
yarn lint          # Run ESLint
yarn format        # Format code with Prettier
yarn format:check  # Check formatting without modifying files
yarn tsc --noEmit  # Run TypeScript type checking
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
