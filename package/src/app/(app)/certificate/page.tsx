"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";

export default function CertificatePage() {
  const router = useRouter();
  const { t } = useI18n();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { 
        setLoading(false); 
        return; 
      }

      setUserEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.display_name || profile.username || user.email?.split("@")[0] || "Student");
      } else {
        setUserName(user.email?.split("@")[0] || "Student");
      }

      // Check if user completed the course (check lesson_progress)
      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id);

      // For now, consider completed if they have watched at least 5 lessons
      setCourseCompleted((progress?.length || 0) >= 5);
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: "#0a0a0f",
        useCORS: true,
      });
      
      const link = document.createElement("a");
      link.download = `TikCash_Certificate_${userName.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ 
          height: "400px", 
          background: "rgba(255,255,255,0.03)", 
          borderRadius: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ color: "var(--text-muted)" }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex", alignItems: "center", gap: "16px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.05)", border: "none",
            borderRadius: "12px", padding: "10px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#fff" }}>
          {t("myCertificate")}
        </h1>
      </motion.div>

      {/* Certificate Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: "24px" }}
      >
        <div
          ref={certificateRef}
          style={{
            background: "linear-gradient(145deg, #0d0d1a 0%, #1a1a2e 50%, #0d0d1a 100%)",
            borderRadius: "20px",
            border: "2px solid rgba(254,44,85,0.3)",
            padding: "40px 30px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative elements */}
          <div style={{
            position: "absolute", top: "-50px", right: "-50px",
            width: "150px", height: "150px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254,44,85,0.15) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", bottom: "-30px", left: "-30px",
            width: "100px", height: "100px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,244,238,0.1) 0%, transparent 70%)",
          }} />

          {/* TikCash Logo */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M30 8V28C30 33.5 25.5 38 20 38C14.5 38 10 33.5 10 28C10 22.5 14.5 18 20 18C21.5 18 23 18.3 24 18.8V8H30Z" fill="#25F4EE" transform="translate(-2, -1)"/>
              <path d="M30 8V28C30 33.5 25.5 38 20 38C14.5 38 10 33.5 10 28C10 22.5 14.5 18 20 18C21.5 18 23 18.3 24 18.8V8H30Z" fill="#FE2C55" transform="translate(2, 1)"/>
              <path d="M30 8V28C30 33.5 25.5 38 20 38C14.5 38 10 33.5 10 28C10 22.5 14.5 18 20 18C21.5 18 23 18.3 24 18.8V8H30Z" fill="#fff"/>
              <text x="20" y="32" textAnchor="middle" fill="#000" fontSize="14" fontWeight="800" fontFamily="system-ui">$</text>
              <circle cx="36" cy="12" r="7" fill="#25f4ee" stroke="#fff" strokeWidth="2"/>
              <text x="36" y="15.5" textAnchor="middle" fill="#000" fontSize="9" fontWeight="800" fontFamily="system-ui">$</text>
            </svg>
          </div>

          {/* Certificate Title */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 style={{
              fontSize: "12px", fontWeight: 700, color: "#fe2c55",
              textTransform: "uppercase", letterSpacing: "3px", marginBottom: "8px",
            }}>
              Certificate of Completion
            </h2>
            <h3 style={{
              fontSize: "24px", fontWeight: 900, color: "#fff",
              marginBottom: "4px",
            }}>
              TikCash
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Official Training Program
            </p>
          </div>

          {/* Recipient */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
              This is to certify that
            </p>
            <p style={{
              fontSize: "28px", fontWeight: 800,
              background: "linear-gradient(135deg, #fe2c55, #25f4ee)",
              backgroundClip: "text", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
            }}>
              {userName}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              has successfully completed the course
            </p>
          </div>

          {/* Date and Verification */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "20px", marginTop: "20px",
          }}>
            <div>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px" }}>
                Date of Completion
              </p>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                {currentDate}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "4px" }}>
                Certificate ID
              </p>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#25f4ee" }}>
                TR-{Date.now().toString(36).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Seal */}
          <div style={{
            position: "absolute", bottom: "30px", right: "30px",
            width: "60px", height: "60px", borderRadius: "50%",
            border: "2px solid rgba(254,44,85,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(254,44,85,0.1)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fe2c55">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fe2c55" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Download Button */}
      {courseCompleted ? (
        <motion.button
          onClick={handleDownload}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(254,44,85,0.4)" }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%", padding: "16px", fontSize: "15px", fontWeight: 700,
            background: "linear-gradient(135deg, #fe2c55 0%, #ff4070 100%)",
            color: "#fff",
            border: "none", borderRadius: "50px", cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 15px rgba(254,44,85,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {t("downloadCertificate")}
        </motion.button>
      ) : (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "24px",
          textAlign: "center",
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" style={{ marginBottom: "12px" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            {t("completeCourseFirst")}
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            {t("completeCourseDesc")}
          </p>
          <motion.button
            onClick={() => router.push("/course/tikcash-program")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "12px 24px", fontSize: "14px", fontWeight: 700,
              background: "rgba(254,44,85,0.15)",
              color: "#fe2c55",
              border: "1px solid rgba(254,44,85,0.3)",
              borderRadius: "50px", cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {t("goToClass")}
          </motion.button>
        </div>
      )}
    </div>
  );
}
