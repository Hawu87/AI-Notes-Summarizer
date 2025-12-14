import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { upsertSummary } from "@/lib/summaries";
import { createServerClient } from "@/lib/supabase/server";

/**
 * POST /api/summarize
 * 
 * Generates an AI summary for a note and saves it to Supabase.
 * 
 * Request body:
 *   { noteId: string, content: string }
 * 
 * Response:
 *   { summary: string, bullets: string[] }
 * 
 * Errors:
 *   - 400: Invalid request body or validation failure
 *   - 500: OpenAI API error or database error
 */
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const { noteId, content } = body;

    if (!noteId || typeof noteId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing noteId" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing content" },
        { status: 400 }
      );
    }

    // Verify note ownership (RLS will enforce this, but we check explicitly for better error messages)
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
        { error: "Forbidden: You can only summarize your own notes" },
        { status: 403 }
      );
    }

    // Generate summary using OpenAI
    const prompt = `You are a helpful assistant that creates concise summaries of text.

Given the following text, create a summary with:
1. A 2-4 sentence paragraph summary
2. 3-5 key bullet points

Text to summarize:
${content}

Return your response as STRICT JSON only, with this exact format:
{
  "summary": "2-4 sentence paragraph here",
  "bullets": ["bullet point 1", "bullet point 2", "bullet point 3"]
}

Do not include any text outside the JSON. Return only valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini (gpt-4.1-mini doesn't exist)
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that returns only valid JSON. Never include markdown formatting or code blocks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    // Parse and validate OpenAI response
    let parsedResponse: { summary: string; bullets: string[] };
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON response from OpenAI" },
        { status: 500 }
      );
    }

    // Validate response structure
    if (!parsedResponse.summary || typeof parsedResponse.summary !== "string") {
      return NextResponse.json(
        { error: "Invalid summary in OpenAI response" },
        { status: 500 }
      );
    }

    if (
      !Array.isArray(parsedResponse.bullets) ||
      parsedResponse.bullets.length < 3 ||
      parsedResponse.bullets.length > 5
    ) {
      return NextResponse.json(
        {
          error: `Invalid bullets array: must contain 3-5 items, got ${parsedResponse.bullets?.length || 0}`,
        },
        { status: 500 }
      );
    }

    // Validate each bullet is a string
    if (!parsedResponse.bullets.every((bullet) => typeof bullet === "string")) {
      return NextResponse.json(
        { error: "All bullets must be strings" },
        { status: 500 }
      );
    }

    // Save to Supabase (upsert: create or update)
    const savedSummary = await upsertSummary(
      noteId,
      parsedResponse.summary,
      parsedResponse.bullets
    );

    // Return success response with timestamps
    return NextResponse.json({
      summary: parsedResponse.summary,
      bullets: parsedResponse.bullets,
      updated_at: savedSummary.updated_at,
      created_at: savedSummary.created_at,
    });
  } catch (error) {
    // Handle OpenAI API errors
    if (error instanceof Error && error.message.includes("OpenAI")) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: 500 }
      );
    }

    // Handle database errors
    if (error instanceof Error && error.message.includes("Failed to")) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

