"use client";

interface YouTubeLogoProps {
  size?: "sm" | "md" | "lg";
  isDarkMode?: boolean;
}

export default function YouTubeLogo({ size = "md", isDarkMode = true }: YouTubeLogoProps) {
  const sizes = {
    sm: 28,
    md: 36,
    lg: 48,
  };

  const s = sizes[size];

  return (
    <svg width={s} height={s} viewBox="0 0 512 512" fill="none">
      {/* Red rounded rectangle (YouTube-style) */}
      <rect x="80" y="150" width="352" height="212" rx="28" fill="#FF0000" />
      
      {/* White play triangle */}
      <polygon points="220,250 220,362 340,306" fill="#FFFFFF" />
    </svg>
  );
}
