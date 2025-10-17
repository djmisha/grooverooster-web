/**
 * Supabase client configuration and initialization
 * Creates both regular and admin Supabase client instances
 */
import { createClient } from "@supabase/supabase-js";
import type { Database, SupabaseClientType } from "../types/database";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClientType | null;
let supabaseAdmin: SupabaseClientType | null;

// Only create clients if environment variables are available
if (supabaseUrl && supabaseKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseKey);
} else {
  console.warn("Supabase environment variables not configured");
  supabase = null;
}

// Create a Supabase admin client with service role key
if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  console.warn("Supabase admin environment variables not configured");
  supabaseAdmin = null;
}

export default supabase;
export { supabaseAdmin };
