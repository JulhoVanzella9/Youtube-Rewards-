"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";
import { Language } from "@/lib/i18n/translations";

export default function SettingsPage() {
  const { language, setLanguage, t } = useI18n();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [userEmail, setUserEmail] = useState("user@email.com");
  const [loggingOut, setLoggingOut] = useState(false);

  const languages = [
    { code: "en-US" as Language, label: "English (US)" },
    { code: "pt-BR" as Language, label: "Portugues (BR)" },
    { code: "es-ES" as Language, label: "Espanol" },
  ];

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "user@email.com");
        const { data } = await supabase
          .from("profiles")
          .select("language")
          .eq("id", user.id)
          .single();
        if (data?.language && data.language !== language) {
          setLanguage(data.language as Language);
        }
      }
    };
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageChange = async (code: Language) => {
    setLanguage(code);
    setShowLangPicker(false);
    const supabase = createClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ language: code }).eq("id", user.id);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    if (!supabase) { setLoggingOut(false); return; }
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", paddingBottom: "100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
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
        <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>{t("settings")}</h1>
      </motion.div>

      {/* Account Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ marginBottom: "28px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{t("account")}</h3>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.04)", overflow: "hidden",
        }}>
          {/* Email */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)",
          }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>{t("email")}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{userEmail}</div>
            </div>
          </div>

          {/* Language */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowLangPicker(!showLangPicker)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px", cursor: "pointer",
            }}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>{t("language")}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {languages.find(l => l.code === language)?.label}
              </div>
            </div>
            <motion.svg
              animate={{ rotate: showLangPicker ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.3)" strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"/>
            </motion.svg>
          </motion.div>

          {/* Language picker */}
          {showLangPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ padding: "0 20px 16px", overflow: "hidden" }}
            >
              {languages.map((lang, i) => (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={(e) => { e.stopPropagation(); handleLanguageChange(lang.code); }}
                  style={{
                    padding: "12px 16px", borderRadius: "12px",
                    marginBottom: "4px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: language === lang.code ? "rgba(255,0,0,0.1)" : "rgba(255,255,255,0.02)",
                    border: language === lang.code ? "1px solid rgba(255,0,0,0.2)" : "1px solid transparent",
                  }}
                >
                  <span style={{
                    fontSize: "13px", fontWeight: 600,
                    color: language === lang.code ? "#FF0000" : "var(--text-secondary)",
                  }}>
                    {lang.label}
                  </span>
                  {language === lang.code && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Resources Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ marginBottom: "28px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{t("resources")}</h3>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.04)", overflow: "hidden",
        }}>
          {[
            { label: t("quickStartGuide"), desc: t("learnPlatform"), href: "/guide" },
            { label: t("privacyPolicy"), desc: t("protectData"), href: "/privacy" },
            { label: t("termsOfUse"), desc: t("rulesConditions"), href: "/terms" },
          ].map((item, i) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 20px", cursor: "pointer",
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.03)" : "none",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>{item.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.desc}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Logout */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div style={{
          background: "rgba(255,0,0,0.04)", borderRadius: "18px",
          border: "1px solid rgba(255,0,0,0.08)", overflow: "hidden",
        }}>
          <motion.div
            whileHover={{ background: "rgba(255,0,0,0.08)" }}
            whileTap={{ scale: 0.99 }}
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px", cursor: loggingOut ? "not-allowed" : "pointer",
              opacity: loggingOut ? 0.6 : 1,
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#FF0000" }}>
              {loggingOut ? t("loggingOut") : t("logout")}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </motion.div>
        </div>
      </motion.section>

      {/* Version */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        style={{ textAlign: "center", marginTop: "32px", fontSize: "11px", color: "var(--text-muted)" }}
      >
        YouCash v1.0.0
      </motion.div>
    </div>
  );
}
