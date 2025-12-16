/**
 * Auth redirect path constant
 * After email verification, users are redirected to the login page
 */
export const AUTH_REDIRECT_PATH = "/login";

/**
 * Auth callback path for handling email verification code exchange
 * This is where Supabase redirects after email verification
 */
export const AUTH_CALLBACK_PATH = "/auth/callback";

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

/**
 * Get the auth redirect URL for email verification
 * 
 * This is the URL that Supabase will redirect to after email verification.
 * After email verification, users must ALWAYS land on the login page.
 * 
 * This function throws an error if NEXT_PUBLIC_SITE_URL is not set,
 * ensuring that auth redirects NEVER point to localhost.
 * 
 * @returns The full redirect URL (e.g., "https://myapp.vercel.app/login")
 * @throws Error if NEXT_PUBLIC_SITE_URL is not set
 */
export function getAuthRedirectUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL environment variable is required for authentication redirects. " +
      "Please set it to your production domain (e.g., https://your-app.vercel.app)"
    );
  }

  const baseUrl = siteUrl.replace(/\/$/, "");
  return `${baseUrl}${AUTH_REDIRECT_PATH}`;
}

