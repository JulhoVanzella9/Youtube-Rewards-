"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { useTheme } from "@/lib/theme/context";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const inactiveColor = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const textColor = isDarkMode ? "#fff" : "#000";

  const tabs = [
    {
      href: "/",
      label: t("home"),
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF0000" : inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      href: "/courses",
      label: t("class"),
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF0000" : inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
    },
    {
      href: "/create",
      label: "Shorts",
      isCenter: true,
      icon: () => (
        <div style={{
          width: "40px", height: "40px", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* YouTube Shorts icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M10 14.65v-5.3L15 12l-5 2.65z" fill="#FF0000"/>
            <path d="M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z" fill="#FF0000"/>
          </svg>
        </div>
      ),
    },
    {
      href: "/support",
      label: t("support"),
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF0000" : inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      ),
    },
    {
      href: "/wallet",
      label: t("wallet"),
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF0000" : inactiveColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="bottom-nav"
      style={{
        position: "fixed", 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100,
        background: isDarkMode ? "#000" : "#fff",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-around",
        height: "calc(clamp(60px, 16vw, 72px) + env(safe-area-inset-bottom, 0px))",
        paddingLeft: "clamp(2px, 1vw, 8px)",
        paddingRight: "clamp(2px, 1vw, 8px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        transition: "background 0.3s ease, border-color 0.3s ease",
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.href === "/courses" 
          ? pathname === "/courses" || pathname.startsWith("/course/")
          : pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} prefetch={true} style={{ textDecoration: "none", flex: 1 }}>
            <motion.div
              whileTap={{ scale: 0.88, y: 2 }}
              whileHover={{ y: -2 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: "4px", padding: "8px 0",
                cursor: "pointer", height: "100%",
                position: "relative",
              }}
            >
              {/* Active indicator - positioned above icon */}
              {isActive && !tab.isCenter && (
                <motion.div
                  layoutId="navIndicator"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: "50%",
                    marginLeft: "-12px",
                    width: "24px",
                    height: "3px",
                    borderRadius: "2px",
                    background: "#FF0000",
                    boxShadow: "0 0 8px rgba(255,0,0,0.4)",
                  }}
                />
              )}
              
              {tab.isCenter ? (
                <motion.div 
                  whileHover={{ scale: 1.12, rotate: 90 }} 
                  whileTap={{ scale: 0.88, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                >
                  {tab.icon()}
                </motion.div>
              ) : (
                <>
                  <motion.div 
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={isActive ? "icon-pop" : ""}
                    style={{ 
                      width: "24px", height: "24px", 
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {tab.icon(isActive)}
                  </motion.div>
                  <motion.span 
                    animate={{ 
                      scale: isActive ? 1.05 : 1,
                      fontWeight: isActive ? 700 : 500,
                    }}
                    style={{
                      fontSize: "clamp(9px, 2.5vw, 11px)", 
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? textColor : inactiveColor,
                      transition: "color 0.2s",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab.label}
                  </motion.span>
                </>
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
