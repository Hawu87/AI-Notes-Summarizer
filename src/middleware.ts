import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware - currently a no-op pass-through
 * Route protection is handled at the page level (e.g., dashboard redirects to /login if not authenticated)
 */
export async function middleware(request: NextRequest) {
  // No-op: just pass through all requests without auth checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

