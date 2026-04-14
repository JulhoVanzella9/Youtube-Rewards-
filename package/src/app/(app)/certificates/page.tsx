"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Certificate = {
  id: string;
  course_id: string;
  course_title: string;
  instructor: string;
  total_lessons: number;
  duration: string;
  completed_at: string;
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      const supabase = createClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar certificados do usuario (futuramente do banco)
      // Por enquanto, comeca zerado
      setCertificates([]);
      setLoading(false);
    };

    loadCertificates();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", textAlign: "center", paddingTop: "100px" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: "40px", height: "40px", margin: "0 auto", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#FF0000", borderRadius: "50%" }}
        />
        <p style={{ marginTop: "16px", color: "var(--text-muted)" }}>Carregando certificados...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", paddingBottom: "100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}
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
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>Meus Certificados</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {certificates.length} certificado{certificates.length !== 1 ? "s" : ""} conquistado{certificates.length !== 1 ? "s" : ""}
          </p>
        </div>
      </motion.div>

      {/* Earned Certificates */}
      {certificates.length > 0 ? (
        <section style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#282828", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Conquistados
          </h3>
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              style={{
                background: "linear-gradient(135deg, rgba(37,244,238,0.06), rgba(254,44,85,0.04))",
                borderRadius: "20px", border: "1px solid rgba(37,244,238,0.12)",
                padding: "20px", marginBottom: "12px",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", top: "-20px", right: "-20px",
                width: "80px", height: "80px", borderRadius: "50%",
                background: "rgba(37,244,238,0.06)", filter: "blur(20px)",
              }} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", position: "relative" }}>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    background: "linear-gradient(135deg, #282828, #00d4aa)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "28px", flexShrink: 0,
                    boxShadow: "0 0 20px rgba(37,244,238,0.2)",
                  }}
                >
                  🎓
                </motion.div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                    {cert.course_title}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                    Instrutor: {cert.instructor} - {cert.total_lessons} aulas
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "20px", fontSize: "10px",
                      fontWeight: 700, background: "rgba(37,244,238,0.12)", color: "#282828",
                    }}>
                      Concluido
                    </span>
                    <span style={{
                      padding: "4px 10px", borderRadius: "20px", fontSize: "10px",
                      fontWeight: 600, background: "rgba(255,255,255,0.04)", color: "var(--text-muted)",
                    }}>
                      {cert.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certificate Card Visual */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  marginTop: "16px", padding: "16px",
                  background: "rgba(0,0,0,0.3)", borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>
                  Certificado de Conclusao
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                  {cert.course_title}
                </div>
                <div style={{ fontSize: "11px", color: "#282828" }}>
                  YouCash Academy - 2025
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    marginTop: "12px", padding: "8px 20px", fontSize: "12px", fontWeight: 700,
                    background: "rgba(37,244,238,0.12)", color: "#282828",
                    border: "1px solid rgba(37,244,238,0.2)", borderRadius: "10px",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Baixar PDF
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </section>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "40px 20px" }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎓</div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            Nenhum certificado ainda
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
            Complete um curso para ganhar seu primeiro certificado!
          </p>
          <Link href="/explore">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(254,44,85,0.4)", translateY: -2 }}
              whileTap={{ scale: 0.97, translateY: 1 }}
              className="glow-btn"
              style={{
                padding: "14px 32px", fontSize: "15px", fontWeight: 700,
                background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
                color: "#fff",
                border: "none", borderRadius: "50px", cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 15px rgba(254,44,85,0.3), inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 0 #c41e40",
                transform: "perspective(500px) rotateX(2deg)",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              Explorar Cursos
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
