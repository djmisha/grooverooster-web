import { createBrowserClient } from "@supabase/ssr";
import type { Database, SupabaseClientType } from "@/types/database";

/**
 * Creates a Supabase browser client for use in React components
 * @returns {Object|null} Supabase browser client instance or null if environment variables are not configured
 */
export function createClient(): SupabaseClientType {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn(
      "Supabase environment variables not configured for browser client"
    );
    // Return a mock client during build
    return null as any;
  }

  const supabase = createBrowserClient<Database>(url, key);

  return supabase;
}
