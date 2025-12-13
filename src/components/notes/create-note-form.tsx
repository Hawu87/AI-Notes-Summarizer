"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type CreateNoteAction = (formData: FormData) => Promise<{ error?: string; success?: boolean }>;

interface CreateNoteFormProps {
  createNoteAction: CreateNoteAction;
}

/**
 * Client Component: Create Note Form
 * 
 * Handles form state and submission for creating new notes.
 * Uses React's useTransition for loading state management.
 */
export function CreateNoteForm({ createNoteAction }: CreateNoteFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await createNoteAction(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        // Reset form
        const form = document.getElementById("create-note-form") as HTMLFormElement;
        form?.reset();
        // Clear success message after 2 seconds
        setTimeout(() => setSuccess(false), 2000);
      }
    });
  }

  return (
    <form
      id="create-note-form"
      action={handleSubmit}
      className="flex h-full flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Enter note title"
          required
          disabled={isPending}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content
        </label>
        <Textarea
          id="content"
          name="content"
          placeholder="Enter note content"
          required
          disabled={isPending}
          className="flex-1 resize-none"
        />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
          Note created successfully!
        </div>
      )}

      <Button type="submit" disabled={isPending} className="mt-auto">
        {isPending ? "Saving..." : "Save Note"}
      </Button>
    </form>
  );
}

