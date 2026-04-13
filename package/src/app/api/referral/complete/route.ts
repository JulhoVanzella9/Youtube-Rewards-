import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const REFERRAL_BONUS = 20;

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const supabase = await createClient();

    // Find pending referral for this user
    const { data: referral, error: referralError } = await supabase
      .from("referrals")
      .select("*, referrer:profiles!referrer_id(id, balance, referral_count, referral_earnings)")
      .eq("referred_user_id", userId)
      .eq("status", "pending")
      .single();

    if (referralError || !referral) {
      // No pending referral, that's okay
      return NextResponse.json({ success: true, message: "No pending referral" });
    }

    // Update referral status to completed
    await supabase
      .from("referrals")
      .update({ 
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", referral.id);

    // Credit bonus to referrer
    const referrerData = referral.referrer as { id: string; balance: number; referral_count: number; referral_earnings: number };
    await supabase
      .from("profiles")
      .update({
        balance: (referrerData.balance || 0) + REFERRAL_BONUS,
        referral_count: (referrerData.referral_count || 0) + 1,
        referral_earnings: (referrerData.referral_earnings || 0) + REFERRAL_BONUS,
      })
      .eq("id", referrerData.id);

    // Credit bonus to referred user
    const { data: referredUser } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    await supabase
      .from("profiles")
      .update({
        balance: (referredUser?.balance || 0) + REFERRAL_BONUS,
      })
      .eq("id", userId);

    return NextResponse.json({ 
      success: true, 
      message: "Referral bonus credited!",
      bonus: REFERRAL_BONUS,
    });
  } catch (error) {
    console.error("Referral completion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
