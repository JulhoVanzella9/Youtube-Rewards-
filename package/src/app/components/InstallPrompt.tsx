"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type DeviceType = "ios" | "android" | "desktop" | "unknown";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("unknown");
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    let detectedDevice: DeviceType = "unknown";
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      detectedDevice = "ios";
    } else if (/android/.test(userAgent)) {
      detectedDevice = "android";
    } else if (/windows|macintosh|linux/.test(userAgent) && !/mobile/.test(userAgent)) {
      detectedDevice = "desktop";
    }
    
    setDeviceType(detectedDevice);

    // Listen for install prompt (Chrome/Android)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show prompt after a delay for iOS (no native install prompt)
    if (detectedDevice === "ios") {
      const hasShownPrompt = localStorage.getItem("installPromptShown");
      if (!hasShownPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    // Listen for custom trigger event from menu
    const handleTrigger = () => {
      setShowPrompt(true);
      setShowInstructions(true);
    };
    window.addEventListener("triggerInstallPrompt", handleTrigger);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("triggerInstallPrompt", handleTrigger);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Native install prompt available (Chrome/Android)
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // No native prompt - show manual instructions
      setShowInstructions(true);
      localStorage.setItem("installPromptShown", "true");
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowInstructions(false);
    localStorage.setItem("installPromptShown", "true");
  };

  const getDeviceTitle = () => {
    switch (deviceType) {
      case "ios": return "Install on iPhone/iPad";
      case "android": return "Install on Android";
      case "desktop": return "Install on Computer";
      default: return "Install App";
    }
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          position: "fixed",
          bottom: "90px",
          left: "16px",
          right: "16px",
          background: "linear-gradient(180deg, #1a1a1a 0%, #0f0f1a 100%)",
          borderRadius: "20px",
          padding: "20px",
          zIndex: 900,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.5)",
        }}
      >
        {showInstructions ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                {getDeviceTitle()}
              </h3>
              <button
                onClick={handleDismiss}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {deviceType === "ios" ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#FF0000", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#fff", fontSize: "14px",
                    }}>1</div>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                      Tap the <strong style={{ color: "#FF0000" }}>Share</strong> button <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>(bottom center in Safari)</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#FF0000", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#fff", fontSize: "14px",
                    }}>2</div>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                      Scroll down and tap <strong style={{ color: "#FF0000" }}>Add to Home Screen</strong>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#fff", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#000", fontSize: "14px",
                    }}>3</div>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                      Tap <strong style={{ color: "#fff" }}>Add</strong> in the top right corner
                    </span>
                  </div>
                </>
              ) : deviceType === "android" ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#FF0000", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#fff", fontSize: "14px",
                    }}>1</div>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                      Tap <strong style={{ color: "#FF0000" }}>menu</strong> <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>(3 dots, top right)</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#FF0000", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#fff", fontSize: "14px",
                    }}>2</div>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                      Tap <strong style={{ color: "#FF0000" }}>Install app</strong> or <strong style={{ color: "#FF0000" }}>Add to Home screen</strong>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#fff", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#000", fontSize: "14px",
                    }}>3</div>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                      Tap <strong style={{ color: "#fff" }}>Install</strong> to confirm
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#FF0000", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#fff", fontSize: "14px",
                    }}>1</div>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                      Click the <strong style={{ color: "#FF0000" }}>install icon</strong> <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>(in address bar)</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      background: "#FF0000", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#fff", fontSize: "14px",
                    }}>2</div>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                      Click <strong style={{ color: "#FF0000" }}>Install</strong> to add the app
                    </span>
                  </div>
                </>
              )}
            </div>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "12px", textAlign: "center" }}>
              The app icon will appear on your home screen
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "linear-gradient(135deg, #FF0000 0%, #ff6b8a 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#fff"/>
                <path d="M9 12l2 2 4-4" stroke="#FF0000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                Install YouCash
              </h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                Add to home screen for the best experience
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleDismiss}
                className="btn-3d btn-3d-dark btn-3d-sm"
                style={{ fontFamily: "inherit" }}
              >
                Later
              </button>
              <button
                onClick={handleInstall}
                className="btn-3d btn-3d-primary btn-3d-sm"
                style={{ fontFamily: "inherit" }}
              >
                Install
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
