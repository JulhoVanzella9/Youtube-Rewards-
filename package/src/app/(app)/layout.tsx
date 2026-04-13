"use client";

/**
 * App Layout with Authentication and Theme Support
 * Protects all routes under (app) group
 */
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";
import TopBar from "@/app/components/TopBar";
import ReferralModal from "@/app/components/ReferralModal";
import InstallPrompt from "@/app/components/InstallPrompt";
import { createClient } from "@/lib/supabase/client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const router = useRouter();

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      setIsDarkMode(savedTheme !== "light");
    };

    checkTheme();

    // Listen for storage changes (theme toggle)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        setIsDarkMode(e.newValue !== "light");
      }
    };

    // Custom event for same-tab theme changes
    const handleThemeChange = () => {
      checkTheme();
    };

    // Listen for referral modal event
    const handleOpenReferral = () => {
      setReferralModalOpen(true);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("themeChange", handleThemeChange);
    window.addEventListener("openReferralModal", handleOpenReferral);

    // Check theme periodically for same-tab changes
    const interval = setInterval(checkTheme, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themeChange", handleThemeChange);
      window.removeEventListener("openReferralModal", handleOpenReferral);
      clearInterval(interval);
    };
  }, []);

  const checkAuth = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    checkAuth();

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/login");
      } else if (event === "SIGNED_IN") {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAuth, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: isDarkMode ? "#000" : "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.3s ease",
      }}>
        <div style={{
          width: "28px",
          height: "28px",
          border: "3px solid rgba(254,44,85,0.2)",
          borderTopColor: "#fe2c55",
          borderRadius: "50%",
          animation: "spin 0.6s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDarkMode ? "#000" : "#f5f5f5", 
      color: isDarkMode ? "#fff" : "#121212",
      display: "flex",
      flexDirection: "column",
      transition: "background 0.3s ease, color 0.3s ease",
      overflow: "hidden",
      width: "100%",
      maxWidth: "100vw",
      boxSizing: "border-box",
    }}>
      <TopBar />
      <main style={{ 
        flex: 1,
        paddingBottom: "calc(clamp(70px, 18vw, 88px) + env(safe-area-inset-bottom, 0px))",
        paddingTop: "0px",
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}>
        {children}
      </main>
      <BottomNav />
      
      {/* Global Modals */}
      <ReferralModal 
        isOpen={referralModalOpen} 
        onClose={() => setReferralModalOpen(false)} 
      />
      <InstallPrompt />
    </div>
  );
}
