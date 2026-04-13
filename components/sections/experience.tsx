"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    period: "2024 - Present",
    role: "Senior Full Stack Developer",
    company: "Freelance / Remote",
    summary:
      "Building production-grade web platforms with modern React and API-first architecture.",
  },
  {
    period: "2021 - 2024",
    role: "Frontend Engineer",
    company: "Product Startup",
    summary:
      "Led interface redesigns, improved core web vitals, and implemented robust component systems.",
  },
  {
    period: "2019 - 2021",
    role: "Web Developer",
    company: "Digital Agency",
    summary:
      "Delivered custom business websites and dashboards with strong UX and maintainable code.",
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Experience
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            A track record of shipping reliable products and delightful
            interfaces.
          </p>
        </motion.div>

        <div className="space-y-6">
          {timeline.map((item, index) => (
            <motion.article
              key={item.period}
              initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              viewport={{ once: true }}
              className="glass-effect rounded-xl p-6"
            >
              <p className="text-sm text-purple-300 mb-2">{item.period}</p>
              <h3 className="text-xl font-semibold mb-1">{item.role}</h3>
              <p className="text-gray-300 mb-3">{item.company}</p>
              <p className="text-gray-200">{item.summary}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
