"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/app/data/courses";
import CourseCard from "@/app/components/CourseCard";
import Link from "next/link";
import { useProgress } from "@/lib/hooks/useProgress";

const tabs = ["All", "In Progress", "Completed"];

export default function MyCoursesPage() {
  const [tab, setTab] = useState(0);
  const { courseProgress, loading } = useProgress();

  // Merge course data with user progress
  const coursesWithProgress = useMemo(() => {
    return courses.map(course => {
      const userProgress = courseProgress.find(p => p.course_id === course.id);
      return {
        ...course,
        progress: userProgress?.progress || 0,
        started: !!userProgress,
        completedAt: userProgress?.completed_at
      };
    });
  }, [courseProgress]);

  const enrolled = coursesWithProgress.filter((c) => c.started);
  const inProgress = coursesWithProgress.filter((c) => c.started && c.progress < 100);
  const completed = coursesWithProgress.filter((c) => c.progress === 100);
  const displayed = tab === 0 ? enrolled : tab === 1 ? inProgress : completed;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "20px",
        }}
      >
        My Courses
      </motion.h1>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: "4px", marginBottom: "24px",
        background: "rgba(255,255,255,0.03)", borderRadius: "14px",
        padding: "4px", border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {tabs.map((t, i) => (
          <motion.button
            key={t}
            whileTap={{ scale: 0.97 }}
            onClick={() => setTab(i)}
            style={{
              flex: 1, padding: "10px", fontSize: "13px", fontWeight: 600,
              background: tab === i ? "var(--gradient-button)" : "transparent",
              color: tab === i ? "#fff" : "var(--text-muted)",
              border: "none", borderRadius: "10px", cursor: "pointer",
              fontFamily: "inherit", transition: "color 0.2s",
            }}
          >
            {t}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>Loading...</div>
        </div>
      ) : displayed.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          gap: "20px",
        }}>
          <AnimatePresence mode="popLayout">
            {displayed.map((course, i) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <CourseCard course={course} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            No courses here yet
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
            Start exploring our courses
          </p>
          <Link href="/explore">
            <button
              className="btn-3d btn-3d-primary"
              style={{ fontFamily: "inherit" }}
            >
              Explore Courses
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
