"use client";

interface YouCashLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  isDarkMode?: boolean;
}

export default function YouCashLogo({ size = "md", showText = true, isDarkMode = true }: YouCashLogoProps) {
  const sizes = {
    sm: { icon: 28, text: 14, gap: 8 },
    md: { icon: 36, text: 18, gap: 10 },
    lg: { icon: 48, text: 24, gap: 12 },
  };

  const s = sizes[size];
  const textColor = isDarkMode ? "#FFFFFF" : "#000000";
  const playColor = isDarkMode ? "#FFFFFF" : "#000000";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${s.gap}px` }}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 512 512" fill="none">
        {/* Red rounded rectangle (YouTube-style) */}
        <rect x="80" y="100" width="352" height="280" rx="32" fill="#FF0000" />
        
        {/* White play triangle */}
        <polygon points="220,220 220,340 340,280" fill="#FFFFFF" />
      </svg>

      {showText && (
        <span style={{
          fontSize: `${s.text}px`,
          fontWeight: 700,
          color: textColor,
          letterSpacing: "-0.5px",
          fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>
          YouCash
        </span>
      )}
    </div>
  );
}
