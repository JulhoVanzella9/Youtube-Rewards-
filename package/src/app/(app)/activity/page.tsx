"use client";
import { motion } from "framer-motion";
import { courses } from "@/app/data/courses";
import Link from "next/link";

type ActivityItem = {
  id: string;
  type: "lesson" | "course" | "achievement" | "streak";
  title: string;
  description: string;
  icon: string;
  time: string;
  color: string;
};

const activityData: ActivityItem[] = [
  { id: "1", type: "lesson", title: "Lesson Watched", description: "Monetization Strategies - Digital Monetization", icon: "▶️", time: "Today, 14:32", color: "#FF0000" },
  { id: "2", type: "streak", title: "Streak Kept!", description: "7 consecutive days of studying", icon: "🔥", time: "Today, 10:00", color: "#FF0000" },
  { id: "3", type: "lesson", title: "Lesson Watched", description: "Growth Algorithm - Growth Mastery", icon: "▶️", time: "Yesterday, 21:15", color: "#FF0000" },
  { id: "4", type: "achievement", title: "Achievement Unlocked", description: "Dedicated - 20 hours of content watched", icon: "🎯", time: "Yesterday, 20:45", color: "#a855f7" },
  { id: "5", type: "lesson", title: "Lesson Watched", description: "Lighting & Setup - Content Creator Pro", icon: "▶️", time: "Yesterday, 19:30", color: "#FF0000" },
  { id: "6", type: "course", title: "Course Completed!", description: "Growth Mastery - All lessons complete", icon: "🎓", time: "3 days ago", color: "#282828" },
  { id: "7", type: "lesson", title: "Lesson Watched", description: "Metrics Analysis - Growth Mastery", icon: "▶️", time: "3 days ago", color: "#FF0000" },
  { id: "8", type: "achievement", title: "Achievement Unlocked", description: "First Course - Complete an entire course", icon: "🎓", time: "3 days ago", color: "#a855f7" },
  { id: "9", type: "lesson", title: "Lesson Watched", description: "Creating Viral Scripts - Content Creator Pro", icon: "▶️", time: "4 days ago", color: "#FF0000" },
  { id: "10", type: "streak", title: "Streak Started", description: "First day of consistent studying!", icon: "⚡", time: "1 week ago", color: "#FF0000" },
];

export default function ActivityPage() {
  const totalLessons = courses.reduce((sum, c) => {
    const lessonsDone = Math.round((c.progress / 100) * c.totalLessons);
    return sum + lessonsDone;
  }, 0);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", paddingBottom: "100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}
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
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>Activity History</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Your learning journey
          </p>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px",
          marginBottom: "28px",
        }}
      >
        {[
          { value: String(totalLessons), label: "Aulas Vistas", color: "#FF0000" },
          { value: "21h", label: "Tempo Total", color: "#282828" },
          { value: "7 dias", label: "Streak", color: "#FF0000" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            style={{
              background: `linear-gradient(145deg, ${stat.color}12, ${stat.color}05)`,
              border: `1px solid ${stat.color}18`,
              borderRadius: "16px", padding: "16px 12px", textAlign: "center",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600, marginTop: "2px" }}>{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Weekly Chart Visual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "rgba(255,255,255,0.02)", borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.04)", padding: "20px",
          marginBottom: "28px",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>
          This Week
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "80px", gap: "8px" }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            const heights = [45, 70, 30, 80, 55, 20, 65];
            const isToday = i === 6;
            return (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heights[i]}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                  style={{
                    width: "100%", borderRadius: "6px",
                    background: isToday
                      ? "linear-gradient(180deg, #FF0000, #FF000080)"
                      : "linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                    minHeight: "4px",
                  }}
                />
                <span style={{
                  fontSize: "9px", fontWeight: isToday ? 700 : 500,
                  color: isToday ? "#FF0000" : "var(--text-muted)",
                }}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <h3 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
        Recent Activity
      </h3>
      <div style={{ position: "relative" }}>
        {/* Timeline line */}
        <div style={{
          position: "absolute", left: "23px", top: "0", bottom: "0",
          width: "2px", background: "rgba(255,255,255,0.04)",
        }} />

        {activityData.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            style={{
              display: "flex", alignItems: "flex-start", gap: "16px",
              marginBottom: "4px", padding: "12px 0",
              position: "relative",
            }}
          >
            {/* Timeline dot */}
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: `${item.color}15`, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", position: "relative", zIndex: 1,
              border: `1px solid ${item.color}20`,
            }}>
              {item.icon}
            </div>

            <div style={{
              flex: 1, background: "rgba(255,255,255,0.02)", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.04)", padding: "14px 16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: item.color }}>
                  {item.title}
                </span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", flexShrink: 0, marginLeft: "8px" }}>
                  {item.time}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {item.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
