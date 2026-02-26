"use client";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-8 md:px-16 bg-transparent">
      <motion.div
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* 3D Tilt + Glow Image */}
        <Tilt
          tiltMaxAngleX={20}
          tiltMaxAngleY={20}
          perspective={1200}
          transitionSpeed={1500}
          scale={1.05}
          gyroscope={true}
          className="w-full flex justify-center"
        >
          <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-400 animate-glow">
            <div className="bg-white dark:bg-gray-950 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/aakib.jpg"
                alt="Mohammad Aakib Bhat"
                width={320}
                height={320}
                className="object-cover rounded-3xl"
              />
            </div>
          </div>
        </Tilt>

        {/* Text Section (combined, top-quality copy) */}
        <div className="text-center md:text-left space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
            About
          </p>
          <h2 className="section-title text-gray-900 dark:text-white">
            👋 Crafting useful, trustworthy digital experiences.
          </h2>

          <p className="section-subtitle">
            Hey! I’m <strong>Mohammad Aakib Bhat</strong>, a curious creator and technology enthusiast from <strong>Jammu & Kashmir</strong> currently pursuing a <strong>B.Tech in Computer Science & System Engineering</strong> at <strong>C.V. Raman Global University</strong>.
          </p>

          <p className="section-subtitle">
            I design and build human-friendly digital experiences that blend aesthetics, accessibility, and security. I enjoy translating ideas into performant interfaces, pairing clean front-end systems with reliable back-end services, and stress-testing every feature for security gaps.
          </p>

          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Currently on a learning journey, I take joy in building purposeful digital experiences — experiences that don’t just work, but feel right. I love merging creativity with logic — designing sleek interfaces, solving real-world challenges, and ensuring that what I build is as secure as it is elegant.
          </p>

          <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            “I design with empathy, build with precision, and protect with intent — because the web deserves more than functionality; it deserves integrity.”
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
