"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { courses } from "@/app/data/courses";
import { useTheme } from "@/lib/theme/context";
import ParticleField from "@/app/components/ParticleField";
import ScrollReveal from "@/app/components/ScrollReveal";
import Tilt3D from "@/app/components/Tilt3D";

export default function CoursesPage() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div style={{ 
      minHeight: "100vh", 
      paddingBottom: "100px",
      background: isDarkMode ? "#000" : "#f8f8f8",
      position: "relative",
    }}>
      {/* Subtle Particle Background */}
      <ParticleField 
        particleCount={20}
        interactive={false}
        className="gpu-accelerated"
      />
      {/* Header */}
      <div style={{ 
        padding: "20px 16px 16px",
        background: isDarkMode ? "#000" : "#fff",
        borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg, #fe2c55 0%, #25f4ee 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>
              All Courses
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              {courses.length} programs available
            </p>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div style={{ 
        padding: "clamp(16px, 3vw, 32px)",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, clamp(280px, 45vw, 360px)), 1fr))",
          gap: "clamp(16px, 4vw, 28px)",
          alignItems: "stretch",
        }}>
          {courses.map((course, index) => (
            <ScrollReveal 
              key={course.id}
              animation="slide-up" 
              delay={index * 0.08}
            >
              <Tilt3D
                intensity={5}
                scale={1.02}
                glare={true}
                glareOpacity={0.1}
                style={{
                  borderRadius: "clamp(16px, 2vw, 24px)",
                  overflow: "hidden",
                }}
              >
                <Link
                  href={`/course/${course.id}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <motion.div 
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="card-float"
                    style={{
                      background: isDarkMode ? "#0f0f0f" : "#fff",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}>
                  {/* Course Image */}
                  <div style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}>
                    <motion.img 
                      src={course.image || "/images/modules/module-01.png"} 
                      alt={course.title}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transformOrigin: "center",
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(transparent 50%, rgba(0,0,0,0.8) 100%)",
                    }} />
                    
                    {/* Badge */}
                    <div style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "rgba(254,44,85,0.9)",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#fff",
                      textTransform: "uppercase",
                    }}>
                      {course.modules.length} Modules
                    </div>
                    
                    {/* Title on image */}
                    <div style={{
                      position: "absolute",
                      bottom: "clamp(14px, 2vw, 24px)",
                      left: "clamp(14px, 2vw, 24px)",
                      right: "clamp(14px, 2vw, 24px)",
                    }}>
                      <h2 style={{
                        fontSize: "clamp(18px, 2.5vw, 26px)",
                        fontWeight: 800,
                        color: "#fff",
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                        marginBottom: "4px",
                      }}>
                        {course.title}
                      </h2>
                      <p style={{
                        fontSize: "clamp(12px, 1.4vw, 16px)",
                        color: "rgba(255,255,255,0.8)",
                      }}>
                        {course.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  {/* Course Info */}
                  <div style={{ 
                    padding: "clamp(12px, 3vw, 20px)",
                    background: isDarkMode ? "#0a0a0a" : "#fff",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "clamp(150px, 35vw, 200px)",
                  }}>
                    <p style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      marginBottom: "12px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {course.description}
                    </p>
                    
                    {/* Stats */}
                    <div style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25f4ee" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {course.modules.length} modules
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {course.totalLessons || course.modules.reduce((acc, m) => 
                            acc + m.subModules.reduce((a, s) => a + s.lessons.length, 0), 0)} lessons
                        </span>
                      </div>
                    </div>
                    
                    {/* 3D Start Button */}
                    <button
                      className="btn-3d btn-3d-full btn-3d-animated"
                      style={{
                        width: "100%",
                        marginTop: "auto",
                        fontFamily: "inherit",
                        fontSize: "14px",
                        fontWeight: 700,
                        padding: "12px 20px",
                        background: "linear-gradient(135deg, #fe2c55 0%, #ff3366 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxShadow: "0 4px 0 0 #b8183a, 0 6px 16px rgba(254, 44, 85, 0.3)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      Start Course
                    </button>
                  </div>
                </motion.div>
                </Link>
              </Tilt3D>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
