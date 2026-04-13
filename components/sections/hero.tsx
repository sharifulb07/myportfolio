// components/sections/hero.tsx (Updated with React 19 and better performance)
"use client";

import { memo, useEffect } from "react";
import type { Variants } from "framer-motion";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FloatingShapes } from "@/components/ui/floating-shape";
import { ParallaxSection } from "@/components/ui/parallax-section";

const Hero = memo(() => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [15, -15]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-15, 15]),
    springConfig,
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FloatingShapes />

      <ParallaxSection offset={30} className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center px-4"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full glass-effect text-sm">
              ✨ Welcome to my digital space
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 font-space-grotesk"
            style={{
              perspective: 1000,
              rotateX,
              rotateY,
            }}
          >
            <span className="gradient-text">Full Stack Developer</span>
            <br />
            Creating Digital Experiences
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              I build immersive web applications with cutting-edge technology
            </motion.span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-center flex-wrap"
          >
            <MagneticButton>
              <a
                href="#projects"
                className="px-8 py-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 inline-block"
              >
                View My Work
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href="#contact"
                className="px-8 py-3 glass-effect rounded-full font-semibold hover:bg-white/20 transition-all duration-300 inline-block"
              >
                Contact Me
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </ParallaxSection>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
});

Hero.displayName = "Hero";
export { Hero };
