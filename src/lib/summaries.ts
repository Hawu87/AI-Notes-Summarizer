import { createServerClient } from "./supabase/server";

/**
 * Summary type matching the Supabase schema
 */
export type Summary = {
  id: string;
  note_id: string;
  summary_text: string;
  bullet_points_json: string[]; // Stored as JSON in DB, parsed to array
  created_at: string;
  updated_at: string;
};

/**
 * Gets an existing summary for a note, if it exists
 * 
 * @param noteId - The note ID to get the summary for
 * @returns The summary object, or null if not found
 * @throws Error if the database operation fails
 */
export async function getSummaryByNoteId(noteId: string): Promise<Summary | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .eq("note_id", noteId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch summary: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  // Parse bullet_points_json from JSON string to array
  return {
    ...data,
    bullet_points_json: Array.isArray(data.bullet_points_json)
      ? data.bullet_points_json
      : JSON.parse(data.bullet_points_json || "[]"),
  };
}

/**
 * Creates or updates a summary for a note
 * 
 * If a summary already exists for the note, it will be updated.
 * Otherwise, a new summary will be created.
 * 
 * @param noteId - The note ID to create/update the summary for
 * @param summaryText - The summary text (2-4 sentences)
 * @param bulletPoints - Array of 3-5 bullet point strings
 * @returns The created or updated summary object
 * @throws Error if the database operation fails
 */
export async function upsertSummary(
  noteId: string,
  summaryText: string,
  bulletPoints: string[]
): Promise<Summary> {
  // Check if summary already exists
  const existingSummary = await getSummaryByNoteId(noteId);

  const summaryData = {
    note_id: noteId,
    summary_text: summaryText,
    bullet_points_json: bulletPoints, // Supabase will store as JSON
  };

  let data;
  let error;

  const supabase = await createServerClient();
  
  if (existingSummary) {
    // Update existing summary
    const { data: updateData, error: updateError } = await supabase
      .from("summaries")
      .update(summaryData)
      .eq("note_id", noteId)
      .select()
      .single();

    data = updateData;
    error = updateError;
  } else {
    // Create new summary
    const { data: insertData, error: insertError } = await supabase
      .from("summaries")
      .insert(summaryData)
      .select()
      .single();

    data = insertData;
    error = insertError;
  }

  if (error) {
    throw new Error(
      `Failed to ${existingSummary ? "update" : "create"} summary: ${error.message}`
    );
  }

  // Parse bullet_points_json from JSON string to array
  return {
    ...data,
    bullet_points_json: Array.isArray(data.bullet_points_json)
      ? data.bullet_points_json
      : JSON.parse(data.bullet_points_json || "[]"),
  };
}

