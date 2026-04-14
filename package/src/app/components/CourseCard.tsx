"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Course } from "@/app/data/courses";

export default function CourseCard({ course, index }: { course: Course; index: number }) {
  const gradients = [
    "linear-gradient(135deg, #FF0000 0%, #8b31ff 100%)",
    "linear-gradient(135deg, #282828 0%, #0052ff 100%)",
    "linear-gradient(135deg, #ff6b35 0%, #FF0000 100%)",
    "linear-gradient(135deg, #8b31ff 0%, #282828 100%)",
    "linear-gradient(135deg, #ff4081 0%, #ffab40 100%)",
    "linear-gradient(135deg, #00e676 0%, #282828 100%)",
  ];

  return (
    <Link href={`/course/${course.id}`} prefetch={true} style={{ textDecoration: "none" }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: Math.min(index * 0.05, 0.2) 
        }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          boxShadow: "0 24px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)" 
        }}
        whileTap={{ scale: 0.97, y: 0 }}
        className="card-3d gpu-accelerated"
        style={{
          borderRadius: "20px", overflow: "hidden",
          background: "var(--gradient-card)",
          border: "1px solid rgba(255,255,255,0.06)",
          cursor: "pointer", position: "relative",
          boxShadow: "var(--shadow-card)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Thumbnail */}
        <div style={{
          height: "180px", background: gradients[index % gradients.length],
          position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {course.image && (
            <motion.img
              src={course.image}
              alt={course.title}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          {/* 3D Play button */}
          <div
            style={{
              width: "54px", height: "54px", borderRadius: "50%",
              background: "linear-gradient(145deg, #FF1A1A 0%, #FF0000 50%, #CC0000 100%)",
              boxShadow: `
                0 4px 0 0 #990000,
                0 6px 16px rgba(255, 0, 0, 0.5),
                inset 0 1px 0 rgba(255,255,255,0.25)
              `,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 1,
              transform: "translateY(0)",
              transition: "all 0.15s ease",
            }}
            className="card-play-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: "2px" }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>

          {/* Duration badge */}
          <div style={{
            position: "absolute", bottom: "12px", right: "12px",
            background: "rgba(0,0,0,0.7)",
            padding: "4px 10px", borderRadius: "20px",
            fontSize: "12px", fontWeight: 600, color: "#fff",
          }}>
            {course.totalDuration}
          </div>

          {/* Category */}
          <div style={{
            position: "absolute", top: "12px", left: "12px",
            background: "rgba(0,0,0,0.6)",
            padding: "4px 12px", borderRadius: "20px",
            fontSize: "11px", fontWeight: 600, color: "#fff",
          }}>
            {course.category}
          </div>

          {course.progress === 100 && (
            <div style={{
              position: "absolute", top: "12px", right: "12px",
              background: "#282828", padding: "4px 10px",
              borderRadius: "20px", fontSize: "11px", fontWeight: 700,
              color: "#000",
            }}>
              Completed
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "16px" }}>
          <h3 style={{
            fontSize: "15px", fontWeight: 700, color: "#fff",
            marginBottom: "8px", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {course.title}
          </h3>

          <p style={{
            fontSize: "13px", color: "var(--text-secondary)",
            lineHeight: 1.5, marginBottom: "12px",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const, overflow: "hidden",
          }}>
            {course.description}
          </p>

          {/* Progress bar */}
          {course.progress > 0 && course.progress < 100 && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                marginBottom: "6px",
              }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Progress</span>
                <span style={{ fontSize: "11px", color: "#282828", fontWeight: 700 }}>{course.progress}%</span>
              </div>
              <div style={{
                height: "3px", borderRadius: "2px",
                background: "rgba(255,255,255,0.06)",
              }}>
                <div
                  style={{
                    height: "100%", borderRadius: "2px",
                    background: "linear-gradient(90deg, #FF0000, #282828)",
                    width: `${course.progress}%`,
                    transition: "width 0.4s ease-out",
                  }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%",
                background: "linear-gradient(135deg, #FF0000, #CC0000)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 700, color: "#fff",
              }}>
                {course.instructor[0]}
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {course.instructor}
              </span>
            </div>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {course.totalLessons} lessons
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
