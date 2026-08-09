import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login"];
const PROTECTED_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("bmp_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = pathname.startsWith(PROTECTED_PREFIX);

  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
