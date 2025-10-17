import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase browser client for use in React components
 * @returns {Object|null} Supabase browser client instance or null if environment variables are not configured
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn(
      "Supabase environment variables not configured for browser client"
    );
    // Return a mock client during build
    return null as any;
  }

  const supabase = createBrowserClient(url, key);

  return supabase;
}
