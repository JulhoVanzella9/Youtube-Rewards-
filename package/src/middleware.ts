import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Routes that don't require payment check
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

  // Check for authenticated user via Supabase cookie
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Get the auth token from cookies
  // Supabase stores auth in cookies with pattern sb-<ref>-auth-token
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

  if (!accessToken) {
    // No auth token - let the app layout handle redirect to login
    return NextResponse.next();
  }

  // Verify user and check payment status
  try {
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.next();
    }

    // Check if user has paid
    const { data: profile } = await supabase
      .from("profiles")
      .select("has_paid")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && profile.has_paid === true) {
      // User has paid - allow access
      return NextResponse.next();
    }

    // Check if there's an approved payment by email (user paid but profile not updated yet)
    const { data: payment } = await supabase
      .from("payments")
      .select("id")
      .eq("email", user.email?.toLowerCase() || "")
      .eq("status", "approved")
      .maybeSingle();

    if (payment) {
      // Payment exists but profile not updated - update it now
      await supabase
        .from("profiles")
        .update({ has_paid: true, paid_at: new Date().toISOString() })
        .eq("id", user.id);
      return NextResponse.next();
    }

    // User has NOT paid - redirect to payment required page
    const paymentUrl = new URL("/payment-required", request.url);
    return NextResponse.redirect(paymentUrl);
  } catch (error) {
    console.error("[Middleware] Payment check error:", error);
    // On error, allow access (don't block users due to a bug)
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|icons/|apple-touch-icon|manifest.json|sw.js).*)"],
};
