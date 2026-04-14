"use client";
import { motion } from "framer-motion";
import { courses } from "@/app/data/courses";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useProgress } from "@/lib/hooks/useProgress";
import { useMemo } from "react";

const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

export default function ProgressPage() {
  const { t } = useI18n();
  const { courseProgress, completedLessons, loading } = useProgress();

  const coursesWithProgress = useMemo(() => {
    return courses.map(course => {
      const userProgress = courseProgress.find(p => p.course_id === course.id);
      return {
        ...course,
        progress: userProgress?.progress || 0,
        started: !!userProgress,
        completedAt: userProgress?.completed_at
      };
    }).filter(c => c.started);
  }, [courseProgress]);

  const totalLessonsCompleted = completedLessons.length;
  const totalCoursesStarted = coursesWithProgress.length;
  const totalCoursesCompleted = coursesWithProgress.filter(c => c.progress === 100).length;

  if (loading) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{t("loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: "24px" }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#fff", marginBottom: "8px" }}>
          {t("progress")}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          {t("yourJourney")}
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px", marginBottom: "32px",
        }}
      >
        {[
          { value: totalCoursesCompleted, label: t("courses"), color: "#282828" },
          { value: totalLessonsCompleted, label: t("lessons"), color: "#FF0000" },
          { value: totalCoursesStarted, label: t("yourCourses"), color: "#FF0000" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeIn}
            transition={{ duration: 0.2 }}
            style={{
              background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
              border: `1px solid ${stat.color}20`,
              borderRadius: "16px", padding: "16px", textAlign: "center",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 900, color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, marginTop: "4px" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Courses In Progress */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "16px" }}>
          {t("yourCourses")}
        </h2>

        {coursesWithProgress.length === 0 ? (
          <motion.div
            variants={fadeIn}
            style={{
              textAlign: "center", padding: "40px 20px",
              background: "rgba(255,255,255,0.02)", borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📚</div>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
              {t("startLearning")}
            </p>
            <Link href="/explore">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "12px 24px", fontSize: "14px", fontWeight: 700,
                  background: "linear-gradient(135deg, #FF0000, #CC0000)",
                  color: "#fff", border: "none", borderRadius: "50px",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {t("exploreCourses")}
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {coursesWithProgress.map((course) => (
              <Link key={course.id} href={`/course/${course.id}`} style={{ textDecoration: "none" }}>
                <motion.div
                  variants={fadeIn}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "16px", background: "rgba(255,255,255,0.02)",
                    borderRadius: "16px", border: "1px solid rgba(255,255,255,0.04)",
                    cursor: "pointer",
                  }}
                >
                  {/* Course Thumbnail */}
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "12px",
                    background: `linear-gradient(135deg, ${course.progress === 100 ? '#282828' : '#FF0000'}20, rgba(255,255,255,0.02))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "24px", flexShrink: 0,
                  }}>
                    {course.progress === 100 ? "✓" : "📖"}
                  </div>

                  {/* Course Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: "14px", fontWeight: 700, color: "#fff",
                      marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                      {course.instructor}
                    </p>
                    
                    {/* Progress Bar */}
                    <div style={{
                      width: "100%", height: "6px", background: "rgba(255,255,255,0.1)",
                      borderRadius: "3px", overflow: "hidden",
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                          height: "100%",
                          background: course.progress === 100
                            ? "linear-gradient(90deg, #282828, #FF4444)"
                            : "linear-gradient(90deg, #FF0000, #CC0000)",
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Progress Percentage */}
                  <div style={{
                    fontSize: "14px", fontWeight: 800,
                    color: course.progress === 100 ? "#282828" : "#FF0000",
                  }}>
                    {course.progress}%
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
