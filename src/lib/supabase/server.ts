import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for use in Server Components and API routes
 * 
 * This client reads the session from cookies that are set by the browser client.
 * The browser client (src/lib/supabase/client.ts) stores the session in localStorage,
 * but we need to also set cookies for server-side access.
 * 
 * Note: For this to work, the browser client needs to sync session to cookies.
 * This is handled by a client-side effect that watches for auth state changes.
 * 
 * Usage:
 *   import { createServerClient } from "@/lib/supabase/server";
 *   const supabase = createServerClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
export async function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  // Try to get session from cookies
  // The SyncSession component sets a cookie named "sb-session"
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("sb-session");

  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      if (sessionData.access_token) {
        await supabase.auth.setSession({
          access_token: sessionData.access_token,
          refresh_token: sessionData.refresh_token,
        });
      }
    } catch {
      // If cookie parsing fails, continue without session
    }
  }

  return supabase;
}

/**
 * Get the authenticated user from the server
 * 
 * @returns The user ID if authenticated, null otherwise
 */
export async function getServerUser() {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch {
    return null;
  }
}

