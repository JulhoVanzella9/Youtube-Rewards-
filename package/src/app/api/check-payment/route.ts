import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ paid: false });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // Check payments table for approved payment
    const { data: payment } = await supabase
      .from("payments")
      .select("id")
      .eq("email", normalizedEmail)
      .in("status", ["approved", "completed", "paid", "active"])
      .limit(1)
      .single();

    if (payment) {
      return NextResponse.json({ paid: true });
    }

    // Also check profiles table in case has_paid was set manually
    const { data: profile } = await supabase
      .from("profiles")
      .select("has_paid")
      .eq("email", normalizedEmail)
      .eq("has_paid", true)
      .limit(1)
      .single();

    if (profile) {
      return NextResponse.json({ paid: true });
    }

    return NextResponse.json({ paid: false });
  } catch {
    return NextResponse.json({ paid: false });
  }
}
