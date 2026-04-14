"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user has a valid session for password reset
    const supabase = createClient();
    if (!supabase) { router.push("/login"); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Senha alterada com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #0a0a1a 0%, #000000 50%, #0a0512 100%)",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-10%", right: "-10%",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(254,44,85,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%", maxWidth: "420px",
          background: "linear-gradient(145deg, rgba(26,26,46,0.95) 0%, rgba(18,18,30,0.98) 100%)",
          borderRadius: "24px", border: "1px solid rgba(255,255,255,0.06)",
          padding: "40px 32px", position: "relative", backdropFilter: "blur(40px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "36px" }}
        >
          <div
            style={{
              width: "60px", height: "60px", borderRadius: "16px",
              background: "linear-gradient(135deg, #FF0000, #282828)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: "28px", color: "#fff",
              margin: "0 auto 16px", boxShadow: "0 0 30px rgba(254,44,85,0.3)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <path d="M34.1451 10.7141C32.6227 8.99576 31.7497 6.78498 31.7459 4.5H25.0962V31.8C25.0485 33.1951 24.476 34.5201 23.4919 35.5048C22.5078 36.4895 21.1879 37.0605 19.8069 37.1045C16.8878 37.1045 14.5152 34.6973 14.5152 31.7318C14.5152 28.1641 17.8969 25.4473 21.4098 26.4891V19.6636C14.1598 18.7705 7.84152 24.4773 7.84152 31.7318C7.84152 38.7864 13.6098 43.8 19.7911 43.8C26.4098 43.8 31.7459 38.3914 31.7459 31.7318V17.8623C34.4179 19.7873 37.6319 20.8187 40.9311 20.8145V14.0682C40.9311 14.0682 37.0789 14.2377 34.1451 10.7141Z" fill="white"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px" }}>
            Nova Senha
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
            Digite sua nova senha
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "12px 16px", borderRadius: "12px",
              background: "rgba(254,44,85,0.1)", border: "1px solid rgba(254,44,85,0.2)",
              color: "#FF0000", fontSize: "13px", fontWeight: 600,
              marginBottom: "16px", textAlign: "center",
            }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "12px 16px", borderRadius: "12px",
              background: "rgba(37,244,238,0.1)", border: "1px solid rgba(37,244,238,0.2)",
              color: "#282828", fontSize: "13px", fontWeight: 600,
              marginBottom: "16px", textAlign: "center",
            }}
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ marginBottom: "16px" }}
          >
            <div
              style={{
                position: "relative", borderRadius: "12px",
                border: focusedField === "password" ? "2px solid var(--tikcash-red)" : "2px solid rgba(255,255,255,0.1)",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxShadow: focusedField === "password" ? "0 0 0 4px rgba(254,44,85,0.1)" : "none",
                overflow: "hidden",
              }}
            >
              <input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
                minLength={6}
                style={{
                  width: "100%", padding: "16px 18px", fontSize: "16px",
                  background: "rgba(255,255,255,0.04)", border: "none",
                  color: "#fff", outline: "none", fontFamily: "inherit",
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ marginBottom: "16px" }}
          >
            <div
              style={{
                position: "relative", borderRadius: "12px",
                border: focusedField === "confirm" ? "2px solid var(--tikcash-red)" : "2px solid rgba(255,255,255,0.1)",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxShadow: focusedField === "confirm" ? "0 0 0 4px rgba(254,44,85,0.1)" : "none",
                overflow: "hidden",
              }}
            >
              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirm")}
                onBlur={() => setFocusedField(null)}
                required
                minLength={6}
                style={{
                  width: "100%", padding: "16px 18px", fontSize: "16px",
                  background: "rgba(255,255,255,0.04)", border: "none",
                  color: "#fff", outline: "none", fontFamily: "inherit",
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(254,44,85,0.4)", translateY: -2 }}
              whileTap={{ scale: 0.98, translateY: 1 }}
              style={{
                width: "100%", padding: "16px", fontSize: "16px", fontWeight: 700,
                background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
                color: "#fff", border: "none", borderRadius: "16px",
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                letterSpacing: "0.3px", opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 15px rgba(254,44,85,0.3), inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 0 #c41e40",
                transform: "perspective(500px) rotateX(2deg)",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {loading ? "Salvando..." : "Salvar Nova Senha"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
