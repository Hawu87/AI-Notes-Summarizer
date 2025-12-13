"use client";

import { Settings, LayoutGrid, User } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Dashboard header component
 */
export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">AI Note Summarizer</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Recent notes</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Settings button */}
        <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
          <Settings className="h-5 w-5" />
        </Button>

        {/* Grid/Menu toggle button */}
        <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
          <LayoutGrid className="h-5 w-5" />
        </Button>

        {/* User avatar placeholder */}
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
          <User className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        </div>
      </div>
    </div>
  );
}

