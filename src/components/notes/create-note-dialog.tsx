"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CreateNoteAction = (formData: FormData) => Promise<{ error?: string; success?: boolean }>;

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createNoteAction: CreateNoteAction;
}

/**
 * Client Component: Create Note Dialog
 * 
 * Modal dialog for creating new notes.
 */
export function CreateNoteDialog({
  open,
  onOpenChange,
  createNoteAction,
}: CreateNoteDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsPending(true);

    // Capture form element synchronously before async operation
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createNoteAction(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(true);
      // Use captured form reference to safely reset
      form.reset();
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 1000);
    }

    setIsPending(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
          <CardTitle className="text-zinc-900 dark:text-zinc-50">Create Note</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter note title"
                required
                disabled={isPending}
                className="border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            <div>
              <label htmlFor="content" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Content
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter note content"
                required
                disabled={isPending}
                className="min-h-[120px] border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-400">
                Note created successfully!
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="flex-1 border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Saving..." : "Create Note"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

