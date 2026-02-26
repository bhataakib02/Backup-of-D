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

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-transparent"
    >
      {/* Profile Image */}
      <motion.div
        className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-blue-600 shadow-2xl mb-6"
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

      {/* Name in calligraphy */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-black dark:text-white mb-4 tracking-wide"
        style={{ fontFamily: "'Great Vibes', cursive" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Hi, I'm Mohammad Aakib Bhat 👋
      </motion.h1>

      {/* Typing Text with Dynamic Color */}
      <motion.div
        key={roleIndex}
        className={`text-xl md:text-3xl font-medium mt-2 transition-all duration-500 ${roles[roleIndex].color}`}
      >
        {roles[roleIndex].text}
      </motion.div>

      {/* Creative Quote */}
      <p
        className="mt-6 text-gray-800 dark:text-gray-200 font-semibold italic text-xl md:text-2xl text-center max-w-2xl mx-auto"
        style={{ fontFamily: "'Times New Roman', cursive" }}
      >
        “Engineering the web with soul, security, and a splash of style.”
      </p>

      {/* Buttons */}
      <motion.div
        className="mt-8 flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <a
          href="#projects"
          className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
        >
          🚀 View Projects
        </a>
        <a
          href="#contact"
          className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-green-400 to-emerald-600 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
        >
          📞 Contact Me
        </a>
        <a
          href="/Mohammad_Aakib_Bhat_Resume.pdf"
          download
          className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-pink-500 to-red-600 shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
        >
          📄 Download Resume
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
