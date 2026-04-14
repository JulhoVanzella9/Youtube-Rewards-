"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReferralWelcomePopupProps {
  referralCode?: string | null;
}

export default function ReferralWelcomePopup({ referralCode }: ReferralWelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // ONLY show popup if referralCode is passed directly from URL (not from localStorage)
    // This ensures the popup only appears when someone clicks an actual referral link
    if (referralCode && !hasShown) {
      // Store the code for later use
      localStorage.setItem("referral_code", referralCode);
      
      // Check if we've already shown the popup this session
      const shownThisSession = sessionStorage.getItem("referral_popup_shown");
      if (!shownThisSession) {
        setTimeout(() => setIsOpen(true), 500);
        sessionStorage.setItem("referral_popup_shown", "true");
        setHasShown(true);
      }
    }
  }, [referralCode, hasShown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(145deg, #1a1a1a 0%, #0f0f1a 100%)",
              borderRadius: "24px",
              padding: "32px 24px",
              maxWidth: "360px",
              width: "100%",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255,255,255,0.1)",
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

            {/* Celebration icon */}
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                fontSize: "64px",
                marginBottom: "20px",
              }}
            >
              🎉
            </motion.div>

            {/* Title */}
            <h2 style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "8px",
            }}>
              You&apos;re Invited!
            </h2>

            <p style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.6)",
              marginBottom: "24px",
              lineHeight: 1.5,
            }}>
              A friend invited you to join the YouCash Program
            </p>

            {/* Bonus card */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              style={{
                background: "linear-gradient(135deg, rgba(255,0,0,0.15) 0%, rgba(255,0,0,0.15) 100%)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "20px",
                border: "1px solid rgba(255,0,0,0.2)",
              }}
            >
              <div style={{
                fontSize: "12px",
                color: "#282828",
                fontWeight: 600,
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}>
                Welcome Bonus
              </div>
              <div style={{
                fontSize: "40px",
                fontWeight: 800,
                color: "#fff",
                textShadow: "0 0 30px rgba(255,0,0,0.5)",
              }}>
                $20.00
              </div>
              <div style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.5)",
                marginTop: "4px",
              }}>
                Complete your first video rating to claim
              </div>
            </motion.div>

            {/* Benefits */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "24px",
              textAlign: "left",
            }}>
              {[
                { icon: "💰", text: "Earn money rating videos" },
                { icon: "🎓", text: "Access exclusive tutorials" },
                { icon: "💸", text: "Withdraw via PayPal or Pix" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{item.icon}</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsOpen(false)}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(255,0,0,0.4)",
              }}
            >
              Let&apos;s Start Earning!
            </motion.button>

            <p style={{
              marginTop: "16px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
            }}>
              Create an account to claim your bonus
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
