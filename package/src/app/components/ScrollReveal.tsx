"use client";
import { useRef, useEffect, useState, ReactNode } from "react";
import { motion, useInView, Variants } from "framer-motion";

type AnimationType = "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "flip" | "blur";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
  staggerChildren?: number;
}

const getVariants = (type: AnimationType): Variants => {
  const baseTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
  };

  switch (type) {
    case "fade":
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: baseTransition },
      };
    case "slide-up":
      return {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: baseTransition },
      };
    case "slide-down":
      return {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0, transition: baseTransition },
      };
    case "slide-left":
      return {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: baseTransition },
      };
    case "slide-right":
      return {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0, transition: baseTransition },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.85 },
        visible: { opacity: 1, scale: 1, transition: baseTransition },
      };
    case "flip":
      return {
        hidden: { opacity: 0, rotateX: -15, perspective: 1000 },
        visible: { opacity: 1, rotateX: 0, transition: baseTransition },
      };
    case "blur":
      return {
        hidden: { opacity: 0, filter: "blur(10px)" },
        visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5 } },
      };
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: baseTransition },
      };
  }
};

export default function ScrollReveal({
  children,
  animation = "slide-up",
  delay = 0,
  duration = 0.5,
  threshold = 0.2,
  once = true,
  className = "",
  style = {},
  staggerChildren = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold,
  });

  const variants = getVariants(animation);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerChildren > 0 ? containerVariants : variants}
      transition={{ delay, duration }}
      className={className}
      style={{
        ...style,
        willChange: "transform, opacity",
      }}
    >
      {staggerChildren > 0 ? (
        // Wrap children for stagger effect
        Array.isArray(children) ? (
          children.map((child, index) => (
            <motion.div key={index} variants={variants}>
              {child}
            </motion.div>
          ))
        ) : (
          <motion.div variants={variants}>{children}</motion.div>
        )
      ) : (
        children
      )}
    </motion.div>
  );
}

// Hook for custom scroll-based animations
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on element position
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Progress from 0 (element just entering) to 1 (element leaving)
      const start = windowHeight;
      const end = -elementHeight;
      const current = elementTop;
      
      const scrollProgress = Math.max(0, Math.min(1, (start - current) / (start - end)));
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { ref, progress };
}

// Parallax component
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Parallax({ 
  children, 
  speed = 0.5, 
  className = "",
  style = {},
}: ParallaxProps) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Calculate offset based on distance from viewport center
      const distance = elementCenter - viewportCenter;
      setOffset(distance * speed * 0.1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: `translateY(${offset}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}
