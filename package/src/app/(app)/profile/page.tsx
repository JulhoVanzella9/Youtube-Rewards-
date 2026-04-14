"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";

type Profile = {
  display_name: string;
  username: string;
  member_since: number;
  certificates_count: number;
  achievements_count: number;
  streak_days: number;
  total_watch_hours: string;
  total_xp: number;
};

// Faster animation config
const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.03 } } };

export default function ProfilePage() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      setUserEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, []);

  const stats = [
    { value: String(profile?.total_xp || 0), label: t("xp"), color: "#FF0000" },
    { value: profile?.total_watch_hours || "0h", label: t("watched"), color: "#a855f7" },
  ];

  const menuItems = [
    { label: t("myCertificate"), href: "/certificate", desc: t("downloadCertificate") },
    { label: t("settings"), href: "/settings", desc: t("customizeExperience") },
    { label: t("helpSupport"), href: "/support", desc: t("needHelp") },
  ];

  const displayName = profile?.display_name || userEmail?.split("@")[0] || "User";
  const username = profile?.username || userEmail?.split("@")[0] || "user";

  // Show skeleton while loading
  if (loading) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "28px", paddingTop: "10px" }}>
          <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", margin: "0 auto 14px" }} />
          <div style={{ width: "120px", height: "22px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", margin: "0 auto 8px" }} />
          <div style={{ width: "180px", height: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "24px" }}>
          {[1,2,3,4].map((i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "16px", padding: "18px 14px", height: "80px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {/* Profile Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.3 }}
        style={{ textAlign: "center", marginBottom: "28px", paddingTop: "10px" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "90px", height: "90px", borderRadius: "50%",
            background: "linear-gradient(135deg, #FF0000, #CC0000)",
            margin: "0 auto 14px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "36px", fontWeight: 800,
            color: "#fff", position: "relative",
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </motion.div>
        <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#fff", marginBottom: "4px" }}>
          {displayName}
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px" }}>
          @{username} - {t("memberSince")} {profile?.member_since || 2025}
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          {userEmail}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px", marginBottom: "24px",
        }}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeIn}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
            style={{
              background: `linear-gradient(145deg, ${stat.color}10, rgba(255,255,255,0.02))`,
              borderRadius: "16px",
              border: `1px solid ${stat.color}20`,
              padding: "18px 14px", textAlign: "center",
            }}
          >
            <div style={{
              fontSize: "24px", fontWeight: 900, color: stat.color,
              lineHeight: 1,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: "11px", color: "var(--text-muted)", fontWeight: 600,
              marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.5px",
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Wallet Button */}
      <Link href="/wallet" prefetch={true} style={{ textDecoration: "none" }}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,170,0,0.08))",
            borderRadius: "16px",
            border: "1px solid rgba(255,215,0,0.2)",
            padding: "18px 16px", marginBottom: "12px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(135deg, #ffd700, #ffaa00)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", fontWeight: 900, color: "#fff",
            }}>
              P
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff" }}>
                {t("wallet")}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {t("redeemRewards")}
              </div>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </motion.div>
      </Link>

      {/* Achievements Button */}
      <Link href="/achievements" prefetch={true} style={{ textDecoration: "none" }}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          whileHover={{ scale: 1.01, x: 4 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: "linear-gradient(135deg, rgba(255,0,0,0.12), rgba(168,85,247,0.08))",
            borderRadius: "16px",
            border: "1px solid rgba(255,0,0,0.15)",
            padding: "18px 16px", marginBottom: "24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffd700" stroke="#ffd700" strokeWidth="1">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" fill="none" strokeWidth="2"/>
            </svg>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff" }}>
                {t("achievements")}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {profile?.achievements_count || 0} {t("unlocked")}
              </div>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </motion.div>
      </Link>

      {/* Menu Items */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        style={{ marginBottom: "20px" }}
      >
        <h3 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
          {t("menu")}
        </h3>
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href} prefetch={true} style={{ textDecoration: "none" }}>
            <motion.div
              variants={fadeIn}
              transition={{ duration: 0.2 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", marginBottom: "8px",
                background: "rgba(255,255,255,0.02)", borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.04)", cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {item.desc}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Go to Class CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15 }}
        style={{ padding: "0 0 20px" }}
      >
        <Link href="/course/youcash-program" prefetch={true}>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(255,0,0,0.4)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", padding: "14px", fontSize: "15px", fontWeight: 700,
              background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
              color: "#fff",
              border: "none", borderRadius: "50px", cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 15px rgba(255,0,0,0.3), 0 2px 0 #c41e40",
            }}
          >
            {t("goToClass")}
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
