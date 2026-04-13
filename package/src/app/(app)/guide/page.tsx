"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    title: "1. Crie sua conta",
    desc: "Cadastre-se com seu email e senha. Voce recebera um email de confirmacao para ativar sua conta.",
    color: "#fe2c55",
  },
  {
    title: "2. Explore os cursos",
    desc: "Navegue pela pagina Explorar e descubra cursos sobre criacao de conteudo, monetizacao e crescimento online.",
    color: "#25f4ee",
  },
  {
    title: "3. Comece a assistir",
    desc: "Clique em um curso para ver os modulos e aulas. Acompanhe seu progresso automaticamente conforme avanca.",
    color: "#ff6b35",
  },
  {
    title: "4. Conquiste certificados",
    desc: "Ao completar 100% de um curso, seu certificado e gerado automaticamente na secao Meus Certificados.",
    color: "#a855f7",
  },
  {
    title: "5. Desbloqueie conquistas",
    desc: "Mantenha um streak de estudos, complete cursos e acumule XP para desbloquear conquistas exclusivas.",
    color: "#ffd700",
  },
];

export default function GuidePage() {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", paddingBottom: "100px" }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}
      >
        <Link href="/settings" style={{
          width: "36px", height: "36px", borderRadius: "12px",
          background: "rgba(255,255,255,0.06)", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>Guia de Inicio Rapido</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Aprenda a usar a plataforma</p>
        </div>
      </motion.div>

      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", left: "15px", top: "0", bottom: "0",
          width: "2px", background: "rgba(255,255,255,0.06)",
        }} />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            style={{
              display: "flex", gap: "20px", marginBottom: "24px",
              position: "relative",
            }}
          >
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: `${step.color}20`, border: `2px solid ${step.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: 800, color: step.color,
              flexShrink: 0, position: "relative", zIndex: 1,
            }}>
              {i + 1}
            </div>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.02)", borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.04)", padding: "18px",
            }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                {step.title}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {step.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
