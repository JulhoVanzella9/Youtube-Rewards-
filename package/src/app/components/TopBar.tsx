"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";
import { createClient } from "@/lib/supabase/client";
import RefundModal from "./RefundModal";

const FlagUS = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" style={{ borderRadius: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
    <rect width="24" height="18" fill="#B22234"/>
    <rect width="24" height="1.38" y="1.38" fill="#fff"/>
    <rect width="24" height="1.38" y="4.15" fill="#fff"/>
    <rect width="24" height="1.38" y="6.92" fill="#fff"/>
    <rect width="24" height="1.38" y="9.69" fill="#fff"/>
    <rect width="24" height="1.38" y="12.46" fill="#fff"/>
    <rect width="24" height="1.38" y="15.23" fill="#fff"/>
    <rect width="10" height="9.69" fill="#3C3B6E"/>
  </svg>
);

const FlagBR = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" style={{ borderRadius: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
    <rect width="24" height="18" fill="#009c3b"/>
    <polygon points="12,2 22,9 12,16 2,9" fill="#ffdf00"/>
    <circle cx="12" cy="9" r="4" fill="#002776"/>
  </svg>
);

const FlagES = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" style={{ borderRadius: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
    <rect width="24" height="18" fill="#c60b1e"/>
    <rect width="24" height="9" y="4.5" fill="#ffc400"/>
  </svg>
);

const languages = [
  { code: "en-US", label: "English", Flag: FlagUS },
  { code: "pt-BR", label: "Português", Flag: FlagBR },
  { code: "es-ES", label: "Español", Flag: FlagES },
];

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languagePopupOpen, setLanguagePopupOpen] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceAnimation, setBalanceAnimation] = useState(false);
  const [lastEarnedAmount, setLastEarnedAmount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  // Fetch balance from profiles.total_xp (same source as wallet)
  useEffect(() => {
    const fetchBalance = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("total_xp")
          .eq("id", user.id)
          .single();
        if (data) {
          setBalance((Number(data.total_xp) || 0) / 10000);
        }
      }
    };
    fetchBalance();
  }, []);

  // Listen for balance updates from video rating
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent<{ amount: number }>) => {
      const amount = event.detail.amount;
      setLastEarnedAmount(amount);
      setBalanceAnimation(true);
      setBalance(prev => prev + amount);
      
      // Reset animation after delay
      setTimeout(() => {
        setBalanceAnimation(false);
      }, 2000);
    };

    window.addEventListener("balanceUpdated", handleBalanceUpdate as EventListener);
    return () => {
      window.removeEventListener("balanceUpdated", handleBalanceUpdate as EventListener);
    };
  }, []);

  // Block body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [menuOpen]);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as "en-US" | "pt-BR" | "es-ES");
    setLanguagePopupOpen(false);
  };

  // Top section menu items (normal navigation)
  const topMenuItems = [
    { label: t("wallet"), href: "/wallet", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    )},
    { label: t("class"), href: "/course/youcash-program", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    )},
    { label: "YouCash", href: "/create", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    )},
    { label: t("support") || "Support", href: "/support", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )},
  ];

  // Bottom section menu items (actions)
  const bottomMenuItems = [
    { label: t("installApp") || "Install App", href: "#install", isInstall: true, badge: "App", badgeColor: "#FF0000", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    )},
{ label: t("inviteFriends") || "Invite Friends", href: "#referral", isReferral: true, badge: "+$20", badgeColor: "#00d47e", icon: (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
  <circle cx="9" cy="7" r="4"/>
  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
  )},
  { label: t("requestRefundBtn") || "Request Refund", href: "/refund", isRefund: true, badge: "30 days", badgeColor: "#FF0000", icon: (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
  )},
    { label: t("logout") || "Logout", href: "#logout", isLogout: true, icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    )},
  ];

// Animation variants - menu slides from left
  const menuVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
  x: 0,
  opacity: 1,
  transition: { type: "spring" as const, damping: 25, stiffness: 300 }
  },
  exit: {
  x: "-100%",
  opacity: 0,
  transition: { type: "spring" as const, damping: 30, stiffness: 400 }
  }
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.05, type: "spring" as const, damping: 20, stiffness: 300 }
    })
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: isDarkMode 
            ? "linear-gradient(180deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.95) 100%)" 
            : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
          padding: "0 clamp(8px, 2vw, 14px)", 
          height: "clamp(50px, 13vw, 60px)",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          boxShadow: isDarkMode ? "0 6px 30px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.1)",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
      >
        {/* Left Section - Menu + Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Hamburger Menu - compact */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen(true)}
            style={{
              background: "none",
              border: "none",
              width: "28px", height: "28px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
              padding: 0,
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </motion.button>

          {/* YouCash Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <svg width="36" height="26" viewBox="0 0 68 48" fill="none">
                  <path d="M66.52 7.74C65.72 4.64 63.28 2.2 60.18 1.4C54.9 0 34 0 34 0S13.1 0 7.82 1.4C4.72 2.2 2.28 4.64 1.48 7.74C0 13.02 0 24 0 24S0 34.98 1.48 40.26C2.28 43.36 4.72 45.8 7.82 46.6C13.1 48 34 48 34 48S54.9 48 60.18 46.6C63.28 45.8 65.72 43.36 66.52 40.26C68 34.98 68 24 68 24S68 13.02 66.52 7.74Z" fill="#FF0000"/>
                  <path d="M27 34V14L45 24L27 34Z" fill="white"/>
                </svg>
              </div>
              <span style={{
                fontSize: "clamp(18px, 5vw, 24px)",
                fontWeight: 700,
                color: isDarkMode ? "#fff" : "#0F0F0F",
                letterSpacing: "-0.3px",
                fontFamily: "'Roboto', system-ui, -apple-system, sans-serif",
                whiteSpace: "nowrap",
              }}>
                You<span style={{ color: "#FF0000" }}>Cash</span>
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Right - Balance Display */}
        <Link href="/wallet" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(3px, 1vw, 6px)",
              padding: "clamp(6px, 1.5vw, 10px) clamp(10px, 2.5vw, 16px)",
              background: isDarkMode
                ? "rgba(0,0,0,0.6)"
                : "rgba(255,255,255,0.9)",
              borderRadius: "clamp(10px, 2.5vw, 14px)",
              border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}`,
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <motion.span
              key={balance}
              initial={balanceAnimation ? { scale: 1.3, color: "#22c55e" } : false}
              animate={{ scale: 1, color: "#282828" }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: "clamp(16px, 4vw, 22px)",
                fontWeight: 800,
                color: "#282828",
                whiteSpace: "nowrap",
              }}
            >
              US$ {balance.toFixed(2)}
            </motion.span>
            
            {/* Floating +amount animation */}
            <AnimatePresence>
              {balanceAnimation && (
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -25 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  style={{
                    position: "absolute",
                    top: "-12px",
                    right: "10px",
                    color: "#22c55e",
                    fontSize: "14px",
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                    textShadow: "0 2px 8px rgba(34,197,94,0.5)",
                  }}
                >
                  +${lastEarnedAmount.toFixed(2)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </motion.header>

      {/* Menu Overlay */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => { setMenuOpen(false); setLanguagePopupOpen(false); }}
              style={{
                position: "fixed", inset: 0, zIndex: 100,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            />
            
            {/* Menu Panel */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
position: "fixed", top: 0, left: 0, bottom: 0,
  width: "300px", maxWidth: "85vw", zIndex: 101,
  background: isDarkMode
  ? "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)"
  : "linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)",
  borderRight: `1px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                padding: "24px",
                display: "flex", flexDirection: "column",
                boxShadow: "-10px 0 40px rgba(0,0,0,0.3)",
              }}
            >
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: isDarkMode ? "#fff" : "#000" }}>
                  {t("menu")}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setMenuOpen(false); setLanguagePopupOpen(false); }}
                  style={{
                    background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                    border: "none",
                    borderRadius: "50%", width: "36px", height: "36px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: isDarkMode ? "#fff" : "#000",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </motion.button>
              </motion.div>

              {/* Top Menu Items - Navigation */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {topMenuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link href={item.href} onClick={() => setMenuOpen(false)}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          display: "flex", alignItems: "center", gap: "14px",
                          padding: "16px 18px", borderRadius: "14px",
                          background: pathname === item.href 
                            ? (isDarkMode ? "rgba(254,44,85,0.15)" : "rgba(254,44,85,0.1)")
                            : (isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
                          border: pathname === item.href 
                            ? "1px solid rgba(254,44,85,0.3)" 
                            : `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <span style={{ color: pathname === item.href ? "#FF0000" : (isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)") }}>
                          {item.icon}
                        </span>
                        <span style={{ 
                          fontSize: "15px", fontWeight: 600,
                          color: pathname === item.href ? (isDarkMode ? "#fff" : "#000") : (isDarkMode ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)"),
                        }}>
                          {item.label}
                        </span>
                        {pathname === item.href && (
                          <motion.div
                            layoutId="activeIndicator"
                            style={{
                              marginLeft: "auto",
                              width: "8px", height: "8px",
                              borderRadius: "50%",
                              background: "#FF0000",
                              boxShadow: "0 0 10px rgba(254,44,85,0.5)",
                            }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2 }}
                style={{ 
                  height: "1px", 
                  background: `linear-gradient(90deg, transparent, ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}, transparent)`,
                  margin: "16px 0" 
                }} 
              />

              {/* Bottom Menu Items - Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {bottomMenuItems.map((item, index) => {
                  const actionItem = item as { isInstall?: boolean; isRefund?: boolean; isReferral?: boolean; isLogout?: boolean; badge?: string; badgeColor?: string };
                  
                  const handleClick = async () => {
                    setMenuOpen(false);
                    if (actionItem.isInstall) {
                      const event = new CustomEvent("triggerInstallPrompt");
                      window.dispatchEvent(event);
                    } else if (actionItem.isRefund) {
                      window.location.href = "/refund";
                    } else if (actionItem.isReferral) {
                      const event = new CustomEvent("openReferralModal");
                      window.dispatchEvent(event);
                    } else if (actionItem.isLogout) {
                      const supabase = (await import("@/lib/supabase/client")).createClient();
                      await supabase.auth.signOut();
                      window.location.href = "/login";
                    }
                  };

                  const getBgStyle = () => {
                    if (actionItem.isLogout) {
                      return {
                        background: "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.06) 100%)",
                        border: "1px solid rgba(239,68,68,0.25)",
                      };
                    }
                    if (actionItem.isReferral) {
                      return {
                        background: "linear-gradient(135deg, rgba(0,212,126,0.12) 0%, rgba(0,212,126,0.06) 100%)",
                        border: "1px solid rgba(0,212,126,0.25)",
                      };
                    }
                    if (actionItem.isInstall) {
                      return {
                        background: "linear-gradient(135deg, rgba(254,44,85,0.12) 0%, rgba(254,44,85,0.06) 100%)",
                        border: "1px solid rgba(254,44,85,0.25)",
                      };
                    }
                    if (actionItem.isRefund) {
                      return {
                        background: "linear-gradient(135deg, rgba(254,44,85,0.12) 0%, rgba(254,44,85,0.06) 100%)",
                        border: "1px solid rgba(254,44,85,0.25)",
                      };
                    }
                    return {
                      background: "linear-gradient(135deg, rgba(37,244,238,0.12) 0%, rgba(37,244,238,0.06) 100%)",
                      border: "1px solid rgba(37,244,238,0.25)",
                    };
                  };

                  const getIconColor = () => {
                    if (actionItem.isLogout) return "#ef4444";
                    if (actionItem.isReferral) return "#00d47e";
                    if (actionItem.isInstall) return "#FF0000";
                    if (actionItem.isRefund) return "#FF0000";
                    return "#282828";
                  };

                  return (
                    <motion.div
                      key={item.href}
                      custom={index + topMenuItems.length}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClick}
                        style={{
                          width: "100%",
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between",
                          padding: "14px 16px", 
                          borderRadius: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          ...getBgStyle(),
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: `${getIconColor()}20`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: getIconColor(),
                          }}>
                            {item.icon}
                          </div>
                          <span style={{ 
                            fontSize: "14px", 
                            fontWeight: 600, 
                            color: actionItem.isLogout ? "#ef4444" : (isDarkMode ? "#fff" : "#1a1a1a") 
                          }}>
                            {item.label}
                          </span>
                        </div>
                        {actionItem.badge && (
                          <span style={{
                            padding: "5px 10px",
                            background: actionItem.badgeColor,
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: actionItem.badgeColor === "#282828" ? "#000" : "#fff",
                          }}>
                            {actionItem.badge}
                          </span>
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
                style={{ 
                  height: "1px", 
                  background: `linear-gradient(90deg, transparent, ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}, transparent)`,
                  margin: "24px 0" 
                }} 
              />

              {/* Dark/Light Mode Toggle */}
              <motion.div 
                custom={topMenuItems.length}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 18px", borderRadius: "14px",
                  background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <motion.span 
                    animate={{ rotate: isDarkMode ? 0 : 360 }}
                    transition={{ duration: 0.5 }}
                    style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
                  >
                    {isDarkMode ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                      </svg>
                    )}
                  </motion.span>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: isDarkMode ? "#fff" : "#000" }}>
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  style={{
                    width: "52px", height: "30px", borderRadius: "15px",
                    background: isDarkMode 
                      ? "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)"
                      : "rgba(0,0,0,0.15)",
                    border: "none", cursor: "pointer", position: "relative",
                    transition: "background 0.3s",
                    boxShadow: isDarkMode ? "0 2px 10px rgba(254,44,85,0.3)" : "none",
                  }}
                >
                  <motion.div
                    animate={{ x: isDarkMode ? 24 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: "#fff", position: "absolute", top: "2px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {isDarkMode ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2.5">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="5"/>
                      </svg>
                    )}
                  </motion.div>
                </motion.button>
              </motion.div>

              {/* Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ 
                  marginTop: "auto", 
                  textAlign: "center",
                  paddingTop: "24px",
                }}
              >
                <p style={{ 
                  fontSize: "12px", 
                  color: isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                  fontWeight: 500,
                }}>
                  YouCash v1.0
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Refund Modal */}
      <RefundModal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)} />
    </>
  );
}
