// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" || path === "/register" || path.startsWith("/api/auth");

  // Get the session token from cookies
  const sessionToken = request.cookies.get("session")?.value;

  // If the user is on a protected path and doesn't have a session token,
  // redirect them to the login page
  if (!isPublicPath && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    // You can optionally add the original URL as a redirect parameter
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is on a public path (like login) but has a valid session token,
  // redirect them to the dashboard
  if (isPublicPath && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
  // Apply to all routes except for static files, images, etc.
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/auth routes (to avoid redirect loops for authentication endpoints)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /images (common static files)
     */
    "/((?!_next|static|favicon.ico|images|api).*)",
  ],
};
