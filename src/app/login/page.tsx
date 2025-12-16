"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Checks if user is already authenticated and redirects to dashboard if so
 * Also handles email verification code exchange if code is present in URL
 */
function HandleVerificationCode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();

      // If code is present, exchange it for a session
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Verification error:", error);
          // Stay on login page if code exchange fails
          return;
        }
        // Code exchanged successfully, user is now authenticated
      }

      // Check if user is already authenticated (either from code exchange or existing session)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is authenticated, redirect to dashboard
        window.location.href = "/dashboard";
      }
    }

    checkAuth();
  }, [code, router]);

  return null;
}

/**
 * Login page - email/password authentication
 * Also handles email verification code exchange if code is present in URL
 */
function LoginPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isLoading) {
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Verify session exists before proceeding
      if (!data.session) {
        throw new Error("No session returned from sign in");
      }

      // Immediately set cookie for server-side access
      // This ensures the dashboard server component can authenticate
      document.cookie = `sb-session=${JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })}; path=/; max-age=${data.session.expires_in || 3600}; SameSite=Lax`;

      // Use window.location.href for full page reload to ensure cookies are sent
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in"
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-zinc-600 dark:text-zinc-400">Loading...</div>
          </CardContent>
        </Card>
      </div>
    }>
      <HandleVerificationCode />
      <LoginPageContent />
    </Suspense>
  );
}

