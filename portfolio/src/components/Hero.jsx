"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const roles = [
  {
    text: "B.Tech Computer Science and System Engineering Student 👨‍🎓",
    color: "text-indigo-500",
  },
  { text: "Cybersecurity Engineer 🛡️", color: "text-green-500" },
  { text: "Web Developer 🌐", color: "text-blue-500" },
];

const wins = [
  { title: "Built CGU Timetable suite", meta: "Saved 20+ hrs/week for staff" },
  { title: "Secured Postman Expert badge", meta: "APIs with 99.9% uptime" },
  { title: "Led UI for Retail App", meta: "4.7/5 user acceptance score" },
  { title: "Won CGU Hackathon'24", meta: "Ranked #1 for AI Web tooling" },
];

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [winIndex, setWinIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tickerInterval = setInterval(
      () => setWinIndex((prev) => (prev + 1) % wins.length),
      3500
    );
    return () => clearInterval(tickerInterval);
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-20 left-10 h-64 w-64 rounded-full bg-indigo-300/40 blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div
          className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-[var(--accent)] shadow-2xl mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/profile.JPG"
            alt="Mohammad Aakib Bhat"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          style={{ fontFamily: "'Great Vibes', cursive" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Hi, I'm Mohammad Aakib Bhat 👋
        </motion.h1>

        <motion.div
          key={roleIndex}
          className={`text-xl md:text-3xl font-medium mt-2 transition-all duration-500 ${roles[roleIndex].color}`}
        >
          {roles[roleIndex].text}
        </motion.div>

        <p className="mt-6 text-gray-800 dark:text-gray-200 font-semibold italic text-xl md:text-2xl text-center max-w-2xl mx-auto">
          “Engineering the web with soul, security, and a splash of style.”
        </p>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded-full text-white accent-gradient shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            🚀 View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-full text-white bg-gradient-to-r from-green-400 to-emerald-600 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            📞 Contact Me
          </a>
          <a
            href="/Mohammad_Aakib_Bhat_Resume.pdf"
            download
            className="px-6 py-3 rounded-full text-white bg-gradient-to-r from-pink-500 to-red-600 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            📄 Download Resume
          </a>
        </motion.div>

        <div className="mt-10 w-full max-w-xl px-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-4 shadow dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-300">
              Recent Wins
            </p>
            <motion.div
              key={winIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-2 text-left"
            >
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {wins[winIndex].title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {wins[winIndex].meta}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
