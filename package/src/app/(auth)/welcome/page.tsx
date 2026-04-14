"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import ParticleField from "@/app/components/ParticleField";

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");
  const [referrerName] = useState("Your Friend");

  useEffect(() => {
    if (refCode) {
      localStorage.setItem("referral_code", refCode);
    }
  }, [refCode]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      paddingBottom: "40px",
      background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a1a 50%, #0a0a0f 100%)",
      overflowX: "hidden",
    }}>
      {/* Particle Background */}
      <ParticleField 
        particleCount={30}
        interactive={false}
        className="gpu-accelerated"
      />
      
      {/* Animated gradient orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "5%",
            left: "5%",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254,44,85,0.25) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "0%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,244,238,0.2) 0%, transparent 60%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          maxWidth: "400px",
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        {/* YouCash Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #282828 0%, #FF0000 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 12px 40px rgba(254,44,85,0.3), 0 8px 20px rgba(37,244,238,0.2)",
          }}
        >
          <svg width="36" height="26" viewBox="0 0 68 48" fill="none">
            <path d="M66.52 7.74C65.72 4.64 63.28 2.2 60.18 1.4C54.9 0 34 0 34 0S13.1 0 7.82 1.4C4.72 2.2 2.28 4.64 1.48 7.74C0 13.02 0 24 0 24S0 34.98 1.48 40.26C2.28 43.36 4.72 45.8 7.82 46.6C13.1 48 34 48 34 48S54.9 48 60.18 46.6C63.28 45.8 65.72 43.36 66.52 40.26C68 34.98 68 24 68 24S68 13.02 66.52 7.74Z" fill="#FF0000"/>
            <path d="M27 34V14L45 24L27 34Z" fill="white"/>
          </svg>
        </motion.div>

        {/* Invitation Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(90deg, rgba(254,44,85,0.2), rgba(37,244,238,0.2))",
            padding: "6px 14px",
            borderRadius: "20px",
            marginBottom: "16px",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>
            Invited by {referrerName}
          </span>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h1 style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "10px",
            lineHeight: 1.2,
          }}>
            You&apos;ve Been Invited to
          </h1>
          <p style={{
            fontSize: "22px",
            fontWeight: 700,
            background: "linear-gradient(90deg, #282828 0%, #FF0000 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
          }}>
            YouCash Program
          </p>
        </motion.div>

        {/* Premium Access Required Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            background: "linear-gradient(135deg, rgba(254,44,85,0.15) 0%, rgba(254,44,85,0.05) 100%)",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
            border: "1px solid rgba(254,44,85,0.3)",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "8px",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <span style={{
              color: "#FF0000",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              Premium Access Required
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <p style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.5,
          }}>
            To access the YouCash platform and start earning money, a one-time activation fee is required.
          </p>
        </motion.div>

        {/* Earnings Potential Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
          style={{
            background: "linear-gradient(135deg, rgba(37,244,238,0.12) 0%, rgba(254,44,85,0.12) 100%)",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ textAlign: "left" }}>
              <div style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.5)",
                marginBottom: "4px",
              }}>
                Potential Daily Earnings
              </div>
              <div style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#282828",
                textShadow: "0 0 30px rgba(37,244,238,0.5)",
              }}>
                $50 - $500
              </div>
            </div>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #282828 0%, #FF0000 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <div style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.4)",
            marginTop: "10px",
            textAlign: "left",
          }}>
            Based on average user earnings rating videos
          </div>
        </motion.div>

        {/* What You Get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          <h3 style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            What You Get:
          </h3>
          {[
            { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Earn real money rating videos", color: "#282828" },
            { icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", text: "Exclusive training & video tutorials", color: "#FF0000" },
            { icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z", text: "Fast withdrawals via PayPal or Pix", color: "#ffd700" },
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Lifetime premium access", color: "#282828" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.08 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 0",
              }}
            >
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: `${item.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: `1px solid ${item.color}30`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Price Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75 }}
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d1a 100%)",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}>
            <span style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "line-through",
            }}>
              $99.90
            </span>
            <span style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#282828",
            }}>
              From $29.90
            </span>
            <span style={{
              background: "#FF0000",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: "6px",
            }}>
              70% OFF
            </span>
          </div>
          <p style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.5)",
            marginTop: "8px",
          }}>
            One-time payment - No hidden fees - No subscription
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* External checkout link - replace URL with your actual checkout */}
          <a 
            href="https://pay.hotmart.com/YOUR_PRODUCT_ID" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: "none", display: "block" }}
          >
            <button
              className="btn-3d btn-3d-primary btn-3d-lg btn-3d-full btn-3d-attention btn-3d-icon-grow"
              style={{
                marginBottom: "12px",
                gap: "10px",
                fontFamily: "inherit",
                width: "100%",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Get Access Now - Checkout
            </button>
          </a>

          <Link href="/login">
            <button
              className="btn-3d btn-3d-dark btn-3d-full btn-3d-float"
              style={{ fontFamily: "inherit" }}
            >
              Already paid? Login here
            </button>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            marginTop: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "11px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Secure Payment
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            30-Day Guarantee
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            50K+ Users
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
