"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type Summary = {
  summary: string;
  bullets: string[];
  updated_at?: string;
  created_at?: string;
};

interface NoteViewerProps {
  selectedNote: Note | null;
  onBack?: () => void;
}

/**
 * Formats a timestamp into a human-friendly relative time or date
 * Formats dates in the client component (no function props from server)
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "just now";
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  } else {
    // Format as date for older summaries
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    }).format(date);
  }
}

/**
 * Client Component: Note Viewer Panel
 * 
 * Displays selected note details and handles AI summarization.
 * Handles all client-side interactivity for viewing and summarizing notes.
 */
export function NoteViewer({ selectedNote, onBack }: NoteViewerProps) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  // Load saved summary when a note is selected
  useEffect(() => {
    async function loadSummary() {
      if (!selectedNote) {
        setSummary(null);
        return;
      }

      setIsLoadingSummary(true);
      setError(null);

      try {
        const response = await fetch(`/api/summaries/${selectedNote.id}`);

        if (!response.ok) {
          // If error, no summary exists (not a critical error)
          setSummary(null);
          return;
        }

        const data = await response.json();
        // If null, no summary exists; otherwise set the summary
        setSummary(data);
      } catch (err) {
        // Silently handle errors when loading summary (don't show error for missing summaries)
        setSummary(null);
      } finally {
        setIsLoadingSummary(false);
      }
    }

    loadSummary();
  }, [selectedNote]);

  async function handleSummarize() {
    if (!selectedNote) return;

    // If summary exists, show confirmation first
    if (summary && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowConfirm(false);
    // Keep old summary visible while generating new one

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          noteId: selectedNote.id,
          content: selectedNote.content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to summarize note");
      }

      const data = await response.json();
      // Replace old summary with new one (includes timestamps from API)
      setSummary(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!selectedNote) {
    return null;
  }

  // Check if content is long (more than ~16 lines)
  const contentLines = selectedNote.content.split('\n').length;
  const isLongContent = contentLines > 16 || selectedNote.content.length > 800;
  const shouldShowToggle = isLongContent;

  return (
    <Card className="flex max-h-[85vh] flex-col border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Sticky Header */}
      <CardHeader className="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-2 -ml-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <CardTitle className="break-words text-zinc-900 dark:text-zinc-50">{selectedNote.title}</CardTitle>
      </CardHeader>

      {/* Sticky Actions Section */}
      <div className="flex-shrink-0 border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-6">
        {/* Summary Status */}
        {summary && !isLoadingSummary && (
          <div className="mb-4 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-medium">Summarized</span>
            <span>•</span>
            <span>
              {formatTimestamp(
                summary.updated_at || summary.created_at || new Date().toISOString()
              )}
            </span>
          </div>
        )}

        {/* Summarize Button */}
        <div className="space-y-2">
          {showConfirm ? (
            <div className="space-y-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                Overwrite summary?
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleSummarize}
                  disabled={isLoading}
                  size="sm"
                  variant="default"
                  className="flex-1"
                >
                  {isLoading ? "Summarizing..." : "Confirm"}
                </Button>
                <Button
                  onClick={() => setShowConfirm(false)}
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button
                onClick={handleSummarize}
                disabled={isLoading || isLoadingSummary}
                className="w-full"
              >
                {isLoading
                  ? "Summarizing..."
                  : summary
                    ? "Re-summarize"
                    : "Summarize with AI"}
              </Button>
              {summary && !isLoading && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  This will overwrite the existing summary.
                </p>
              )}
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Scrollable Content Area */}
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
        {/* Note Content */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-400">
            Content
          </h3>
          <div className="relative">
            <p
              className={cn(
                "whitespace-pre-wrap break-words text-sm text-zinc-900 dark:text-zinc-300",
                shouldShowToggle && !isContentExpanded && "line-clamp-[16]"
              )}
            >
              {selectedNote.content}
            </p>
            {shouldShowToggle && (
              <button
                onClick={() => setIsContentExpanded(!isContentExpanded)}
                className="mt-2 text-sm font-medium text-primary hover:underline"
              >
                {isContentExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoadingSummary && !summary && (
          <>
            <Separator />
            <div className="space-y-4">
              <div>
                <div className="mb-2 h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
              <div>
                <div className="mb-2 h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2 pl-5">
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Summary Results */}
        {summary && (
          <>
            <Separator />
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-400">
                  Summary
                </h3>
                <p className="break-words text-sm text-zinc-900 dark:text-zinc-300">
                  {summary.summary}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-400">
                  Key Points
                </h3>
                <ul className="list-disc space-y-1 break-words pl-5 text-sm text-zinc-900 dark:text-zinc-300">
                  {summary.bullets.map((bullet, index) => (
                    <li key={index} className="break-words">{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

