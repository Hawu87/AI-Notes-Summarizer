"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client for use in Client Components
 * 
 * Uses browser cookies for session management.
 * 
 * Usage:
 *   import { createClient } from "@/lib/supabase/client";
 *   const supabase = createClient();
 *   await supabase.auth.signInWithPassword({ email, password });
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

