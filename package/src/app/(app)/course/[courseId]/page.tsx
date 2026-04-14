"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getCourseById, Module, SubModule  } from "@/app/data/courses";
import { useTheme } from "@/lib/theme/context";

// Module images for different courses
const courseModuleImages: Record<string, string[]> = {
  "youcash-program": [
    "/images/modules/module-01.png",
    "/images/modules/module-02.png",
    "/images/modules/module-03.png",
    "/images/modules/module-04.png",
    "/images/modules/module-05.png",
    "/images/modules/module-06.png",
    "/images/modules/module-07.png",
    "/images/modules/module-08.png",
    "/images/modules/module-09.png",
  ],
  "youcash-community": [
    "/images/modules/tc-module-01.jpg",
    "/images/modules/tc-module-02.jpg",
    "/images/modules/tc-module-03.jpg",
    "/images/modules/tc-module-04.jpg",
  ],
  "money-robot": [
    "/images/modules/mr-module-01.jpg",
    "/images/modules/mr-module-02.jpg",
    "/images/modules/mr-module-03.jpg",
    "/images/modules/mr-module-04.jpg",
    "/images/modules/mr-module-05.jpg",
    "/images/modules/mr-module-06.jpg",
  ],
};

export default function CourseDetailPage() {
  const params = useParams();
  const course = getCourseById(params.courseId as string);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
  const [selectedSubModule, setSelectedSubModule] = useState<SubModule | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedModule || selectedSubModule) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [selectedModule, selectedSubModule]);

  if (!course) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ color: "var(--text-primary)", marginBottom: "12px" }}>Course not found</h2>
        <Link href="/" style={{ color: "#FF0000", fontWeight: 600, fontSize: "14px" }}>
          Back to home
        </Link>
      </div>
    );
  }

  // Count total lessons
  const getTotalLessons = (moduleIndex: number) => {
    const courseModule = course.modules[moduleIndex];
    if (!courseModule || courseModule.comingSoon) return 0;
    return courseModule.subModules.reduce((acc, sm) => acc + sm.lessons.length, 0);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      paddingBottom: "100px",
      background: isDarkMode ? "#000" : "#f8f8f8",
    }}>
      {/* Header */}
      <div style={{ 
        padding: "20px 16px 16px",
        background: isDarkMode ? "#000" : "#fff",
        borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#000",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <svg width="24" height="17" viewBox="0 0 68 48" fill="none">
              <path d="M66.52 7.74C65.72 4.64 63.28 2.2 60.18 1.4C54.9 0 34 0 34 0S13.1 0 7.82 1.4C4.72 2.2 2.28 4.64 1.48 7.74C0 13.02 0 24 0 24S0 34.98 1.48 40.26C2.28 43.36 4.72 45.8 7.82 46.6C13.1 48 34 48 34 48S54.9 48 60.18 46.6C63.28 45.8 65.72 43.36 66.52 40.26C68 34.98 68 24 68 24S68 13.02 66.52 7.74Z" fill="#FF0000"/>
              <path d="M27 34V14L45 24L27 34Z" fill="white"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
              {course.title}
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {course.modules.length} modules - {course.totalLessons} lessons
            </p>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div style={{ 
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {course.modules.map((module, index) => {
            const courseImages = courseModuleImages[course.id] || courseModuleImages["youcash-program"];
            const moduleImage = courseImages[index] || courseImages[0] || "/images/modules/module-01.png";
            const totalLessons = getTotalLessons(index);
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.04,
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <div
                  onClick={() => {
                    if (!module.comingSoon) {
                      setSelectedModule(module);
                      setSelectedModuleIndex(index);
                    }
                  }}
                  style={{ textDecoration: "none", cursor: module.comingSoon ? "not-allowed" : "pointer" }}
                >
                  <motion.div 
                    whileHover={module.comingSoon ? {} : { y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}
                    whileTap={module.comingSoon ? {} : { scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      background: isDarkMode ? "#0f0f0f" : "#fff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                      opacity: module.comingSoon ? 0.5 : 1,
                      cursor: module.comingSoon ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}>
                    {/* Module Image */}
                    <div style={{
                      position: "relative",
                      aspectRatio: "1/1",
                      overflow: "hidden",
                    }}>
                      <motion.img 
                        src={moduleImage} 
                        alt={module.title}
                        whileHover={module.comingSoon ? {} : { scale: 1.05 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transformOrigin: "center",
                        }}
                      />
                      {module.comingSoon && (
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <span style={{
                            background: "rgba(255,0,0,0.9)",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#fff",
                            textTransform: "uppercase",
                          }}>
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Module Info */}
                    <div style={{ padding: "14px", background: isDarkMode ? "#0a0a0a" : "#fff" }}>
                      <h3 style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        lineHeight: 1.3,
                        minHeight: "34px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                        marginBottom: "6px",
                      }}>
                        {module.title.replace("Module 0", "Module ").replace("ProfiUp 09", "Module 09")}
                      </h3>
                      <p style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                      }}>
                        {module.comingSoon ? "Coming Soon" : `${module.subModules.length} sections - ${totalLessons} lessons`}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sheet Modal - Sections List */}
      <AnimatePresence>
        {selectedModule && !selectedSubModule && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModule(null)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 100,
              }}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed",
                bottom: "calc(68px + env(safe-area-inset-bottom, 0px))",
                left: 0,
                right: 0,
                maxHeight: "70vh",
                background: isDarkMode ? "#0f0f0f" : "#fff",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                zIndex: 101,
                overflow: "hidden",
                boxShadow: "0 -10px 40px rgba(0,0,0,0.3)",
              }}
            >
              {/* Handle Bar */}
              <div style={{
                width: "100%",
                padding: "12px 0",
                display: "flex",
                justifyContent: "center",
              }}>
                <div style={{
                  width: "40px",
                  height: "4px",
                  borderRadius: "2px",
                  background: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                }}/>
              </div>

              {/* Header */}
              <div style={{
                padding: "8px 20px 20px",
                borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
              }}>
                <h2 style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#FF0000",
                  marginBottom: "4px",
                }}>
                  Module {String(selectedModuleIndex + 1).padStart(2, "0")} | {selectedModule.title.replace(/^Module \d+\s*[-|]\s*/i, "")}
                </h2>
                <p style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                }}>
                  {selectedModule.subModules.length} sections
                </p>
              </div>

              {/* Sections List */}
              <div style={{
                padding: "16px 20px",
                paddingBottom: "24px",
                overflowY: "auto",
                maxHeight: "calc(70vh - 100px)",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}>
                {selectedModule.subModules.map((subModule, sIndex) => (
                  <motion.div
                    key={subModule.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    whileTap={{ scale: 0.98, backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                    onClick={() => setSelectedSubModule(subModule)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "16px",
                      marginBottom: "10px",
                      background: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                      borderRadius: "14px",
                      border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                      cursor: "pointer",
                    }}
                  >
                    {/* Section Number */}
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: isDarkMode 
                        ? "linear-gradient(135deg, #1a1a1a, #252542)"
                        : "linear-gradient(135deg, #f0f0f5, #e0e0e8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "15px",
                      color: "#FF0000",
                      flexShrink: 0,
                    }}>
                      {sIndex + 1}
                    </div>

                    {/* Section Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {subModule.title}
                      </h3>
                      <p style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                      }}>
                        {subModule.lessons.length} lessons
                      </p>
                    </div>

                    {/* Arrow */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </motion.div>
                ))}
              </div>

              {/* Close Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedModule(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Sheet Modal - Lessons List */}
      <AnimatePresence>
        {selectedSubModule && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedSubModule(null);
                setSelectedModule(null);
              }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 102,
              }}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed",
                bottom: "calc(68px + env(safe-area-inset-bottom, 0px))",
                left: 0,
                right: 0,
                maxHeight: "75vh",
                background: isDarkMode ? "#0a0a0a" : "#fff",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                zIndex: 103,
                overflow: "hidden",
                boxShadow: "0 -10px 40px rgba(0,0,0,0.4)",
              }}
            >
              {/* Handle Bar */}
              <div style={{
                width: "100%",
                padding: "12px 0",
                display: "flex",
                justifyContent: "center",
              }}>
                <div style={{
                  width: "40px",
                  height: "4px",
                  borderRadius: "2px",
                  background: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                }}/>
              </div>

              {/* Header with Back Button */}
              <div style={{
                padding: "8px 20px 20px",
                borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedSubModule(null)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </motion.button>
                <div>
                  <h2 style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "2px",
                  }}>
                    {selectedSubModule.title}
                  </h2>
                  <p style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                  }}>
                    {selectedSubModule.lessons.length} lessons
                  </p>
                </div>
              </div>

              {/* Lessons List */}
              <div style={{
                padding: "16px 20px",
                paddingBottom: "24px",
                overflowY: "auto",
                maxHeight: "calc(75vh - 120px)",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}>
                {selectedSubModule.lessons.map((lesson, lIndex) => (
                  <Link
                    key={lesson.id}
                    href={`/course/${params.courseId}/lesson/${lesson.id}`}
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                      setSelectedSubModule(null);
                      setSelectedModule(null);
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      whileTap={{ scale: 0.98, backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "14px 16px",
                        marginBottom: "8px",
                        background: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        borderRadius: "14px",
                        border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                        cursor: "pointer",
                      }}
                    >
                      {/* Icon - Play for video, Number for text */}
                      <div style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: lesson.contentType === "video" 
                          ? "#FF0000" 
                          : isDarkMode 
                            ? "rgba(255,255,255,0.08)" 
                            : "rgba(0,0,0,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {lesson.contentType === "video" ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                        ) : (
                          <span style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}>
                            {lIndex + 1}
                          </span>
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: "3px",
                          lineHeight: 1.3,
                        }}>
                          {lesson.title}
                        </h3>
                        <p style={{
                          fontSize: "12px",
                          color: lesson.contentType === "video" ? "#FF0000" : "var(--text-muted)",
                          fontWeight: 500,
                        }}>
                          {lesson.contentType === "video" ? `Video - ${lesson.duration}` : "Text Content"}
                        </p>
                      </div>

                      {/* Arrow */}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </motion.div>
                  </Link>
                ))}
                {/* Scroll indicator - shows there's more content */}
                {selectedSubModule.lessons.length > 4 && (
                  <div style={{
                    textAlign: "center",
                    padding: "12px 0 8px",
                    color: "var(--text-muted)",
                    fontSize: "11px",
                    opacity: 0.5,
                  }}>
                    Scroll for more lessons
                  </div>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedSubModule(null);
                  setSelectedModule(null);
                }}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
