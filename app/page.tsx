// app/page.tsx
"use client";

import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";

export default function Home() {
  return (
    <main className="relative">
      <ScrollProgress />
      <Hero />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <BackToTop />
    </main>
  );
}
