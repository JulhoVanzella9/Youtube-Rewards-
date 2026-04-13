import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const REFERRAL_BONUS = 20; // $20 bonus for both referrer and referred user

export async function POST(request: Request) {
  try {
    const { referralCode, userId, newUserId } = await request.json();
    const actualUserId = userId || newUserId;
    
    if (!referralCode || !actualUserId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    // Find the referrer by their referral code
    const { data: referrer, error: referrerError } = await supabase
      .from("profiles")
      .select("id, referral_count, referral_earnings, balance")
      .eq("referral_code", referralCode.toUpperCase())
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Make sure user isn't referring themselves
    if (referrer.id === actualUserId) {
      return NextResponse.json({ error: "Cannot use your own referral code" }, { status: 400 });
    }

    // Check if this user was already referred
    const { data: existingReferral } = await supabase
      .from("referrals")
      .select("id")
      .eq("referred_user_id", actualUserId)
      .single();

    if (existingReferral) {
      return NextResponse.json({ error: "User already referred" }, { status: 400 });
    }

    // Create referral record
    const { error: referralError } = await supabase
      .from("referrals")
      .insert({
        referrer_id: referrer.id,
        referred_user_id: actualUserId,
        bonus_amount: REFERRAL_BONUS,
        status: "pending",
      });

    if (referralError) {
      console.error("Error creating referral:", referralError);
      return NextResponse.json({ error: "Failed to process referral" }, { status: 500 });
    }

    // Update the new user's profile with referred_by
    await supabase
      .from("profiles")
      .update({ referred_by: referrer.id })
      .eq("id", actualUserId);

    return NextResponse.json({ 
      success: true, 
      message: "Referral recorded! Bonus will be credited after first video rating.",
      bonus: REFERRAL_BONUS,
    });
  } catch (error) {
    console.error("Referral processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
