import { supabase } from "./supabase";

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
 * Creates a new note in the database
 * 
 * @param userId - The user ID (placeholder string until auth is implemented)
 * @param title - The note title
 * @param content - The note content/body
 * @returns The created note object, or null if creation failed
 * @throws Error if the database operation fails
 */
export async function createNote(
  userId: string,
  title: string,
  content: string
): Promise<Note | null> {
  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: userId,
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
 * Fetches all notes for a given user, ordered by creation date (newest first)
 * 
 * @param userId - The user ID to fetch notes for
 * @returns Array of notes for the user, or empty array if none found
 * @throws Error if the database operation fails
 */
export async function getNotesByUser(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }

  return data || [];
}

/**
 * Deletes a note from the database
 * 
 * @param noteId - The note ID to delete
 * @throws Error if the database operation fails
 */
export async function deleteNote(noteId: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    throw new Error(`Failed to delete note: ${error.message}`);
  }
}

