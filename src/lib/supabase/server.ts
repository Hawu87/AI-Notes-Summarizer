import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for use in Server Components, Server Actions, and API routes
 * 
 * Uses cookies for session management with SSR support.
 * 
 * Usage:
 *   import { createClient } from "@/lib/supabase/server";
 *   const supabase = createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // cookies() returns ReadonlyRequestCookies which has getAll() directly
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          try {
            // Call cookies() fresh to get the cookie store, then use set() for each cookie
            const cookieStore = cookies();
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

