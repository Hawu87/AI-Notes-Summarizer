import { NextRequest, NextResponse } from "next/server";
import { getSummaryByNoteId } from "@/lib/summaries";

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
    const { noteId } = await params;

    if (!noteId || typeof noteId !== "string") {
      return NextResponse.json(
        { error: "Invalid noteId" },
        { status: 400 }
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

