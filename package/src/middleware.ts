import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const PUBLIC_ROUTES = [
  "/login",
  "/welcome",
  "/auth",
  "/api",
  "/payment-required",
  "/refund",
  "/_next",
  "/favicon",
  "/icon",
  "/manifest",
  "/sw.js",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const refCode = url.searchParams.get("ref");

  // If there's a referral code on home page, redirect to welcome page
  if (refCode && url.pathname === "/") {
    const welcomeUrl = new URL("/welcome", request.url);
    welcomeUrl.searchParams.set("ref", refCode);
    return NextResponse.redirect(welcomeUrl);
  }

  // Skip payment check for public routes
  if (isPublicRoute(url.pathname)) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const cookies = request.cookies;
  let accessToken: string | null = null;

  const allCookies = cookies.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.includes("auth-token")) {
      try {
        const parsed = JSON.parse(cookie.value);
        accessToken = parsed?.access_token || parsed?.[0]?.access_token || null;
      } catch {
        accessToken = cookie.value;
      }
      break;
    }
  }

  // No auth = let the app handle login redirect
  if (!accessToken) {
    return NextResponse.next();
  }

  try {
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.next();
    }

    // Check profiles.has_paid
    const { data: profile } = await supabase
      .from("profiles")
      .select("has_paid")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.has_paid === true) {
      return NextResponse.next();
    }

    // Check payments table by email
    const { data: payment } = await supabase
      .from("payments")
      .select("id")
      .eq("email", (user.email || "").toLowerCase())
      .in("status", ["approved", "completed", "paid", "active"])
      .maybeSingle();

    if (payment) {
      // Payment found — update profile so next request is faster
      await supabase
        .from("profiles")
        .update({ has_paid: true, paid_at: new Date().toISOString() })
        .eq("id", user.id);
      return NextResponse.next();
    }

    // Not paid — redirect
    return NextResponse.redirect(new URL("/payment-required", request.url));
  } catch (error) {
    console.error("[Middleware] Payment check error:", error);
    // On error, allow access to avoid blocking users
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|icons/|apple-touch-icon|manifest.json|sw.js).*)"],
};
