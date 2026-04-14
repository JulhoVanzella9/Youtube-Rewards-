"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";

type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  xp: number;
};

const achievementDefinitions = [
  { id: "first-lesson", icon: "play", title: "firstLesson", description: "firstLessonDesc", maxProgress: 1, rarity: "common" as const, xp: 50 },
  { id: "first-course", icon: "graduation", title: "firstCourse", description: "firstCourseDesc", maxProgress: 1, rarity: "common" as const, xp: 100 },
  { id: "streak-7", icon: "fire", title: "streak7", description: "streak7Desc", maxProgress: 7, rarity: "rare" as const, xp: 200 },
  { id: "streak-30", icon: "fire", title: "streak30", description: "streak30Desc", maxProgress: 30, rarity: "epic" as const, xp: 500 },
  { id: "3-courses", icon: "books", title: "explorer", description: "explorerDesc", maxProgress: 3, rarity: "rare" as const, xp: 300 },
  { id: "10-lessons", icon: "book", title: "studious", description: "studiousDesc", maxProgress: 10, rarity: "common" as const, xp: 150 },
  { id: "5h-watch", icon: "clock", title: "marathoner", description: "marathonerDesc", maxProgress: 5, rarity: "common" as const, xp: 150 },
  { id: "20h-watch", icon: "target", title: "dedicated", description: "dedicatedDesc", maxProgress: 20, rarity: "epic" as const, xp: 500 },
  { id: "all-courses", icon: "diamond", title: "totalExpert", description: "totalExpertDesc", maxProgress: 6, rarity: "legendary" as const, xp: 1000 },
];

const rarityColors: Record<string, { bg: string; border: string; text: string }> = {
  common: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", text: "#aaa" },
  rare: { bg: "rgba(37,244,238,0.06)", border: "rgba(37,244,238,0.15)", text: "#282828" },
  epic: { bg: "rgba(168,85,247,0.06)", border: "rgba(168,85,247,0.15)", text: "#a855f7" },
  legendary: { bg: "rgba(255,215,0,0.06)", border: "rgba(255,215,0,0.2)", text: "#ffd700" },
};

const iconMap: Record<string, JSX.Element> = {
  play: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  graduation: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>,
  fire: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  books: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  book: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  clock: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  target: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  diamond: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0z"/></svg>,
};

// Faster animation variants
const fadeIn = { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.03 } } };

export default function AchievementsPage() {
  const { t } = useI18n();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const rarityLabels = useMemo(() => ({
    common: t("rarityCommon") || "Common",
    rare: t("rarityRare") || "Rare",
    epic: t("rarityEpic") || "Epic",
    legendary: t("rarityLegendary") || "Legendary",
  }), [t]);

  useEffect(() => {
    const loadAchievements = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setAchievements(achievementDefinitions.map(def => ({ ...def, progress: 0, unlocked: false })));
        setLoading(false);
        return;
      }

      const { data: userAchievements } = await supabase
        .from("user_achievements")
        .select("achievement_id, progress, unlocked")
        .eq("user_id", user.id);

      const achMap = new Map(userAchievements?.map(a => [a.achievement_id, a]) || []);
      
      setAchievements(achievementDefinitions.map(def => {
        const userAch = achMap.get(def.id);
        return { ...def, progress: userAch?.progress || 0, unlocked: userAch?.unlocked || false };
      }));
      setLoading(false);
    };

    loadAchievements();
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalXP = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

  if (loading) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ width: "150px", height: "24px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }} />
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "20px", padding: "24px", marginBottom: "24px", height: "140px" }} />
        {[1,2,3,4].map((i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "16px", marginBottom: "10px", height: "90px" }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", paddingBottom: "100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}
      >
        <Link href="/profile" prefetch={true} style={{
          width: "36px", height: "36px", borderRadius: "12px",
          background: "rgba(255,255,255,0.06)", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>{t("achievements")}</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {unlockedCount} / {achievements.length} {t("unlocked")}
          </p>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        style={{
          background: "linear-gradient(135deg, rgba(254,44,85,0.1), rgba(168,85,247,0.08))",
          borderRadius: "20px", border: "1px solid rgba(254,44,85,0.12)",
          padding: "24px", marginBottom: "24px", textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "12px" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#ffd700" stroke="#ffd700" strokeWidth="1">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" fill="none" strokeWidth="2"/>
          </svg>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "32px" }}>
          <div>
            <div style={{ fontSize: "26px", fontWeight: 900, color: "#fff" }}>{unlockedCount}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{t("achievements")}</div>
          </div>
          <div style={{ width: "1px", background: "rgba(255,255,255,0.08)" }} />
          <div>
            <div style={{ fontSize: "26px", fontWeight: 900, color: "#ffd700" }}>{totalXP}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>{t("xp")} Total</div>
          </div>
        </div>
      </motion.div>

      {/* Achievements List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {achievements.map((ach) => {
          const rarity = rarityColors[ach.rarity];
          const progressPct = Math.min((ach.progress / ach.maxProgress) * 100, 100);

          return (
            <motion.div
              key={ach.id}
              variants={fadeIn}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.01 }}
              style={{
                background: ach.unlocked ? rarity.bg : "rgba(255,255,255,0.015)",
                borderRadius: "16px",
                border: `1px solid ${ach.unlocked ? rarity.border : "rgba(255,255,255,0.04)"}`,
                padding: "16px",
                opacity: ach.unlocked ? 1 : (ach.progress > 0 ? 0.7 : 0.4),
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "48px", height: "48px", borderRadius: "14px",
                    background: ach.unlocked ? rarity.border : "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    color: ach.unlocked ? rarity.text : "rgba(255,255,255,0.3)",
                  }}
                >
                  {ach.unlocked || ach.progress > 0 ? iconMap[ach.icon] : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: ach.unlocked ? "#fff" : "var(--text-secondary)" }}>
                      {t(ach.title as keyof typeof t) || ach.title}
                    </span>
                    <span style={{
                      fontSize: "9px", fontWeight: 700, padding: "2px 8px",
                      borderRadius: "10px", textTransform: "uppercase",
                      background: rarity.border, color: rarity.text,
                    }}>
                      {rarityLabels[ach.rarity]}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                    {t(ach.description as keyof typeof t) || ach.description}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1, height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%", borderRadius: "3px",
                          background: ach.unlocked ? rarity.text : "rgba(255,255,255,0.2)",
                          width: `${progressPct}%`,
                          transition: "width 0.4s ease-out",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: ach.unlocked ? rarity.text : "var(--text-muted)" }}>
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: ach.unlocked ? "#ffd700" : "var(--text-muted)" }}>+{ach.xp}</div>
                  <div style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 600 }}>{t("xp")}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        style={{ marginTop: "24px" }}
      >
        <Link href="/profile" prefetch={true}>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(254,44,85,0.4)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%", padding: "14px", fontSize: "15px", fontWeight: 700,
              background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
              color: "#fff", border: "none", borderRadius: "50px", cursor: "pointer",
              fontFamily: "inherit", boxShadow: "0 4px 15px rgba(254,44,85,0.3), 0 2px 0 #c41e40",
            }}
          >
            {t("back")}
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
