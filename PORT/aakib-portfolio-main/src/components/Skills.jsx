"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaPython,
  FaJava,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiMysql,
  SiC,
  SiOracle,
  SiEclipseide,
  SiJupyter,
  SiAdobephotoshop,
  SiVscodium,
} from "react-icons/si";

const categories = [
  "All",
  "Languages",
  "Tools",
  "Design",
  "Databases",
  "Frameworks",
];

const skills = [
  {
    name: "HTML",
    icon: <FaHtml5 className="text-orange-500 text-4xl" />,
    level: 95,
    category: "Languages",
  },
  {
    name: "CSS",
    icon: <FaCss3Alt className="text-blue-500 text-4xl" />,
    level: 90,
    category: "Languages",
  },
  {
    name: "JavaScript",
    icon: <FaJs className="text-yellow-400 text-4xl" />,
    level: 85,
    category: "Languages",
  },
  {
    name: "Python",
    icon: <FaPython className="text-blue-400 text-4xl" />,
    level: 92,
    category: "Languages",
  },
  {
    name: "Java",
    icon: <FaJava className="text-red-600 text-4xl" />,
    level: 88,
    category: "Languages",
  },
  {
    name: "C",
    icon: <SiC className="text-indigo-500 text-4xl" />,
    level: 80,
    category: "Languages",
  },

  {
    name: "Git",
    icon: <FaGitAlt className="text-orange-600 text-4xl" />,
    level: 85,
    category: "Tools",
  },
  {
    name: "VS Code",
    icon: <SiVscodium className="text-indigo-600 text-4xl" />,
    level: 90,
    category: "Tools",
  },
  {
    name: "Jupyter",
    icon: <SiJupyter className="text-orange-500 text-4xl" />,
    level: 80,
    category: "Tools",
  },
  {
    name: "Eclipse IDE",
    icon: <SiEclipseide className="text-purple-700 text-4xl" />,
    level: 78,
    category: "Tools",
  },

  {
    name: "Photoshop",
    icon: <SiAdobephotoshop className="text-blue-700 text-4xl" />,
    level: 70,
    category: "Design",
  },

  {
    name: "MySQL",
    icon: <SiMysql className="text-blue-800 text-4xl" />,
    level: 85,
    category: "Databases",
  },
  {
    name: "Oracle",
    icon: <SiOracle className="text-red-700 text-4xl" />,
    level: 75,
    category: "Databases",
  },

  {
    name: "React",
    icon: <FaReact className="text-cyan-400 text-4xl" />,
    level: 88,
    category: "Frameworks",
  },
  {
    name: "Tailwind",
    icon: <SiTailwindcss className="text-sky-400 text-4xl" />,
    level: 80,
    category: "Frameworks",
  },
];

const Skills = () => {
  const [filter, setFilter] = useState("All");

  const filteredSkills =
    filter === "All"
      ? skills
      : skills.filter((skill) => skill.category === filter);

  return (
    <section className="py-20 px-4 bg-transparent" id="skills">
      <div className="text-center mb-12">
        <h2
          className="text-5xl md:text-6xl font-bold text-black dark:text-white tracking-wide relative inline-block"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          🛠️ My Skills
          <span className="block w-32 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mt-2 mx-auto"></span>
        </h2>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-center flex-wrap gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-medium border ${
              filter === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-transparent text-gray-600 dark:text-gray-300 border-gray-400"
            } transition duration-300`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Cards */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-6xl mx-auto"
      >
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 relative"
          >
            {/* Circular Progress */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="absolute top-0 left-0 w-full h-full">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-300 dark:text-gray-700"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={(1 - skill.level / 100) * 2 * Math.PI * 32}
                  className="text-blue-500"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-2xl">
                {skill.icon}
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-200">
              {skill.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;
