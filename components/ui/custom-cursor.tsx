// components/ui/custom-cursor.tsx (Updated with improved performance)
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const scale = useTransform(cursorXSpring, () => (isHovering ? 1.5 : 1));
  const opacity = useTransform(cursorXSpring, () => (isVisible ? 1 : 0));

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
      setIsVisible(true);

      // Optimized particle creation with requestAnimationFrame
      if (Math.random() > 0.7) {
        requestAnimationFrame(() => {
          const particle = document.createElement("div");
          particle.className = "cursor-particle";
          particle.style.left = `${e.clientX}px`;
          particle.style.top = `${e.clientY}px`;
          document.body.appendChild(particle);

          setTimeout(() => particle.remove(), 500);
        });
      }
    },
    [cursorX, cursorY],
  );

  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);
  const handleWindowMouseLeave = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleWindowMouseLeave);

    const interactiveElements = document.querySelectorAll(
      'a, button, input, [role="button"], [data-cursor]',
    );

    const handleInteractiveMouseEnter = () => setIsHovering(true);
    const handleInteractiveMouseLeave = () => setIsHovering(false);

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleInteractiveMouseEnter);
      el.addEventListener("mouseleave", handleInteractiveMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleWindowMouseLeave);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleInteractiveMouseEnter);
        el.removeEventListener("mouseleave", handleInteractiveMouseLeave);
      });
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleWindowMouseLeave]);

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale,
          opacity,
        }}
      >
        <div
          className={`
            relative w-12 h-12 rounded-full border-2 border-purple-400
            transition-all duration-300 ease-out
            ${isHovering ? "border-pink-500 shadow-lg shadow-pink-500/50" : ""}
            ${isClicking ? "scale-75 border-red-500" : ""}
          `}
        >
          <div className="absolute inset-0 rounded-full animate-pulse-ring border-2 border-purple-400/50" />
        </div>
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="fixed pointer-events-none z-50 w-2 h-2 bg-white rounded-full mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          opacity,
        }}
      />
    </>
  );
};
