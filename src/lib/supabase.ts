import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client configuration
 * 
 * This file initializes a Supabase client that can be safely used in both
 * server components (Server Components, API routes) and client components.
 * 
 * The client uses environment variables prefixed with NEXT_PUBLIC_ which
 * makes them available in both server and client environments.
 */

// Read Supabase configuration from environment variables
// These must be set in your .env.local file:
// NEXT_PUBLIC_SUPABASE_URL=your-project-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that required environment variables are present
if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

/**
 * Supabase client instance
 * 
 * This is a singleton client that can be imported and used throughout
 * the application in both server and client components.
 * 
 * Usage:
 *   import { supabase } from "@/lib/supabase";
 *   const { data, error } = await supabase.from("notes").select();
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // Optional: Add any additional Supabase client options here
  // For example, auth persistence settings, realtime options, etc.
});

