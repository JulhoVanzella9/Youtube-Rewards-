"use client";
import { useRef } from "react";
import html2canvas from "html2canvas";

export default function AccessGrantedPage() {
  const a4Ref = useRef<HTMLDivElement>(null);
  const password = "myacess2026";
  const supportEmail = "accesssupport.ai@gmail.com";

  const downloadImage = async () => {
    if (!a4Ref.current) return;
    
    try {
      const canvas = await html2canvas(a4Ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0d1117",
      });
      
      const link = document.createElement("a");
      link.download = "TikCash-Access-Granted.png";
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a1a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Download Button */}
      <button
        onClick={downloadImage}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "linear-gradient(135deg, #25f4ee 0%, #1ed4cf 100%)",
          color: "#000",
          fontSize: "16px",
          fontWeight: 700,
          padding: "14px 28px",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          marginBottom: "32px",
          boxShadow: "0 4px 20px rgba(37,244,238,0.3)",
          transition: "all 0.2s",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download A4 Image
      </button>

      {/* A4 Container - 210mm x 297mm (794px x 1123px at 96 DPI) */}
      <div
        ref={a4Ref}
        style={{
          width: "794px",
          height: "1123px",
          background: "linear-gradient(180deg, #0d1117 0%, #0a0a0a 100%)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 50px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Background Elements */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(254,44,85,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(37,244,238,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />

        {/* Congratulations Banner */}
        <div style={{
          width: "100%",
          maxWidth: "600px",
          background: "linear-gradient(135deg, #fe2c55 0%, #ff1744 50%, #d41442 100%)",
          borderRadius: "20px",
          padding: "28px 40px",
          textAlign: "center",
          marginBottom: "40px",
          boxShadow: "0 8px 40px rgba(254,44,85,0.4)",
          border: "2px solid rgba(255,255,255,0.15)",
          position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
            <span style={{ fontSize: "42px" }}>🎁</span>
            <h1 style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#fff",
              margin: 0,
              textShadow: "0 3px 12px rgba(0,0,0,0.4)",
              letterSpacing: "3px",
            }}>
              CONGRATULATIONS!
            </h1>
            <span style={{ fontSize: "42px" }}>🎁</span>
          </div>
        </div>

        {/* Main Card */}
        <div style={{
          width: "100%",
          maxWidth: "600px",
          background: "linear-gradient(180deg, rgba(37,244,238,0.08) 0%, rgba(37,244,238,0.02) 100%)",
          border: "1px solid rgba(37,244,238,0.2)",
          borderRadius: "24px",
          padding: "32px 36px",
          textAlign: "center",
          position: "relative",
        }}>
          {/* Success Icon */}
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #25f4ee 0%, #17b8b3 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 10px 40px rgba(37,244,238,0.4)",
          }}>
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <h2 style={{
            fontSize: "34px",
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 8px 0",
          }}>
            Access Granted
          </h2>

          <p style={{
            fontSize: "14px",
            color: "#25f4ee",
            fontWeight: 600,
            margin: "0 0 24px 0",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}>
            Your Premium Account is Ready
          </p>

          {/* Instructions */}
          <div style={{
            background: "rgba(0,0,0,0.4)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <p style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.6,
              margin: 0,
            }}>
              To access, log in with the <strong style={{ color: "#fff" }}>same email</strong> used during purchase and use the password below:
            </p>
          </div>

          {/* Password Box */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 8px 0",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}>
              Your Password
            </p>
            <div style={{
              background: "linear-gradient(135deg, rgba(37,244,238,0.12) 0%, rgba(37,244,238,0.04) 100%)",
              border: "2px solid #25f4ee",
              borderRadius: "12px",
              padding: "14px 28px",
              display: "inline-block",
            }}>
              <span style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "3px",
                fontFamily: "monospace",
              }}>
                {password}
              </span>
            </div>
          </div>

          {/* Email Notice */}
          <div style={{
            background: "linear-gradient(135deg, rgba(254,44,85,0.1) 0%, rgba(254,44,85,0.05) 100%)",
            border: "1px solid rgba(254,44,85,0.25)",
            borderRadius: "12px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(254,44,85,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fe2c55" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 6l-10 7L2 6"/>
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>
                Check Your Email
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "2px 0 0 0" }}>
                All access details were sent to your registered email!
              </p>
            </div>
          </div>

          {/* Support Notice - Same Style */}
          <div style={{
            background: "linear-gradient(135deg, rgba(37,244,238,0.1) 0%, rgba(37,244,238,0.05) 100%)",
            border: "1px solid rgba(37,244,238,0.25)",
            borderRadius: "12px",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(37,244,238,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25f4ee" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>
                Need Support?
              </p>
              <p style={{ fontSize: "13px", color: "#25f4ee", margin: "2px 0 0 0", fontWeight: 600 }}>
                {supportEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Access Button */}
        <div style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: "20px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
            background: "linear-gradient(135deg, #25f4ee 0%, #1ed4cf 50%, #17b8b3 100%)",
            color: "#000",
            fontSize: "18px",
            fontWeight: 800,
            padding: "18px 30px",
            borderRadius: "14px",
            textDecoration: "none",
            textTransform: "uppercase",
            letterSpacing: "2px",
            boxShadow: "0 6px 0 0 #0f8a87, 0 14px 40px rgba(37,244,238,0.35)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 3h6v6M14 10l6.1-6.1M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
            </svg>
            CLICK HERE TO ACCESS
          </div>

          <p style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.4,
            margin: "12px 0 0 0",
            textAlign: "center",
          }}>
            A new page will open when you click the button above.
          </p>
        </div>

        {/* TikCash Logo Footer */}
        <div style={{
          marginTop: "auto",
          paddingTop: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
              <path d="M30 8V28C30 33.5 25.5 38 20 38C14.5 38 10 33.5 10 28C10 22.5 14.5 18 20 18C21.5 18 23 18.3 24 18.8V8H30Z" fill="#25F4EE" transform="translate(-2, -1)"/>
              <path d="M30 8V28C30 33.5 25.5 38 20 38C14.5 38 10 33.5 10 28C10 22.5 14.5 18 20 18C21.5 18 23 18.3 24 18.8V8H30Z" fill="#FE2C55" transform="translate(2, 1)"/>
              <path d="M30 8V28C30 33.5 25.5 38 20 38C14.5 38 10 33.5 10 28C10 22.5 14.5 18 20 18C21.5 18 23 18.3 24 18.8V8H30Z" fill="#fff"/>
              <text x="20" y="32" textAnchor="middle" fill="#000" fontSize="14" fontWeight="800">$</text>
              <circle cx="36" cy="12" r="7" fill="#25F4EE" stroke="#000" strokeWidth="2"/>
              <text x="36" y="15.5" textAnchor="middle" fill="#000" fontSize="9" fontWeight="800">$</text>
            </svg>
            <span style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#fff",
            }}>
              TikCash
            </span>
          </div>
          <p style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.4)",
            margin: 0,
          }}>
            Start earning with every video you watch
          </p>
        </div>
      </div>
    </div>
  );
}
