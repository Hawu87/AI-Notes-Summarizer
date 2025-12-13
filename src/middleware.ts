import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware disabled - reverted to demo-user baseline (no auth)
 * Auth will be re-added later.
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

