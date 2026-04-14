"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    title: "1. Aceitacao dos Termos",
    content: "Ao acessar e utilizar a plataforma YouCash, voce concorda com estes Termos de Uso. Caso nao concorde com algum dos termos, por favor, nao utilize a plataforma.",
  },
  {
    title: "2. Conta do Usuario",
    content: "Voce e responsavel por manter a confidencialidade de sua conta e senha. Cada conta e pessoal e intransferivel. Notifique-nos imediatamente sobre qualquer uso nao autorizado.",
  },
  {
    title: "3. Uso da Plataforma",
    content: "A plataforma deve ser utilizada apenas para fins educacionais legitimos. E proibido compartilhar, redistribuir ou revender o conteudo dos cursos sem autorizacao expressa.",
  },
  {
    title: "4. Propriedade Intelectual",
    content: "Todo o conteudo disponivel na plataforma, incluindo videos, textos, imagens e materiais de apoio, e protegido por direitos autorais e pertence ao YouCash e seus instrutores.",
  },
  {
    title: "5. Certificados",
    content: "Os certificados sao emitidos automaticamente apos a conclusao de 100% do curso. Eles atestam a participacao e conclusao do conteudo, mas nao possuem valor de diploma academico.",
  },
  {
    title: "6. Pagamentos e Reembolsos",
    content: "Solicitacoes de reembolso devem ser feitas em ate 7 dias apos a compra, atraves do email accesssupport.ai@gmail.com. Apos esse prazo, nao serao aceitas solicitacoes de reembolso.",
  },
  {
    title: "7. Modificacoes",
    content: "Reservamo-nos o direito de modificar estes termos a qualquer momento. Alteracoes significativas serao comunicadas por email ou notificacao na plataforma.",
  },
];

export default function TermsPage() {
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
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>Termos de Uso</h1>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Regras e condicoes</p>
        </div>
      </motion.div>

      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.06 }}
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
