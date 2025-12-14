"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SignOutButton } from "./sign-out-button";
import { Button } from "@/components/ui/button";

/**
 * Session indicator component
 * 
 * Shows the current user's email if signed in, or "Not signed in" if not.
 * This is a client-only component that checks the session.
 */
export function SessionIndicator() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email) {
        setEmail(session.user.email);
      } else {
        setEmail(null);
      }
      setIsLoading(false);
    }

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  if (email) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Signed in as: <span className="font-medium">{email}</span>
        </div>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="text-sm text-zinc-600 dark:text-zinc-400">
      Not signed in
    </div>
  );
}

