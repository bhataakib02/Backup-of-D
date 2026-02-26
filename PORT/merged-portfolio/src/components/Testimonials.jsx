"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "Aakib blends creativity with practicality. His security-centric guidance during our hackathon project helped us ship confidently.",
    name: "Priya Sahoo",
    title: "Team Lead, CGU Hackathon",
  },
  {
    quote:
      "He brought empathy to our retail dashboard, ensuring non-technical store owners could easily act on insights.",
    name: "Rahul Kumar",
    title: "Retail Founder",
  },
  {
    quote:
      "Aakib documents every API decision meticulously. Our Postman collections finally read like a playbook.",
    name: "Sania Mir",
    title: "Backend Collaborator",
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 px-4 bg-transparent">
      <div className="text-center mb-12 space-y-4 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
          Voices
        </p>
        <h2 className="section-title text-gray-900 dark:text-white">
          💬 People I've collaborated with.
        </h2>
        <p className="section-subtitle">
          Mentors, founders, and teammates on what it feels like to build alongside me.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl border border-white/40 bg-white/80 p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-lg text-gray-800 dark:text-gray-100">
                “{testimonials[index].quote}”
              </p>
              <div className="mt-6">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {testimonials[index].name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {testimonials[index].title}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setIndex(dotIndex)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                dotIndex === index ? "bg-[var(--accent)]" : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Show testimonial ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

