"use client";
import { motion } from "framer-motion";

const timeline = [
  {
    year: "2025",
    title: "Capstone Lead, CGU",
    description:
      "Leading a security-first analytics platform for campus stakeholders, mentoring three juniors on delivery.",
  },
  {
    year: "2024",
    title: "Postman Expert + Hackathon Winner",
    description:
      "Earned Postman API Expert credential and led my team to first place at CGU Hackathon for an AI devtool.",
  },
  {
    year: "2023",
    title: "Joined C.V. Raman Global University",
    description:
      "Began B.Tech Computer Science & System Engineering journey focused on web engineering and cybersecurity.",
  },
  {
    year: "2022",
    title: "Community + Freelance Projects",
    description:
      "Built web apps for local businesses in Jammu & Kashmir while contributing to open source documentation.",
  },
];

const Timeline = () => {
  return (
    <section id="journey" className="py-20 px-4">
      <div className="text-center mb-12 space-y-4 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
          Journey
        </p>
        <h2 className="section-title text-gray-900 dark:text-white">
          🛤️ Milestones that shaped my craft.
        </h2>
        <p className="section-subtitle">
          A quick scroll through the projects, credentials, and moments that grew my empathy for users
          and obsession with reliable systems.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-indigo-200 via-indigo-500 to-pink-400 dark:from-slate-700 dark:via-indigo-400 dark:to-pink-500" />
        <div className="space-y-12">
          {timeline.map((entry, idx) => (
            <motion.div
              key={entry.year}
              className={`relative flex flex-col sm:flex-row ${idx % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} gap-6`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex-1 text-right sm:text-right">
                <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-300">
                  {entry.year}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {entry.title}
                </h3>
              </div>
              <div className="flex items-center justify-center">
                <span className="relative z-10 size-5 rounded-full bg-white border border-indigo-500 shadow dark:bg-slate-900" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-600 dark:text-gray-300">{entry.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;

