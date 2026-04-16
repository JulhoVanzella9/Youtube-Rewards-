import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const refCode = url.searchParams.get("ref");

  // If there's a referral code on home page, redirect to welcome page
  if (refCode && url.pathname === "/") {
    const welcomeUrl = new URL("/welcome", request.url);
    welcomeUrl.searchParams.set("ref", refCode);
    return NextResponse.redirect(welcomeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|icons/|apple-touch-icon|manifest.json|sw.js).*)"],
};
