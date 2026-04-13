"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type FAQItem = { question: string; answer: string };

const faqs: FAQItem[] = [
  {
    question: "How do I start watching a course?",
    answer: "Go to the Explore page, choose a course and click \"Start Course\". You will be directed to the first lesson automatically.",
  },
  {
    question: "Do courses have certificates?",
    answer: "Yes! When you complete 100% of a course, your certificate is generated automatically and available in the \"My Certificates\" section of your profile.",
  },
  {
    question: "Can I watch offline?",
    answer: "Currently, courses are only available online. We are working on making lesson downloads available soon.",
  },
  {
    question: "How does the streak work?",
    answer: "The streak counts how many consecutive days you watched at least one lesson. Keep your streak active to unlock special achievements!",
  },
  {
    question: "Can I access from multiple devices?",
    answer: "Yes! Your progress is automatically synced. Just log in to the same account on any device.",
  },
  {
    question: "How do I request a refund?",
    answer: "To request a refund, contact us at support@tikmoney.com within 7 days of purchase.",
  },
];

const contactOptions = [
  { icon: "💬", title: "Live Chat", desc: "Response within 5 minutes", available: true, color: "#25f4ee" },
  { icon: "📧", title: "Email", desc: "support@tikmoney.com", available: true, color: "#fe2c55" },
  // WHATSAPP_DISABLED - Uncomment line below to re-enable WhatsApp
  // { icon: "📱", title: "WhatsApp", desc: "Mon-Fri, 9am to 6pm", available: true, color: "#25d366" },
];

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", paddingBottom: "100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}
      >
        <Link href="/profile" style={{
          width: "36px", height: "36px", borderRadius: "12px",
          background: "rgba(255,255,255,0.06)", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>Help & Support</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>How can we help you?</p>
        </div>
      </motion.div>

      {/* Contact Options */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px",
          marginBottom: "28px",
        }}
      >
        {contactOptions.map((opt, i) => (
          <motion.div
            key={opt.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: `${opt.color}08`,
              border: `1px solid ${opt.color}15`,
              borderRadius: "18px", padding: "18px 12px", textAlign: "center",
              cursor: "pointer", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: "-10px", right: "-10px",
              width: "40px", height: "40px", borderRadius: "50%",
              background: `${opt.color}08`, filter: "blur(10px)",
            }} />
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{opt.icon}</div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>{opt.title}</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{opt.desc}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <section style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Perguntas Frequentes
        </h3>

        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.04)", overflow: "hidden",
        }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              style={{
                borderBottom: i < faqs.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
              }}
            >
              <motion.div
                whileTap={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                style={{
                  padding: "18px 20px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff", flex: 1, paddingRight: "12px" }}>
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: openFAQ === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.3)" strokeWidth="2" style={{ flexShrink: 0 }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </motion.svg>
              </motion.div>

              <AnimatePresence>
                {openFAQ === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      padding: "0 20px 18px", fontSize: "13px",
                      color: "var(--text-secondary)", lineHeight: 1.7,
                    }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rating Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginBottom: "28px" }}
      >
        <div style={{
          background: "linear-gradient(135deg, rgba(254,44,85,0.06), rgba(37,244,238,0.04))",
          borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)",
          padding: "24px", textAlign: "center",
        }}>
          {!feedbackSent ? (
            <>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                How is your experience?
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                Your feedback helps us improve
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    style={{
                      fontSize: "28px", background: "none", border: "none",
                      cursor: "pointer", padding: "4px",
                      filter: star <= rating ? "none" : "grayscale(1) opacity(0.3)",
                      transition: "filter 0.2s",
                    }}
                  >
                    ⭐
                  </motion.button>
                ))}
              </div>

              {rating > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(254,44,85,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFeedbackSent(true)}
                  className="glow-btn"
                  style={{
                    padding: "12px 28px", fontSize: "14px", fontWeight: 700,
                    background: "var(--gradient-button)", color: "#fff",
                    border: "none", borderRadius: "12px", cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Submit Rating
                </motion.button>
              )}
            </>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>💖</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                Thank you!
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Your rating was submitted successfully
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Resources */}
      <section>
        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Resources
        </h3>
        {[
          { label: "Quick Start Guide", desc: "Learn how to use the platform", href: "/guide", icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          )},
          { label: "Privacy Policy", desc: "How we protect your data", href: "/privacy", icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          )},
          { label: "Terms of Use", desc: "Rules and conditions", href: "/terms", icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          )},
        ].map((item, i) => (
          <Link key={item.label} href={item.href}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 18px", marginBottom: "8px",
                background: "rgba(255,255,255,0.02)", borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.04)", cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.04)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>{item.desc}</div>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </motion.div>
          </Link>
        ))}
      </section>
    </div>
  );
}
