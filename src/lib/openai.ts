import OpenAI from "openai";

// OpenAI client for server-side use only
// OPENAI_API_KEY is server-only (no NEXT_PUBLIC_ prefix)
// Only import in API routes, Server Components, or Server Actions

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
  apiKey,
});
