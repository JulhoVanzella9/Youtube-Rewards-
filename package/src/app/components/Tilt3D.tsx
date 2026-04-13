"use client";
import { useRef, useState, useCallback, ReactNode } from "react";
import { motion } from "framer-motion";

interface Tilt3DProps {
  children: ReactNode;
  intensity?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  glareOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export default function Tilt3D({
  children,
  intensity = 10,
  perspective = 1000,
  scale = 1.02,
  speed = 400,
  glare = true,
  glareOpacity = 0.15,
  className = "",
  style = {},
  disabled = false,
}: Tilt3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -intensity;
    const rotateY = (mouseX / (rect.width / 2)) * intensity;

    setTransform({ rotateX, rotateY });

    // Update glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  }, [intensity, disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current || !e.touches[0]) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const touchX = e.touches[0].clientX - centerX;
    const touchY = e.touches[0].clientY - centerY;
    
    const rotateX = (touchY / (rect.height / 2)) * -intensity * 0.5; // Reduced for touch
    const rotateY = (touchX / (rect.width / 2)) * intensity * 0.5;

    setTransform({ rotateX, rotateY });

    const glareX = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  }, [intensity, disabled]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0 });
    setGlarePosition({ x: 50, y: 50 });
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        scale: isHovered ? scale : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
      
      {/* Glare overlay */}
      {glare && (
        <motion.div
          animate={{
            opacity: isHovered ? glareOpacity : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: `radial-gradient(
              circle at ${glarePosition.x}% ${glarePosition.y}%,
              rgba(255,255,255,0.4) 0%,
              transparent 60%
            )`,
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}
    </motion.div>
  );
}
