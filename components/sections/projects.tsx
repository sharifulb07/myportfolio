// components/sections/projects.tsx
"use client";

import { useState } from "react";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/magnetic-button";

const projects = [
  {
    id: 1,
    title: "Ecommerce Platform with Next.js and MongoDB",
    description:
      "A full-featured ecommerce platform built with Next.js, MongoDB, and Stripe for seamless online shopping experiences",
    technologies: ["Next.js", "TypeScript", "Cloudinary", "NextAuth", "MongoDB"],
    image: "/images/8.PNG",
    github: "https://ecommerce-seven-tau-95.vercel.app/",
    live: "https://ecommerce-seven-tau-95.vercel.app/",
    featured: true,
  },
  {
    id: 2,
    title: "Visualization and Algorithm Animation Tool",
    description:
      "Go lang or Rust code Visualization and Algorithm Animation Tool",
    technologies: ["Next.js", "TypeScript", "Go Lang", "Rust", "MongoDB"],
    image: "/images/1.PNG",
    github: "https://visualgo-beryl.vercel.app/",
    live: "https://visualgo-beryl.vercel.app/",
    featured: true,
  },
  {
    id: 3,
    title: "Excalidraw to PDF Converter  Tool",
    description:
      "Web-based Excalidraw to PDF Converter  Tool with advanced features for seamless diagram export",
    technologies: ["React", "Node.js", "Socket.io", "WebRTC", "Express", "Excalidraw"],
    image: "/images/2.PNG",
    github: "https://excali-to-pdf.vercel.app/",
    live: "https://excali-to-pdf.vercel.app/",
    featured: true,
  },
  {
    id: 4,
    title: " Laundry management system",
    description:
      "Web-based laundry management system with real-time tracking and reporting features",
    technologies: ["Next.js", "TypeScript", "Express", "MongoDB"],
    image: "/images/3.PNG",
    github: "https://amaderwashing.vercel.app/dashboard",
    live: "https://amaderwashing.vercel.app/dashboard",
    featured: false,
  },
  {
    id: 5,
    title: " Dentist Booking System",
    description:
      "Web-based dentist booking system with real-time appointment management and patient tracking features",
    technologies: ["Next.js", "TypeScript", "Express", "MongoDB", "Cloudinary", "Nodemailer", "NextAuth"],
    image: "/images/4.PNG",
    github: "https://dentistappointment.vercel.app/",
    live: "https://dentistappointment.vercel.app/",
    featured: false,
  },
  {
    id: 6,
    title: " Bank Employee Management System",
    description:
      "Web-based bank employee management system with real-time tracking and reporting features",
    technologies: ["Next.js", "TypeScript", "Express", "MongoDB", "Cloudinary", "Nodemailer", "NextAuth"],
    image: "/images/5.PNG",
    github: "https://employeeperformance-orpin.vercel.app/",
    live: "https://employeeperformance-orpin.vercel.app/",
    featured: false,
  },
  {
    id: 7,
    title: " Polytechnic Routine Management System",
    description:
      "Web-based polytechnic routine generation and  management system with real-time tracking and reporting features",
    technologies: ["Next.js", "TypeScript", "Express", "MongoDB", "Cloudinary", "Nodemailer", "NextAuth"],
    image: "/images/6.PNG",
    github: "https://kpiroutineapp.vercel.app/",
    live: "https://kpiroutineapp.vercel.app/",
    featured: false,
  },
  {
    id: 8,
    title: " Blogging Platform",
    description:
      "Web-based blogging platform  s",
    technologies: ["Next.js", "TypeScript", "Express", "MongoDB", "Cloudinary", "Nodemailer", "NextAuth"],
    image: "/images/7.PNG",
    github: "https://blogs-unique.vercel.app/",
    live: "https://blogs-unique.vercel.app/",
    featured: false,
  },
];

export const Projects = () => {
  const [filter, setFilter] = useState("all");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.featured);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section id="projects" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Featured Projects
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Here are some of my best works that showcase my skills and
            creativity
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                filter === "all"
                  ? "bg-linear-to-r from-purple-500 to-pink-500 text-white"
                  : "glass-effect hover:bg-white/20"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                filter === "featured"
                  ? "bg-linear-to-r from-purple-500 to-pink-500 text-white"
                  : "glass-effect hover:bg-white/20"
              }`}
            >
              Featured
            </button>
          </div>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, y: 50 }}
                className="group relative glass-effect rounded-xl overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <MagneticButton>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-purple-400 transition-colors"
                      >
                        GitHub →
                      </a>
                    </MagneticButton>
                    <MagneticButton>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-purple-400 transition-colors"
                      >
                        Live Demo →
                      </a>
                    </MagneticButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
