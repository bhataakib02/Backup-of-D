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

        {/* Text Section */}
        <div className="text-center md:text-left">
          <h2
            className="text-5xl md:text-6xl font-bold text-black dark:text-white tracking-wide relative inline-block mx-auto"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            👋 About Me
            <span className="block w-32 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mt-2 mx-auto"></span>
          </h2>

          <p className="mt-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Hey! I’m <strong>Mohammad Aakib Bhat</strong>, a curious creator and technology enthusiast from the scenic valleys of <strong>Jammu & Kashmir</strong>.
            <br /><br />
            Currently on a learning journey as a <strong>B.Tech student in Computer Science & System Engineering</strong> at <strong>C.V. Raman Global University</strong>, I find joy in building purposeful digital experiences — experiences that don’t just work, but feel right.
            <br /><br />
            I love merging creativity with logic — designing sleek interfaces, solving real-world challenges, and ensuring that what I build is as secure as it is elegant. My journey isn’t just about writing code — it’s about crafting digital spaces that users can trust and enjoy.
            <br /><br />
            I’m driven by continuous growth, attention to detail, and a mission to make the web more beautiful, accessible, and secure — one project at a time.
          </p>

          {/* Signature Quote */}
          <p
            className="mt-8 text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center md:text-left"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            “I design with empathy, build with precision, and protect with intent — because the web deserves more than just functionality; it deserves integrity.”
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
