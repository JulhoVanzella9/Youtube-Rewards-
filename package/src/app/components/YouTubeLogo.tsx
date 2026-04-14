"use client";

interface YouTubeLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  isDarkMode?: boolean;
}

export default function YouTubeLogo({ size = "md", showText = true, isDarkMode = true }: YouTubeLogoProps) {
  const sizes = {
    sm: { icon: 28, text: 14, gap: 8 },
    md: { icon: 36, text: 18, gap: 10 },
    lg: { icon: 48, text: 24, gap: 12 },
  };

  const s = sizes[size];
  const textColor = isDarkMode ? "#FFFFFF" : "#0F0F0F";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${s.gap}px` }}>
      <svg width={s.icon} height={Math.round(s.icon * 48/68)} viewBox="0 0 68 48" fill="none">
        <path d="M66.52 7.74C65.72 4.64 63.28 2.2 60.18 1.4C54.9 0 34 0 34 0S13.1 0 7.82 1.4C4.72 2.2 2.28 4.64 1.48 7.74C0 13.02 0 24 0 24S0 34.98 1.48 40.26C2.28 43.36 4.72 45.8 7.82 46.6C13.1 48 34 48 34 48S54.9 48 60.18 46.6C63.28 45.8 65.72 43.36 66.52 40.26C68 34.98 68 24 68 24S68 13.02 66.52 7.74Z" fill="#FF0000"/>
        <text x="34" y="24" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="28" fontWeight="700" fontFamily="'Roboto', Arial, sans-serif">$</text>
      </svg>

      {showText && (
        <span style={{
          fontSize: `${s.text}px`,
          fontWeight: 700,
          color: textColor,
          letterSpacing: "-0.3px",
          fontFamily: "'Roboto', Arial, sans-serif",
        }}>
          YouCash
        </span>
      )}
    </div>
  );
}
