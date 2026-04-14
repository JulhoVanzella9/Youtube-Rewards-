"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import ParticleField from "../components/ParticleField";
import Link from "next/link";

export default function HomePage() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
          <path d="M22 12A10 10 0 0 0 12 2v10z"/>
        </svg>
      ),
      title: "Real-Time Analytics",
      description: "Track your performance with live data and insights to optimize your content strategy.",
      color: "#282828",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      title: "Automated Tools",
      description: "Save time with automation that handles repetitive tasks and maximizes efficiency.",
      color: "#FF0000",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#065FD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy standards.",
      color: "#065FD4",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: "Premium Support",
      description: "Get help anytime with our dedicated support team ready to assist you.",
      color: "#f59e0b",
    },
  ];

  const gettingStartedSteps = [
    "Navigate to the YouCash App section using the sidebar",
    "Start watching videos and earn rewards daily",
    "Track your earnings and withdraw your balance anytime",
    "Access Support if you need help or have questions",
  ];

  return (
    <div style={{ 
      padding: "0",
      maxWidth: "100vw", 
      width: "100%",
      margin: "0 auto",
      color: "var(--text-primary)",
      transition: "color 0.3s ease",
      paddingBottom: "calc(clamp(100px, 25vw, 140px) + env(safe-area-inset-bottom, 0px))",
      position: "relative",
      background: isDarkMode 
        ? "linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)"
        : "linear-gradient(180deg, #f8f9fc 0%, #ffffff 50%, #f8f9fc 100%)",
      minHeight: "100dvh",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>
      {/* Interactive Particle Background */}
      <ParticleField 
        particleCount={20}
        interactive={false}
        className="gpu-accelerated"
      />

{/* 1. Video Tutorial Section - FIRST */}
  <div style={{
    padding: "12px 6px 16px 6px",
    maxWidth: "min(calc(100vw - 8px), 700px)",
    margin: "0 auto",
    boxSizing: "border-box",
  }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.05) 100%)"
              : "linear-gradient(135deg, rgba(255,0,0,0.08) 0%, rgba(255,0,0,0.04) 100%)",
            borderRadius: "16px",
            padding: "16px 16px 20px 16px",
            border: `1px solid ${isDarkMode ? "rgba(255,0,0,0.2)" : "rgba(255,0,0,0.15)"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <h2 style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#FF0000",
            }}>
              Video Tutorial
            </h2>
          </div>

          <p style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginBottom: "20px",
            lineHeight: 1.5,
          }}>
            Watch this quick tutorial to learn how to use the YouCash app and maximize your earnings.
          </p>

          {/* Video Player */}
          <div style={{
            margin: "16px -11px 0 -11px",
            padding: "0 0 5px 0",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%",
              borderRadius: "12px",
              overflow: "hidden",
            }}>
              <iframe
                src="https://www.youtube.com/embed/xSwyR5wzpAY?rel=0&modestbranding=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* Install App Button - Right below video */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              className="btn-3d btn-3d-primary btn-3d-animated btn-3d-icon-grow"
              onClick={() => {
                const event = new CustomEvent("triggerInstallPrompt");
                window.dispatchEvent(event);
              }}
              style={{
                gap: "10px",
                fontFamily: "inherit",
                padding: "14px 28px",
                fontSize: "15px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Install App
            </button>
          </div>
        </motion.div>
      </div>

      {/* 2. Welcome to YouCash - Hero Section */}
      <div style={{
        padding: "clamp(32px, 6vw, 60px) clamp(20px, 5vw, 60px)",
        textAlign: "center",
        position: "relative",
        background: isDarkMode
          ? "linear-gradient(180deg, rgba(255,0,0,0.08) 0%, rgba(255,0,0,0.05) 50%, transparent 100%)"
          : "linear-gradient(180deg, rgba(255,0,0,0.06) 0%, rgba(255,0,0,0.04) 50%, transparent 100%)",
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(32px, 8vw, 56px)",
            fontWeight: 900,
            marginBottom: "16px",
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: "var(--text-primary)" }}>Welcome to </span>
          <span style={{
            background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            YouCash
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "clamp(16px, 3vw, 22px)",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto 32px",
            lineHeight: 1.5,
          }}
        >
          Your gateway to monetizing your YouTube content and maximizing your earnings
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/create">
            <button
              className="btn-3d btn-3d-red btn-3d-animated btn-3d-icon-grow"
              style={{
                padding: "16px 32px",
                fontSize: "18px",
                fontWeight: 700,
                gap: "12px",
                fontFamily: "inherit",
              }}
            >
              Launch YouCash App
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </Link>
        </motion.div>
      </div>

      {/* 3. How YouCash Works Section */}
      <div style={{
        padding: "clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)",
        maxWidth: "800px",
        margin: "0 auto",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            background: isDarkMode 
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.8)",
            borderRadius: "24px",
            padding: "clamp(24px, 4vw, 40px)",
            border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0,0,0,0.3)"
              : "0 8px 32px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800,
            color: "#FF0000",
            marginBottom: "20px",
          }}>
            How YouCash Works
          </h2>
          
          <p style={{
            fontSize: "clamp(14px, 2vw, 17px)",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "20px",
          }}>
            YouCash is your all-in-one platform for maximizing revenue from your YouTube presence. Our embedded app provides real-time analytics, monetization strategies, and automated tools to help you grow your income.
          </p>

          <p style={{
            fontSize: "clamp(14px, 2vw, 17px)",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
          }}>
            Click on <strong style={{ color: "#FF0000" }}>YouCash App</strong> in the sidebar to access the full suite of tools designed to supercharge your earnings.
          </p>
        </motion.div>
      </div>

      {/* 4. Features Grid */}
      <div style={{
        padding: "clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)",
        maxWidth: "800px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, clamp(240px, 40vw, 300px)), 1fr))",
          gap: "clamp(14px, 3.5vw, 24px)",
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              style={{
                background: isDarkMode 
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.9)",
                borderRadius: "clamp(14px, 4vw, 22px)",
                padding: "clamp(18px, 5vw, 30px)",
                border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: isDarkMode
                  ? "0 4px 20px rgba(0,0,0,0.2)"
                  : "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: `${feature.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "10px",
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Getting Started Section */}
      <div style={{
        padding: "clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)",
        maxWidth: "800px",
        margin: "0 auto",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          style={{
            background: isDarkMode 
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.8)",
            borderRadius: "24px",
            padding: "clamp(24px, 4vw, 40px)",
            border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <h2 style={{
            fontSize: "clamp(20px, 3.5vw, 28px)",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "24px",
          }}>
            Getting Started
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {gettingStartedSteps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}>
                  {index + 1}
                </div>
                <p style={{
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  paddingTop: "3px",
                }}>
                  {step.includes("YouCash App") ? (
                    <>
                      Navigate to the <Link href="/create" style={{ color: "#FF0000", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}>YouCash App</Link> section using the sidebar
                    </>
                  ) : step.includes("Support") ? (
                    <>
                      Access <Link href="/support" style={{ color: "#282828", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}>Support</Link> if you need help or have questions
                    </>
                  ) : (
                    step
                  )}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
