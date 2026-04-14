"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import RefundModal from "@/app/components/RefundModal";
import SupportChat from "./components/SupportChat";

// Configuration
const SUPPORT_EMAIL = "accesssupport.ai@gmail.com";
const SUPPORT_PHONE = "+1 (555) 123-4567";

const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

const faqItems = [
  {
    question: "How do I earn points?",
    answer: "You earn points by watching videos, completing courses, and engaging with content. Each video watched gives you XP that converts to points for withdrawal."
  },
  {
    question: "How long does withdrawal take?",
    answer: "Withdrawals are processed within 7 business days. You will receive a confirmation email once your withdrawal is complete."
  },
  {
    question: "What is the minimum withdrawal amount?",
    answer: "The minimum withdrawal amount is $0.40. The first withdrawal of $0.40 can only be done once per account."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team through this page by using the contact form below or by submitting a refund request if needed."
  },
  {
    question: "Why was my withdrawal rejected?",
    answer: "Withdrawals may be rejected if the account information is incorrect or if there are suspicious activities. Please ensure your payment details are accurate."
  },
];

export default function SupportPage() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{ 
      padding: "clamp(16px, 4vw, 24px)", 
      maxWidth: "min(600px, calc(100vw - 24px))", 
      margin: "0 auto", 
      paddingBottom: "clamp(80px, 20vw, 120px)",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          display: "flex", alignItems: "center", gap: "16px",
          marginBottom: "24px",
        }}
      >
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", 
              border: "none",
              color: "var(--text-primary)", cursor: "pointer", padding: "10px",
              borderRadius: "12px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </motion.button>
        </Link>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
          {t("support")}
        </h1>
      </motion.div>

      {/* Support Hero */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        style={{
          background: isDarkMode 
            ? "linear-gradient(145deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.05) 100%)"
            : "linear-gradient(145deg, rgba(255,0,0,0.15) 0%, rgba(255,0,0,0.08) 100%)",
          borderRadius: "24px", padding: "28px",
          marginBottom: "24px", textAlign: "center",
          border: `1px solid var(--border-color)`,
        }}
      >
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "linear-gradient(135deg, #FF0000, #CC0000)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 8px 24px rgba(255,0,0,0.25)",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          {t("howCanWeHelp")}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>
          {t("supportDesc")}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.1 }}
        style={{
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, calc(50% - 8px)), 1fr))", 
          gap: "clamp(10px, 2.5vw, 14px)",
          marginBottom: "clamp(18px, 4vw, 26px)",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowRefundModal(true)}
          className="btn-3d-icon-grow"
          style={{
            padding: "20px 16px",
            background: "linear-gradient(145deg, rgba(255,0,0,0.1), rgba(255,0,0,0.05))",
            border: "1px solid rgba(255,0,0,0.15)",
            borderRadius: "16px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
            boxShadow: "0 4px 15px rgba(255,0,0,0.15)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
            {t("requestRefund")}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowChat(true)}
          className="btn-3d-icon-grow"
          style={{
            padding: "20px 16px",
            background: "linear-gradient(145deg, rgba(255,0,0,0.1), rgba(255,0,0,0.05))",
            border: "1px solid rgba(255,0,0,0.15)",
            borderRadius: "16px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
            boxShadow: "0 4px 15px rgba(255,0,0,0.15)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
            Live Chat
          </span>
        </motion.button>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.15 }}
        style={{
          background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          borderRadius: "24px", padding: "24px",
          marginBottom: "24px",
          border: `1px solid var(--border-color)`,
        }}
      >
        <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "20px" }}>
          {t("frequentlyAsked")}
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={false}
              style={{
                background: expandedFaq === index 
                  ? (isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)") 
                  : "transparent",
                borderRadius: "12px",
                border: `1px solid var(--border-color)`,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                style={{
                  width: "100%", padding: "16px",
                  background: "transparent", border: "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", textAlign: "left" }}>
                  {item.question}
                </span>
                <motion.svg
                  animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </motion.svg>
              </button>
              <AnimatePresence>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      padding: "0 16px 16px",
                      fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6,
                    }}>
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
        style={{
          background: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          borderRadius: "24px", padding: "24px",
          border: `1px solid var(--border-color)`,
          textAlign: "center",
        }}
      >
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
          {t("stillNeedHelp")}
        </h3>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: 1.6 }}>
          {t("contactUsDesc")}
        </p>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          padding: "12px 20px", 
          background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", 
          borderRadius: "12px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
<span style={{ fontSize: "13px", color: "#282828", fontWeight: 600 }}>
                  {SUPPORT_EMAIL}
                  </span>
        </div>
      </motion.div>

      {/* Help Center Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.8)", zIndex: 1000,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: isDarkMode ? "#1a1a1a" : "#ffffff",
                borderRadius: "24px", padding: "28px",
                width: "100%", maxWidth: "400px",
                border: `1px solid var(--border-color)`,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF0000, #CC0000)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 8px 24px rgba(255,0,0,0.25)",
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
                  {t("helpCenter")}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Contact us through the channels below
                </p>
              </div>

              {/* Email */}
              <div style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "16px", 
                background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                borderRadius: "14px", marginBottom: "12px",
                border: `1px solid var(--border-color)`,
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "rgba(255,0,0,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#282828" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px", fontWeight: 600 }}>
                    Email
                  </div>
<div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 700 }}>
                  {SUPPORT_EMAIL}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "16px", 
                background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                borderRadius: "14px", marginBottom: "24px",
                border: `1px solid var(--border-color)`,
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "rgba(255,0,0,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px", fontWeight: 600 }}>
                    Phone
                  </div>
<div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 700 }}>
                  {SUPPORT_PHONE}
                  </div>
                </div>
              </div>

              {/* 3D Close Button */}
              <button
                onClick={() => setShowHelpModal(false)}
                className="btn-3d btn-3d-primary btn-3d-full"
                style={{ fontFamily: "inherit" }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refund Modal */}
      <RefundModal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)} />

      {/* Live Chat */}
      <SupportChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
}
