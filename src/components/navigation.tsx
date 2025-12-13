"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

/**
 * Top navigation bar component
 */
export function Navigation() {
  return (
    <nav className="absolute left-0 right-0 top-0 z-20 border-b border-zinc-200/50 bg-white/80 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-950/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo/App name */}
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          AI Note Summarizer
        </Link>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="#how">How it works</Link>
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">GitHub</span>
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

