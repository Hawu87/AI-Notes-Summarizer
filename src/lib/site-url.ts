/**
 * Get the base URL for the application
 * 
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL (explicitly set)
 * 2. VERCEL_URL (automatically set by Vercel, may not include protocol)
 * 3. http://localhost:3000 (fallback for local development)
 * 
 * @returns The base URL without trailing slash (e.g., "https://myapp.vercel.app")
 */
export function getSiteUrl(): string {
  // Explicit site URL takes priority
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  // Vercel automatically sets VERCEL_URL (without protocol)
  if (process.env.VERCEL_URL) {
    const vercelUrl = process.env.VERCEL_URL.replace(/\/$/, "");
    // VERCEL_URL doesn't include protocol, so add https
    return `https://${vercelUrl}`;
  }

  // Fallback to localhost for local development
  return "http://localhost:3000";
}

