"use client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getCourseById, getModuleById } from "@/app/data/courses";
import { useTheme } from "@/lib/theme/context";

// Module images organized by course ID
const courseModuleImages: Record<string, Record<string, string>> = {
  "tikcash-program": {
    "mod-1": "/images/modules/module-01.png",
    "mod-2": "/images/modules/module-02.png",
    "mod-3": "/images/modules/module-03.png",
    "mod-4": "/images/modules/module-04.png",
    "mod-5": "/images/modules/module-05.png",
    "mod-6": "/images/modules/module-06.png",
    "mod-7": "/images/modules/module-07.png",
    "mod-8": "/images/modules/module-08.png",
    "mod-9": "/images/modules/module-09.png",
  },
  "tikcash-community": {
    "tc-mod-1": "/images/modules/tc-module-01.jpg",
    "tc-mod-2": "/images/modules/tc-module-02.jpg",
    "tc-mod-3": "/images/modules/tc-module-03.jpg",
    "tc-mod-4": "/images/modules/tc-module-04.jpg",
  },
  "money-robot": {
    "mr-mod-1": "/images/modules/mr-module-01.jpg",
    "mr-mod-2": "/images/modules/mr-module-02.jpg",
    "mr-mod-3": "/images/modules/mr-module-03.jpg",
    "mr-mod-4": "/images/modules/mr-module-04.jpg",
    "mr-mod-5": "/images/modules/mr-module-05.jpg",
    "mr-mod-6": "/images/modules/mr-module-06.jpg",
  },
};

// Array-based fallback for courses with indexed modules
const courseModuleImagesArray: Record<string, string[]> = {
  "tikcash-program": [
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
  "tikcash-community": [
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

// Helper function to get module image
function getModuleImage(courseId: string, moduleId: string): string {
  // First try direct mapping
  const courseImages = courseModuleImages[courseId];
  if (courseImages && courseImages[moduleId]) {
    return courseImages[moduleId];
  }
  
  // Fallback: try array-based lookup by extracting the module number
  const arrayImages = courseModuleImagesArray[courseId];
  if (arrayImages) {
    // Extract number from moduleId (e.g., "mod-1" -> 0, "tc-mod-2" -> 1)
    const match = moduleId.match(/(\d+)$/);
    if (match) {
      const index = parseInt(match[1]) - 1;
      if (arrayImages[index]) {
        return arrayImages[index];
      }
    }
  }
  
  return "/images/modules/module-01.png";
}

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const course = getCourseById(params.courseId as string);
  const courseModule = getModuleById(params.courseId as string, params.moduleId as string);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  if (!course || !courseModule) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ color: "var(--text-primary)", marginBottom: "12px" }}>Module not found</h2>
        <Link href={`/course/${params.courseId}`} style={{ color: "#fe2c55", fontWeight: 600, fontSize: "14px" }}>
          Back to course
        </Link>
      </div>
    );
  }

  if (courseModule.comingSoon) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        paddingBottom: "100px",
        background: isDarkMode ? "#000" : "#f8f8f8",
      }}>
        {/* Header */}
        <div style={{ 
          padding: "16px",
          background: isDarkMode ? "#000" : "#fff",
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
            <h1 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              {courseModule.title}
            </h1>
          </div>
        </div>
        
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "linear-gradient(135deg, #fe2c55 0%, #ff4070 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
            Coming Soon
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "280px", margin: "0 auto" }}>
            This module is being prepared. Stay tuned for updates!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      paddingBottom: "100px",
      background: isDarkMode ? "#000" : "#f8f8f8",
    }}>
      {/* Header with back button */}
      <div style={{ 
        padding: "12px 16px",
        background: isDarkMode ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)",
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 10,
        backdropFilter: "blur(10px)",
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer",
            color: "#fff", display: "flex", alignItems: "center",
            padding: "8px 12px", borderRadius: "8px", gap: "6px",
            fontSize: "14px", fontWeight: 500,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
      </div>

      {/* Module Banner Image */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1/1",
        maxHeight: "280px",
        overflow: "hidden",
      }}>
        <img 
          src={getModuleImage(params.courseId as string, params.moduleId as string)}
          alt={courseModule.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
          padding: "40px 16px 16px",
        }}>
          <h1 style={{ 
            fontSize: "18px", 
            fontWeight: 700, 
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}>
            {courseModule.title}
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>
            {courseModule.subModules.length} sections
          </p>
        </div>
      </div>

      {/* SubModules List */}
      <div style={{ padding: "0" }}>
        {courseModule.subModules.map((subModule, index) => (
          <motion.div
            key={subModule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/course/${params.courseId}/module/${params.moduleId}/submodule/${subModule.id}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "20px 16px",
                background: isDarkMode ? "#0a0a0a" : "#fff",
                borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                transition: "background 0.2s",
              }}>
                {/* Number Badge */}
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: isDarkMode ? "#1a1a1a" : "#f0f0f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "16px",
                  color: "var(--text-primary)",
                  flexShrink: 0,
                }}>
                  {index + 1}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: "15px", fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                    lineHeight: 1.4,
                  }}>
                    {subModule.title}
                  </h3>
                  <p style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}>
                    {subModule.lessons.length} lessons
                  </p>
                </div>

                {/* Arrow */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
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
