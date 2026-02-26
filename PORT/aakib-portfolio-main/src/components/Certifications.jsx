"use client";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

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
      {/* Stylish Centered Heading */}
      <div className="text-center mb-12">
        <h2
          className="text-5xl md:text-6xl font-bold text-black dark:text-white tracking-wide relative inline-block"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          📜 Certifications
          <span className="block w-32 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mt-2 mx-auto"></span>
        </h2>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl hover:shadow-2xl p-5 transition transform hover:-translate-y-1"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <img
              src={cert.image}
              alt={cert.title}
              className="w-full h-40 object-contain rounded-md mb-4"
              onError={(e) => {
                e.target.src = "/certs/thumbs/default.png";
              }}
            />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
              {cert.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {cert.issuer}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Issued: {cert.date}
            </p>
            <a
              href={cert.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline"
            >
              View Certificate <FaExternalLinkAlt />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
