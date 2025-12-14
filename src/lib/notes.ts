import { createServerClient } from "./supabase/server";

/**
 * Note type matching the Supabase schema
 */
export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
};

/**
 * Creates a new note in the database for the authenticated user
 * 
 * @param title - The note title
 * @param content - The note content/body
 * @returns The created note object, or null if creation failed
 * @throws Error if the database operation fails or user is not authenticated
 */
export async function createNote(
  title: string,
  content: string
): Promise<Note | null> {
  const supabase = await createServerClient();
  
  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // RLS will automatically enforce that user_id = auth.uid()
  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title,
      content,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create note: ${error.message}`);
  }

  return data;
}

/**
 * Fetches all notes for the authenticated user, ordered by creation date (newest first)
 * 
 * @returns Array of notes for the authenticated user, or empty array if none found
 * @throws Error if the database operation fails or user is not authenticated
 */
export async function getNotesByUser(): Promise<Note[]> {
  const supabase = await createServerClient();
  
  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // RLS will automatically filter to only the user's notes
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }

  return data || [];
}

/**
 * Deletes a note from the database
 * RLS ensures users can only delete their own notes
 * 
 * @param noteId - The note ID to delete
 * @throws Error if the database operation fails or user is not authenticated
 */
export async function deleteNote(noteId: string): Promise<void> {
  const supabase = await createServerClient();
  
  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // RLS will automatically enforce that only the owner can delete
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    throw new Error(`Failed to delete note: ${error.message}`);
  }
}

