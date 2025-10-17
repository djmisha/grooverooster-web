import { createClient as createClientPrimitive } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for static props (server-side)
 * @returns {Object} Supabase client instance
 */
export function createClient() {
  const supabase = createClientPrimitive(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  return supabase;
}
