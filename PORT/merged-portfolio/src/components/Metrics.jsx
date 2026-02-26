"use client";
import { motion } from "framer-motion";
import { FaGaugeHigh, FaShield, FaBolt, FaUsers } from "react-icons/fa6";

const metrics = [
  {
    icon: <FaGaugeHigh />,
    label: "Lighthouse avg",
    value: "94",
    meta: "Performance across featured projects",
  },
  {
    icon: <FaShield />,
    label: "Security reviews",
    value: "25+",
    meta: "OWASP-style audits completed",
  },
  {
    icon: <FaBolt />,
    label: "Deploys shipped",
    value: "40+",
    meta: "Across freelance + academic work",
  },
  {
    icon: <FaUsers />,
    label: "Happy collaborators",
    value: "18",
    meta: "Designers, founders, mentors",
  },
];

const Metrics = () => {
  return (
    <section id="metrics" className="py-20 px-4">
      <div className="text-center mb-12 space-y-4 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
          Proof
        </p>
        <h2 className="section-title text-gray-900 dark:text-white">
          📊 Craft backed by measurable outcomes.
        </h2>
        <p className="section-subtitle">
          Lighthouse audits, security reviews, and team outcomes that validate the process.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="rounded-2xl border border-white/30 bg-white/80 p-6 shadow dark:border-white/10 dark:bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-2xl text-[var(--accent)]">{metric.icon}</div>
            <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </p>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {metric.label}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{metric.meta}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Metrics;

