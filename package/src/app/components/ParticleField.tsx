"use client";
import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/lib/theme/context";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  particleCount?: number;
  interactive?: boolean;
  colors?: string[];
  className?: string;
}

export default function ParticleField({
  particleCount = 30,
  interactive = true,
  colors,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const defaultColors = isDarkMode
    ? ["#FF0000", "#282828", "#CC0000", "#ffffff"]
    : ["#FF0000", "#282828", "#CC0000", "#000000"];

  const particleColors = colors || defaultColors;

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      life: 0,
      maxLife: Math.random() * 300 + 200,
    };
  }, [particleColors]);

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(canvas));
    }
  }, [particleCount, createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    initParticles(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || !e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Mouse interaction - particles flee from cursor
        if (interactive) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.2;
            particle.vy += (dy / distance) * force * 0.2;
          }
        }

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Boundary wrap
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;

        // Fade based on life
        const lifeFade = particle.life > particle.maxLife * 0.8 
          ? 1 - ((particle.life - particle.maxLife * 0.8) / (particle.maxLife * 0.2))
          : 1;

        // Reset particle if life exceeded
        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle(canvas);
          return;
        }

        // Draw particle with glow
        const finalOpacity = particle.opacity * lifeFade;
        
        // Glow effect
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, particle.color + Math.floor(finalOpacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, particle.color + "00");
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = finalOpacity;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw connections between nearby particles
      ctx.strokeStyle = isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            ctx.beginPath();
            ctx.globalAlpha = (1 - distance / 80) * 0.3;
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactive, initParticles, createParticle, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
        zIndex: 0,
      }}
    />
  );
}
