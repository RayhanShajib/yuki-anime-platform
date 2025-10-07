import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to /admin routes
  if (pathname.startsWith("/admin")) {

    console.log(`Admin route accessed: ${pathname}`);

    // Allow the request to continue - authentication is handled client-side
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all admin routes
     */
    "/admin/:path*",
  ],
};
