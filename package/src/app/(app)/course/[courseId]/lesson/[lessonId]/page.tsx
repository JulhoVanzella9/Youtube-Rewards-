"use client";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getLessonById, getAllLessons, getNextLesson, getPrevLesson } from "@/app/data/courses";
import { useState } from "react";
import { useProgress } from "@/lib/hooks/useProgress";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const [showList, setShowList] = useState(false);
  const [saving, setSaving] = useState(false);
  const { markLessonComplete, isLessonCompleted } = useProgress();

  const result = getLessonById(courseId, lessonId);
  if (!result) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ color: "#fff" }}>Lesson not found</h2>
        <Link href="/explore" style={{ color: "#fe2c55", fontWeight: 600 }}>← Back</Link>
      </div>
    );
  }

  const { course, lesson } = result;
  const allLessons = getAllLessons(course);
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson = getNextLesson(course, lessonId);
  const prevLesson = getPrevLesson(course, lessonId);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "100px" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 10,
        background: "var(--bg-primary)",
      }}>
        <Link href={`/course/${courseId}`} style={{
          display: "flex", alignItems: "center", gap: "8px",
          color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500,
          textDecoration: "none",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span style={{
            maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>{course.title}</span>
        </Link>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowList(!showList)}
          style={{
            background: showList ? "rgba(254,44,85,0.15)" : "rgba(255,255,255,0.06)",
            border: showList ? "1px solid rgba(254,44,85,0.3)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px", padding: "8px 16px", cursor: "pointer",
            color: showList ? "#fe2c55" : "#fff", fontSize: "13px", fontWeight: 600, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          {currentIndex + 1} of {allLessons.length}
        </motion.button>
      </div>

      {/* Lessons List - Slides down when toggled */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: "hidden",
              background: "rgba(0,0,0,0.4)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ 
              padding: "16px 20px", 
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>
                  Course Content
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {currentIndex + 1} of {allLessons.length} lessons
                </div>
              </div>
              <button
                onClick={() => setShowList(false)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", padding: "4px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {course.modules.map((mod) => (
                <div key={mod.id}>
                  <div style={{
                    padding: "10px 20px", background: "rgba(255,255,255,0.02)",
                    fontSize: "11px", fontWeight: 700, color: "#fe2c55",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>
                    {mod.title}
                  </div>
                  {mod.subModules?.map((subMod) => (
                    subMod.lessons.map((les) => {
                      const isActive = les.id === lessonId;
                      const gIdx = allLessons.findIndex((l) => l.id === les.id);
                      const isCompleted = isLessonCompleted(courseId, les.id);
                      return (
                        <Link
                          key={les.id}
                          href={`/course/${courseId}/lesson/${les.id}`}
                          onClick={() => setShowList(false)}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <div style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "12px 20px", cursor: "pointer",
                            background: isActive ? "rgba(254,44,85,0.1)" : "transparent",
                            borderLeft: isActive ? "3px solid #fe2c55" : "3px solid transparent",
                            transition: "all 0.2s",
                          }}>
                            <div style={{
                              width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                              background: isActive ? "#fe2c55" : isCompleted ? "#25f4ee" : "rgba(255,255,255,0.08)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "11px", fontWeight: 700, 
                              color: isActive || isCompleted ? "#fff" : "var(--text-muted)",
                            }}>
                              {isCompleted && !isActive ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              ) : gIdx + 1}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: "14px", fontWeight: isActive ? 600 : 400,
                                color: isActive ? "#fff" : "var(--text-secondary)",
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                              }}>
                                {les.title}
                              </div>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                                {les.duration}
                              </div>
                            </div>
                            {isActive && (
                              <div style={{
                                width: "8px", height: "8px", borderRadius: "50%",
                                background: "#fe2c55",
                              }}/>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video or Text Content */}
      {lesson.contentType === "video" && lesson.videoUrl ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "relative", paddingTop: "56.25%", background: "#000",
          }}
        >
          <iframe
            src={lesson.videoUrl}
            style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={lesson.title}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "32px 20px",
            background: "linear-gradient(145deg, rgba(254,44,85,0.05) 0%, transparent 100%)",
            minHeight: "200px",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px",
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                <path d="M33.5 7.7c-1.3-1.5-2.1-3.4-2.1-5.2h-5.7v23.3c0 3.1-2.5 5.7-5.7 5.7s-5.7-2.5-5.7-5.7 2.5-5.7 5.7-5.7c.6 0 1.2.1 1.8.3v-5.5c-.6-.1-1.2-.1-1.8-.1-6.2 0-11.2 5-11.2 11.2S13.8 37 20 37s11.2-5 11.2-11.2V14.5c2.3 1.6 5.1 2.6 8.1 2.5v-5.5c-2.2-.1-4.3-1.4-5.8-3.8z" fill="#25F4EE" transform="translate(-2, -1)"/>
                <path d="M33.5 7.7c-1.3-1.5-2.1-3.4-2.1-5.2h-5.7v23.3c0 3.1-2.5 5.7-5.7 5.7s-5.7-2.5-5.7-5.7 2.5-5.7 5.7-5.7c.6 0 1.2.1 1.8.3v-5.5c-.6-.1-1.2-.1-1.8-.1-6.2 0-11.2 5-11.2 11.2S13.8 37 20 37s11.2-5 11.2-11.2V14.5c2.3 1.6 5.1 2.6 8.1 2.5v-5.5c-2.2-.1-4.3-1.4-5.8-3.8z" fill="#FE2C55" transform="translate(2, 1)"/>
                <path d="M33.5 7.7c-1.3-1.5-2.1-3.4-2.1-5.2h-5.7v23.3c0 3.1-2.5 5.7-5.7 5.7s-5.7-2.5-5.7-5.7 2.5-5.7 5.7-5.7c.6 0 1.2.1 1.8.3v-5.5c-.6-.1-1.2-.1-1.8-.1-6.2 0-11.2 5-11.2 11.2S13.8 37 20 37s11.2-5 11.2-11.2V14.5c2.3 1.6 5.1 2.6 8.1 2.5v-5.5c-2.2-.1-4.3-1.4-5.8-3.8z" fill="#fff"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>Text Lesson</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Read the content below</p>
            </div>
          </div>
          <div 
            style={{
              fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.8,
              background: "rgba(0,0,0,0.3)", padding: "24px", borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            dangerouslySetInnerHTML={{ __html: lesson.textContent || lesson.description }}
          />
        </motion.div>
      )}

      {/* Lesson info */}
      <div style={{ padding: "24px 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{
              padding: "5px 12px", borderRadius: "20px", fontSize: "12px",
              fontWeight: 600, background: "rgba(254,44,85,0.12)", color: "#fe2c55",
            }}>
              Lesson {currentIndex + 1} of {allLessons.length}
            </span>
            <span style={{
              padding: "5px 12px", borderRadius: "20px", fontSize: "12px",
              fontWeight: 500, background: "rgba(255,255,255,0.06)",
              color: "var(--text-muted)",
            }}>
              {lesson.duration}
            </span>
          </div>

          <h1 style={{
            fontSize: "22px", fontWeight: 800, color: "#fff",
            lineHeight: 1.3, marginBottom: "12px",
          }}>
            {lesson.title}
          </h1>

          <p style={{
            fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7,
            marginBottom: "28px",
          }}>
            {lesson.description}
          </p>

          {/* Navigation buttons */}
          <div style={{
            display: "flex", gap: "12px",
          }}>
            {prevLesson && (
              <Link href={`/course/${courseId}/lesson/${prevLesson.id}`} style={{ flex: 1 }}>
                <button
                  className="btn-3d btn-3d-dark btn-3d-full"
                  style={{
                    fontFamily: "inherit",
                    gap: "8px",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Previous
                </button>
              </Link>
            )}
            {nextLesson ? (
              <button
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  await markLessonComplete(courseId, lessonId, allLessons.length);
                  router.push(`/course/${courseId}/lesson/${nextLesson.id}`);
                }}
                className="btn-3d btn-3d-primary"
                style={{
                  flex: prevLesson ? 1.5 : 1,
                  fontFamily: "inherit",
                  gap: "8px",
                  cursor: saving ? "wait" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving..." : "Complete & Continue"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            ) : (
              <button
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  await markLessonComplete(courseId, lessonId, allLessons.length);
                  router.push(`/course/${courseId}`);
                }}
                className="btn-3d btn-3d-cyan"
                style={{
                  flex: 1,
                  fontFamily: "inherit",
                  cursor: saving ? "wait" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  gap: "8px",
                }}
              >
                {saving ? "Saving..." : "Complete Course"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
