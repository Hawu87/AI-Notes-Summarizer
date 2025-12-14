import { NextRequest, NextResponse } from "next/server";
import { getSummaryByNoteId } from "@/lib/summaries";
import { createServerClient } from "@/lib/supabase/server";

/**
 * GET /api/summaries/[noteId]
 * 
 * Fetches a saved summary for a note.
 * 
 * Response:
 *   { summary: string, bullets: string[] } if found
 *   null if not found
 * 
 * Errors:
 *   - 400: Invalid noteId
 *   - 500: Database error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    // Check authentication
    const supabase = await createServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { noteId } = await params;

    if (!noteId || typeof noteId !== "string") {
      return NextResponse.json(
        { error: "Invalid noteId" },
        { status: 400 }
      );
    }

    // Verify note ownership (RLS will enforce this, but we check explicitly)
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .select("id, user_id")
      .eq("id", noteId)
      .single();

    if (noteError || !note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    if (note.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const summary = await getSummaryByNoteId(noteId);

    if (!summary) {
      return NextResponse.json(null);
    }

    // Return in the format expected by the frontend
    return NextResponse.json({
      summary: summary.summary_text,
      bullets: summary.bullet_points_json,
      updated_at: summary.updated_at,
      created_at: summary.created_at,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch summary",
      },
      { status: 500 }
    );
  }
}

