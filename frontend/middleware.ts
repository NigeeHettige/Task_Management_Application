import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/dashboard", "/tasks"];
  const publicRoutes = ["/"]; // / is the login page

  // Get the refreshToken cookie
  const cookie = request.cookies.get("refreshToken");

  // Redirect authenticated users away from / (login page)
  if (pathname === "/" && cookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (protectedRoutes.includes(pathname)) {
    if (!cookie) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to / (login page)
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};