"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const stats = [
  { label: "Projects Delivered", value: 42, suffix: "+" },
  { label: "Years Experience", value: 5, suffix: "+" },
  { label: "Client Satisfaction", value: 98, suffix: "%" },
];

const skills = [
  "TypeScript",
  "Next.js",
  "React",
  "Node.js",
  "Tailwind CSS",
  "MongoDB",
  "PostgreSQL",
  "REST APIs",
  "Git",
  "Docker",
  "Github",
  "NextAuth",
  "Vercel",
    "Cloudinary",
    "Go lang Basic",
    "System Design"
];

export const Skills = () => {
  return (
    <section id="skills" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Skills & Impact
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            I focus on performance, accessibility, and polished user experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect rounded-xl p-6 text-center"
            >
              <p className="text-4xl font-bold text-purple-300 mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
