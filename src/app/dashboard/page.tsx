// Reverted to demo-user baseline (no auth) — auth will be re-added later.
import { getNotesByUser, createNote } from "@/lib/notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateNoteForm } from "@/components/notes/create-note-form";
import { DashboardContainer } from "@/components/notes/dashboard-container";
import { revalidatePath } from "next/cache";

/**
 * Formats a date string into a readable format
 * Pre-computed on server to avoid passing functions to Client Components
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/**
 * Server Action: Creates a new note and revalidates the dashboard
 */
async function createNoteAction(formData: FormData) {
  "use server";
  
  const userId = "demo-user";
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  try {
    await createNote(userId, title.trim(), content.trim());
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create note",
    };
  }
}

/**
 * Dashboard page - displays all notes for the demo user
 * 
 * This is a Server Component that fetches notes from Supabase
 * and renders them in a 2-column grid layout.
 */
export default async function DashboardPage() {
  const userId = "demo-user";
  const notes = await getNotesByUser(userId);

  // Pre-format dates on server to avoid passing functions to Client Components
  const notesWithFormattedDates = notes.map((note) => ({
    ...note,
    created_at_formatted: formatDate(note.created_at),
  }));

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Your notes and summaries
          </p>
        </div>

        {/* Create Note Form */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Note</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateNoteForm createNoteAction={createNoteAction} />
            </CardContent>
          </Card>
        </div>

        {/* Notes List and Viewer */}
        <DashboardContainer notes={notesWithFormattedDates} />
      </div>
    </div>
  );
}

