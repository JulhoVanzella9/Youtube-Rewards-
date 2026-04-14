"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme/context";

export default function PaymentRequiredPage() {
  const [checking, setChecking] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  const handleCheckPayment = async () => {
    setChecking(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("has_paid")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.has_paid) {
        router.push("/");
        return;
      }

      // Check payments table
      const { data: payment } = await supabase
        .from("payments")
        .select("id")
        .eq("email", user.email?.toLowerCase() || "")
        .eq("status", "approved")
        .maybeSingle();

      if (payment) {
        // Update profile
        await supabase
          .from("profiles")
          .update({ has_paid: true, paid_at: new Date().toISOString() })
          .eq("id", user.id);
        router.push("/");
        return;
      }

      alert("Payment not found yet. If you just paid, please wait a few minutes and try again.");
    } catch {
      alert("Error checking payment status. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark
          ? "linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)"
          : "linear-gradient(180deg, #f8f8f8 0%, #ffffff 50%, #f0f0f0 100%)",
        padding: "20px",
        fontFamily: "'Roboto', Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "440px",
          width: "100%",
          textAlign: "center",
          padding: "40px 30px",
          borderRadius: "20px",
          background: isDark
            ? "rgba(26, 26, 46, 0.95)"
            : "rgba(255, 255, 255, 0.97)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          boxShadow: isDark
            ? "0 20px 60px rgba(0,0,0,0.5)"
            : "0 20px 60px rgba(0,0,0,0.08)",
        }}
      >
        {/* Lock Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF0000, #CC0000)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 8px 32px rgba(255,0,0,0.3)",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" fill="white" />
            <path
              d="M7 11V7a5 5 0 0110 0v4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16" r="1.5" fill="#CC0000" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: isDark ? "#fff" : "#0F0F0F",
            margin: "0 0 12px",
          }}
        >
          Payment Required
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
            margin: "0 0 8px",
            lineHeight: 1.6,
          }}
        >
          To access the platform, you need to complete your payment first.
        </p>

        {userEmail && (
          <p
            style={{
              fontSize: "13px",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
              margin: "0 0 32px",
            }}
          >
            Logged in as: <strong>{userEmail}</strong>
          </p>
        )}

        {/* Info box */}
        <div
          style={{
            background: isDark ? "rgba(255,0,0,0.08)" : "rgba(255,0,0,0.04)",
            border: `1px solid ${isDark ? "rgba(255,0,0,0.2)" : "rgba(255,0,0,0.15)"}`,
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            💡 If you already made your payment, click the button below to verify.
            It may take a few minutes for the payment to be processed.
          </p>
        </div>

        {/* Check Payment Button */}
        <button
          onClick={handleCheckPayment}
          disabled={checking}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: checking
              ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")
              : "linear-gradient(135deg, #FF0000, #CC0000)",
            color: checking ? (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)") : "#fff",
            fontSize: "16px",
            fontWeight: 600,
            cursor: checking ? "not-allowed" : "pointer",
            marginBottom: "12px",
            transition: "all 0.2s ease",
          }}
        >
          {checking ? "Checking..." : "I Already Paid - Verify"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
            background: "transparent",
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
