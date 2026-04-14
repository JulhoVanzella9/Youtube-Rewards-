"use client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getCourseById, getModuleById, getSubModuleById } from "@/app/data/courses";
import { useTheme } from "@/lib/theme/context";

export default function SubModulePage() {
  const params = useParams();
  const router = useRouter();
  const course = getCourseById(params.courseId as string);
  const courseModule = getModuleById(params.courseId as string, params.moduleId as string);
  const subModule = getSubModuleById(
    params.courseId as string, 
    params.moduleId as string, 
    params.subModuleId as string
  );
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  if (!course || !courseModule || !subModule) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ color: "var(--text-primary)", marginBottom: "12px" }}>Content not found</h2>
        <Link href={`/course/${params.courseId}`} style={{ color: "#FF0000", fontWeight: 600, fontSize: "14px" }}>
          Back to course
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      paddingBottom: "100px",
      background: isDarkMode ? "#000" : "#f8f8f8",
    }}>
      {/* Header */}
      <div style={{ 
        padding: "16px",
        background: isDarkMode ? "#0a0a0a" : "#fff",
        borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-primary)", display: "flex", alignItems: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
            {subModule.title}
          </h1>
        </div>
      </div>

      {/* Lessons List */}
      <div style={{ padding: "0" }}>
        {subModule.lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Link
              href={`/course/${params.courseId}/lesson/${lesson.id}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "18px 16px",
                background: isDarkMode ? "#0a0a0a" : "#fff",
                borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                transition: "background 0.2s",
              }}>
                {/* Number Badge */}
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: lesson.contentType === "video" 
                    ? "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)" 
                    : isDarkMode ? "#1a1a1a" : "#f0f0f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "14px",
                  color: lesson.contentType === "video" ? "#fff" : "var(--text-primary)",
                  flexShrink: 0,
                }}>
                  {lesson.contentType === "video" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: "14px", fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                    lineHeight: 1.4,
                  }}>
                    {lesson.title}
                  </h3>
                  <p style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                  }}>
                    {lesson.contentType === "video" ? `Video - ${lesson.duration}` : "Text Content"}
                  </p>
                </div>

                {/* Arrow */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
