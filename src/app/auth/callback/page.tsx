"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Client-side auth callback page
 * 
 * Handles the code exchange for email confirmation and OAuth.
 * The Supabase client automatically detects the code in the URL
 * and exchanges it for a session.
 */
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    async function handleCallback() {
      if (!code) {
        router.push("/login?error=no_code");
        return;
      }

      const supabase = createClient();
      
      // Exchange the code for a session
      // The client is configured with detectSessionInUrl: true,
      // so it should automatically handle this, but we'll do it explicitly
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error:", error);
        router.push(`/login?error=${encodeURIComponent(error.message)}`);
        return;
      }

      // Successfully authenticated, always redirect to login page
      // User will sign in on the login page after email verification
      router.push("/login");
      router.refresh();
    }

    handleCallback();
  }, [code, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

