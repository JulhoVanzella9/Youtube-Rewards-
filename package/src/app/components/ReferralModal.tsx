"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadReferralData();
    }
  }, [isOpen]);

  const loadReferralData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code, referral_count, referral_earnings")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        setReferralCode(profile.referral_code || "");
        setReferralCount(profile.referral_count || 0);
        setReferralEarnings(profile.referral_earnings || 0);
      }
    }
    setLoading(false);
  };

  const copyToClipboard = async () => {
    const shareUrl = `${window.location.origin}/invite/${referralCode}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    const shareUrl = `${window.location.origin}/invite/${referralCode}`;
    const shareData = {
      title: "YouCash - Exclusive Invitation",
      text: "You've been invited to join YouCash! Start earning money by rating videos:",
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(180deg, #1a1a1a 0%, #0f0f1a 100%)",
            borderRadius: "24px",
            padding: "28px",
            width: "100%",
            maxWidth: "400px",
            border: "1px solid rgba(255,255,255,0.08)",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.05)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #FF0000 0%, #ff6b8a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 32px rgba(255,0,0,0.3)",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
              Invite Friends & Earn
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              Share your referral link and earn <span style={{ color: "#282828", fontWeight: 700 }}>$20.00</span> for each friend who joins!
            </p>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "24px",
          }}>
            <div style={{
              background: "rgba(255,0,0,0.1)",
              borderRadius: "16px",
              padding: "16px",
              textAlign: "center",
              border: "1px solid rgba(255,0,0,0.2)",
            }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#282828" }}>
                {loading ? "..." : referralCount}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
                Friends Invited
              </div>
            </div>
            <div style={{
              background: "rgba(255,0,0,0.1)",
              borderRadius: "16px",
              padding: "16px",
              textAlign: "center",
              border: "1px solid rgba(255,0,0,0.2)",
            }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#FF0000" }}>
                ${loading ? "..." : referralEarnings.toFixed(2)}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
                Total Earned
              </div>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={shareLink}
            className="btn-3d btn-3d-primary btn-3d-full btn-3d-lg"
            style={{
              fontFamily: "inherit",
              gap: "10px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share Referral Link
          </button>

          {/* How it works */}
          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
              HOW IT WORKS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { num: "1", text: "Share your unique invitation link" },
                { num: "2", text: "Friend activates their premium account" },
                { num: "3", text: "You both earn $20.00 commission!" },
              ].map((step) => (
                <div key={step.num} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "rgba(255,0,0,0.2)",
                    color: "#FF0000",
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {step.num}
                  </div>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
