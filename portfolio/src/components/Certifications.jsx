"use client";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";

const certifications = [
  {
    title: "Cybersecurity & Ethical Hacking Bootcamp",
    issuer: "LetsUpgrade",
    date: "May 2024",
    file: "/certs/cybersecurity.pdf",
    image: "/certs/cybersecurity.png",
  },
  {
    title: "Git & GitHub Bootcamp",
    issuer: "LetsUpgrade",
    date: "Feb 2024",
    file: "/certs/git.pdf",
    image: "/certs/git.png",
  },
  {
    title: "Python & Flask Practice Course",
    issuer: "Udemy",
    date: "Jan 2024",
    file: "/certs/python-flask.pdf",
    image: "/certs/python-flask.png",
  },
  {
    title: "Node.js Bootcamp",
    issuer: "LetsUpgrade",
    date: "Apr 2024",
    file: "/certs/nodejs.pdf",
    image: "/certs/nodejs.png",
  },
  {
    title: "Postman API Expert Certification",
    issuer: "LetsUpgrade",
    date: "Mar 2024",
    file: "/certs/postman.pdf",
    image: "/certs/postman.png",
  },
  {
    title: "Software Engineering Job Simulation",
    issuer: "Forage",
    date: "Jun 2024",
    file: "/certs/software-eng.pdf",
    image: "/certs/software-eng.png",
  },
];

const Certifications = () => {
  return (
    <section
      id="certifications"
      className="py-20 px-4 bg-white dark:bg-gray-950"
    >
      <div className="text-center mb-12 space-y-4 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
          Credentials
        </p>
        <h2 className="section-title text-gray-900 dark:text-white">
          📜 Continuous learning, proven credentials.
        </h2>
        <p className="section-subtitle">
          Each certification backs up the security-first habits, API craftsmanship, and tooling I
          bring to every collaboration.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {certifications.map((cert, index) => (
          <motion.article
            key={cert.title}
            className="rounded-3xl border border-gray-200/60 bg-white/80 p-5 shadow-lg dark:border-white/10 dark:bg-white/5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="relative mb-4 w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-white/5 aspect-video">
              <Image
                src={cert.image}
                alt={cert.title}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                className="object-contain p-4"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {cert.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {cert.issuer} • {cert.date}
            </p>
            <a
              href={cert.file}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-300"
            >
              View certificate <FaExternalLinkAlt className="text-xs" />
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
