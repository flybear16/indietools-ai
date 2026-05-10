import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/signin") || 
                     req.nextUrl.pathname.startsWith("/api/auth");
  const isSubmitPage = req.nextUrl.pathname.startsWith("/submit");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // Allow auth pages and API routes
  if (isAuthPage || (isApiRoute && !isSubmitPage)) {
    return NextResponse.next();
  }

  // Protect submit page - redirect to signin if not logged in
  if (isSubmitPage && !isLoggedIn) {
    const signInUrl = new URL("/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/submit/:path*", "/signin/:path*", "/api/auth/:path*"],
};