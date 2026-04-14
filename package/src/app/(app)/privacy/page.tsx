"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    title: "Coleta de Dados",
    content: "Coletamos apenas as informacoes necessarias para o funcionamento da plataforma, como email, nome de usuario e dados de progresso nos cursos. Nao vendemos ou compartilhamos seus dados com terceiros.",
  },
  {
    title: "Uso dos Dados",
    content: "Seus dados sao utilizados exclusivamente para personalizar sua experiencia na plataforma, salvar seu progresso, gerar certificados e manter seu historico de atividades.",
  },
  {
    title: "Armazenamento",
    content: "Todos os dados sao armazenados de forma segura utilizando criptografia. Utilizamos o Supabase como provedor de banco de dados, que segue as melhores praticas de seguranca da industria.",
  },
  {
    title: "Cookies",
    content: "Utilizamos cookies essenciais para manter sua sessao ativa e garantir uma experiencia fluida na plataforma. Nao utilizamos cookies de rastreamento ou publicidade.",
  },
  {
    title: "Seus Direitos",
    content: "Voce tem o direito de acessar, corrigir ou solicitar a exclusao de seus dados pessoais a qualquer momento. Entre em contato conosco pelo suporte para exercer esses direitos.",
  },
];

export default function PrivacyPage() {
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
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>Politica de Privacidade</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Como protegemos seus dados</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          background: "rgba(255,0,0,0.05)", borderRadius: "16px",
          border: "1px solid rgba(255,0,0,0.1)", padding: "16px 20px",
          marginBottom: "24px", fontSize: "13px", color: "#282828",
          lineHeight: 1.6, fontWeight: 500,
        }}
      >
        Sua privacidade e muito importante para nos. Leia abaixo como tratamos seus dados.
      </motion.div>

      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.08 }}
          style={{
            background: "rgba(255,255,255,0.02)", borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.04)", padding: "20px",
            marginBottom: "12px",
          }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            {section.title}
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            {section.content}
          </p>
        </motion.div>
      ))}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: "var(--text-muted)" }}
      >
        Ultima atualizacao: Janeiro 2025
      </motion.p>
    </div>
  );
}
