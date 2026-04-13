"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";
import { motion, AnimatePresence } from "framer-motion";
import ReferralWelcomePopup from "@/app/components/ReferralWelcomePopup";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password] = useState("myacess2026");
  const [step, setStep] = useState<"email" | "password">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getRedirectUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/auth/callback`;
    }
    return process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      : "/auth/callback";
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "email" && email) {
      setStep("password");
    } else if (step === "password") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const supabase = createClient();

    // First try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInData?.session) {
      // Login successful
      window.location.href = "/";
      return;
    }

    // If login fails, try to sign up (new user)
    if (signInError) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: email.split("@")[0],
            username: email.split("@")[0],
          },
        },
      });
      
      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Direct login after signup
        const savedReferralCode = localStorage.getItem("referralCode") || referralCode;
        if (savedReferralCode && data.user) {
          try {
            await fetch("/api/referral/process", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                referralCode: savedReferralCode,
                userId: data.user.id 
              }),
            });
            localStorage.removeItem("referralCode");
          } catch (err) {
            console.log("Referral process error:", err);
          }
        }
        window.location.href = "/";
      } else if (data.user && !data.session) {
        // Try to sign in after sign up
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (retryError) {
          setError(retryError.message);
        } else if (retryData?.session) {
          window.location.href = "/";
        }
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #0a0a1a 0%, #000000 50%, #0a0512 100%)",
        padding: "clamp(16px, 4vw, 24px)",
        paddingTop: "calc(clamp(16px, 4vw, 24px) + env(safe-area-inset-top, 0px))",
        paddingBottom: "calc(clamp(16px, 4vw, 24px) + env(safe-area-inset-bottom, 0px))",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute", top: "-10%", right: "-10%",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254,44,85,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "-10%", left: "-10%",
            width: "350px", height: "350px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,244,238,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: "100%", 
          maxWidth: "min(400px, calc(100vw - 32px))",
          background: "linear-gradient(145deg, rgba(26,26,46,0.98) 0%, rgba(18,18,30,0.99) 100%)",
          borderRadius: "clamp(18px, 5vw, 24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "clamp(24px, 6vw, 36px) clamp(20px, 5vw, 32px)",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px", position: "relative" }}>
          {step === "password" && (
            <button
              onClick={() => { setStep("email"); setError(""); }}
              style={{
                position: "absolute", left: 0,
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.6)", padding: "4px",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>
              Welcome to TikCash
            </h1>
          </div>
        </div>

        {/* Error/Success messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                padding: "12px 16px", borderRadius: "12px",
                background: "rgba(254,44,85,0.1)",
                border: "1px solid rgba(254,44,85,0.2)",
                color: "#fe2c55", fontSize: "13px", fontWeight: 500,
                marginBottom: "16px", textAlign: "center",
              }}
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                padding: "12px 16px", borderRadius: "12px",
                background: "rgba(37,244,238,0.1)",
                border: "1px solid rgba(37,244,238,0.2)",
                color: "#25f4ee", fontSize: "13px", fontWeight: 500,
                marginBottom: "16px", textAlign: "center",
              }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleContinue}>
          {/* Email input - always visible */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                borderRadius: "12px",
                border: focusedField === "email" ? "2px solid #fe2c55" : "2px solid rgba(255,255,255,0.12)",
                transition: "all 0.2s",
                overflow: "hidden",
                background: "rgba(0,0,0,0.4)",
              }}
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
                disabled={step === "password"}
                style={{
                  width: "100%", padding: "16px 18px", fontSize: "15px",
                  background: "transparent",
                  border: "none", color: "#fff", outline: "none", fontFamily: "inherit",
                  opacity: step === "password" ? 0.6 : 1,
                }}
              />
            </div>
          </div>

          {/* Password input - only in password step */}
          <AnimatePresence>
            {step === "password" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: "16px" }}
              >
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "8px", textAlign: "center" }}>
                  Default password (do not change):
                </p>
                <div
                  style={{
                    borderRadius: "12px",
                    border: focusedField === "password" ? "2px solid #fe2c55" : "2px solid rgba(255,255,255,0.12)",
                    transition: "all 0.2s",
                    overflow: "hidden",
                    background: "rgba(0,0,0,0.4)",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    minLength={6}
                    readOnly
                    style={{
                      width: "100%", padding: "16px 18px", fontSize: "15px",
                      background: "transparent",
                      border: "none", color: "#25f4ee", outline: "none", fontFamily: "inherit",
                      fontWeight: 600,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Continue button */}
          <button
            type="submit"
            disabled={loading || (step === "email" && !email) || (step === "password" && !password)}
            className="btn-3d btn-3d-primary btn-3d-full btn-3d-animated"
            style={{
              fontFamily: "inherit",
              marginBottom: "20px",
              opacity: loading || (step === "email" && !email) || (step === "password" && !password) ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </form>



        {/* Terms */}
        <p
          style={{
            textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.35)",
            lineHeight: 1.6,
          }}
        >
          {"By continuing, you agree to our "}
          <span style={{ color: "#fe2c55", fontWeight: 600 }}>Terms of Service</span>
          {" and acknowledge that you have read our "}
          <span style={{ fontWeight: 600, color: "#fff" }}>Privacy Policy</span>.
        </p>
      </motion.div>

      {/* Referral Welcome Popup */}
      <ReferralWelcomePopup referralCode={referralCode} />
    </div>
  );
}
