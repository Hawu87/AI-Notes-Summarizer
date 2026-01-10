"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAuthRedirectUrl } from "@/lib/site-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Sign up page - email/password registration
 */
export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      
      // Try to get auth redirect URL, but don't fail signup if it's missing
      // We'll only use it if signup succeeds
      let authRedirectUrl: string | null = null;
      try {
        authRedirectUrl = getAuthRedirectUrl();
      } catch (redirectError) {
        // If redirect URL can't be generated, we'll still attempt signup
        // but won't include the redirect option
        console.warn("Auth redirect URL not available:", redirectError);
      }

      // Attempt signup - handle existing user errors gracefully
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: authRedirectUrl ? {
          emailRedirectTo: authRedirectUrl,
        } : undefined,
      });

      // Handle signup errors - check for existing user specifically
      if (signUpError) {
        // Check if error indicates user already exists
        // Supabase returns various messages/codes for existing users:
        // - "User already registered"
        // - "A user with this email address has already been registered"
        // - "email_address_not_authorized" (when email is already in use)
        // - Error status codes related to duplicate users
        const errorMessage = (signUpError.message || "").toLowerCase();
        const errorCode = (signUpError.status || "").toString().toLowerCase();
        
        // Detect existing user errors
        const isExistingUserError = 
          errorMessage.includes("already registered") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("email address has already been registered") ||
          errorMessage.includes("user with this email") ||
          errorCode.includes("user_already_registered") ||
          errorCode.includes("email_address_not_authorized");
        
        if (isExistingUserError) {
          setError("An account with this email already exists. Try logging in instead.");
          setIsLoading(false);
          return;
        }
        
        // For other errors, show the actual error message (but filter out env var errors)
        const displayMessage = signUpError.message || "Failed to sign up";
        if (displayMessage.includes("NEXT_PUBLIC_SITE_URL") || displayMessage.includes("environment variable")) {
          setError("Unable to complete signup. Please try again later.");
        } else {
          setError(displayMessage);
        }
        setIsLoading(false);
        return;
      }

      // Check if email confirmation is required
      // If user exists but no session, email confirmation is enabled
      if (data.user && !data.session) {
        // Email confirmation required
        setError(null);
        setSuccess(true);
        return;
      }

      // If session exists (email confirmation disabled), user is automatically signed in
      // This should not happen in production with email confirmation enabled
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      // Handle any other errors that might occur
      // Filter out environment variable errors - these shouldn't be shown to users
      const errorMessage = err instanceof Error ? err.message : "Failed to sign up";
      
      // Don't show technical environment variable errors to users
      if (errorMessage.includes("NEXT_PUBLIC_SITE_URL") || errorMessage.includes("environment variable")) {
        setError("Unable to complete signup. Please try again later.");
      } else {
        setError(errorMessage);
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
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
                minLength={6}
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Password must be at least 6 characters
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                Check your email to verify your account
              </div>
            )}

            <Button type="submit" disabled={isLoading || success} className="w-full">
              {isLoading ? "Signing up..." : success ? "Check your email" : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

