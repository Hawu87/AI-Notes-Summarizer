"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/**
 * Sign out button component
 * 
 * Handles user sign out and redirects to login page.
 */
export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button onClick={handleSignOut} variant="outline" size="sm">
      Sign Out
    </Button>
  );
}

