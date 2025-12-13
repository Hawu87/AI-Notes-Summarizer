import { createNote, getNotesByUser } from "@/lib/notes";
import { NextResponse } from "next/server";

/**
 * Temporary test route for verifying Supabase notes functionality
 * 
 * GET /api/dev-notes
 * 
 * - Uses hardcoded userId "demo-user"
 * - Creates a test note only if the user has no notes yet
 * - Returns all notes for the demo user with count
 */
export async function GET() {
  const userId = "demo-user";

  try {
    // First, check if user has any notes
    const existingNotes = await getNotesByUser(userId);

    // Create a test note only if user has no notes yet
    if (existingNotes.length === 0) {
      await createNote(
        userId,
        "Test Note",
        "This is a test note to verify Supabase."
      );
    }

    // Fetch all notes for the user
    const notes = await getNotesByUser(userId);

    // Return JSON response with count and notes
    return NextResponse.json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    // Handle errors gracefully
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

