"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Client component that syncs Supabase session to cookies for server-side access
 * 
 * This component watches for auth state changes and syncs the session to cookies
 * so that server components can access the authenticated user.
 */
export function SyncSession() {
  useEffect(() => {
    const supabase = createClient();

    // Get initial session and sync to cookies
    async function syncSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Set cookie with session data
        document.cookie = `sb-session=${JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        })}; path=/; max-age=${session.expires_in || 3600}; SameSite=Lax`;
      } else {
        // Clear cookie if no session
        document.cookie = "sb-session=; path=/; max-age=0";
      }
    }

    // Sync initial session
    syncSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      syncSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
