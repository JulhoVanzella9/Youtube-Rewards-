"use client";

interface TikCashLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  isDarkMode?: boolean;
}

export default function TikCashLogo({ size = "md", showText = true, isDarkMode = true }: TikCashLogoProps) {
  const sizes = {
    sm: { icon: 28, text: 14, gap: 8 },
    md: { icon: 36, text: 18, gap: 10 },
    lg: { icon: 48, text: 24, gap: 12 },
  };

  const s = sizes[size];
  const noteColor = isDarkMode ? "#FFFFFF" : "#000000";
  const dollarColor = isDarkMode ? "#000000" : "#FFFFFF";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${s.gap}px` }}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 512 512" fill="none">
        {/* cyan shadow */}
        <path
          d="M320 80V310C320 378 268 428 200 428C132 428 78 374 78 306C78 238 132 184 200 184C219 184 237 188 250 196V80H320Z"
          fill="#25F4EE"
          transform="translate(-16,-10)"
        />
        {/* red/pink shadow */}
        <path
          d="M320 80V310C320 378 268 428 200 428C132 428 78 374 78 306C78 238 132 184 200 184C219 184 237 188 250 196V80H320Z"
          fill="#FE2C55"
          transform="translate(16,10)"
        />
        {/* main note */}
        <path
          d="M320 80V310C320 378 268 428 200 428C132 428 78 374 78 306C78 238 132 184 200 184C219 184 237 188 250 196V80H320Z"
          fill={noteColor}
        />
        {/* dollar sign inside circle */}
        <text
          x="200"
          y="345"
          textAnchor="middle"
          fill={dollarColor}
          fontSize="130"
          fontWeight="800"
          fontFamily="Arial Black, system-ui, sans-serif"
        >
          $
        </text>
        {/* cyan coin top right */}
        <circle cx="392" cy="118" r="68" fill="#25F4EE" />
        <text
          x="392"
          y="145"
          textAnchor="middle"
          fill="#000000"
          fontSize="80"
          fontWeight="800"
          fontFamily="Arial Black, system-ui, sans-serif"
        >
          $
        </text>
      </svg>

      {showText && (
        <span style={{
          fontSize: `${s.text}px`,
          fontWeight: 800,
          color: isDarkMode ? "#FFFFFF" : "#000000",
          letterSpacing: "-0.5px",
          fontFamily: "Arial Black, system-ui, sans-serif",
        }}>
          TikCash
        </span>
      )}
    </div>
  );
}
