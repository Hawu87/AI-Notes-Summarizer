import { redirect } from "next/navigation";
import { getNotesByUser, createNote, deleteNote } from "@/lib/notes";
import { getServerUser } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/notes/dashboard-header";
import { DashboardGridContainer } from "@/components/notes/dashboard-grid-container";
import { revalidatePath } from "next/cache";

/**
 * Formats a date string into a readable format for grid view
 * Pre-computed on server to avoid passing functions to Client Components
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  }).format(date);
}

/**
 * Server Action: Creates a new note and revalidates the dashboard
 */
async function createNoteAction(formData: FormData) {
  "use server";
  
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  try {
    await createNote(title.trim(), content.trim());
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create note",
    };
  }
}

/**
 * Server Action: Deletes a note and revalidates the dashboard
 */
async function deleteNoteAction(noteId: string) {
  "use server";
  
  try {
    await deleteNote(noteId);
    revalidatePath("/dashboard");
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete note"
    );
  }
}

/**
 * Dashboard page - displays all notes for the authenticated user
 * 
 * This is a Server Component that fetches notes from Supabase.
 * RLS ensures users only see their own notes.
 */
export default async function DashboardPage() {
  // Check if user is authenticated
  const userId = await getServerUser();
  
  if (!userId) {
    redirect("/login");
  }

  // Fetch notes (RLS will automatically filter to user's notes)
  const notes = await getNotesByUser();

  // Pre-format dates on server to avoid passing functions to Client Components
  const notesWithFormattedDates = notes.map((note) => ({
    ...note,
    created_at_formatted: formatDate(note.created_at),
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* Notes Grid */}
        <div className="mt-8">
          <DashboardGridContainer
            notes={notesWithFormattedDates}
            createNoteAction={createNoteAction}
            deleteNoteAction={deleteNoteAction}
          />
        </div>
      </div>
    </div>
  );
}

