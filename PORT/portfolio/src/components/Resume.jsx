"use client";
import { useState } from "react";
import { FaDownload, FaEye, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const Resume = () => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewClick = () => {
    setShowPreview(true);
    setTimeout(() => {
      const preview = document.getElementById("resume-preview");
      if (preview) {
        preview.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <section id="resume" className="py-16 px-4 bg-white dark:bg-gray-950">
      {/* Stylish Centered Heading */}
      <div className="text-center mb-12">
        <h2
          className="text-5xl md:text-6xl font-bold text-black dark:text-white tracking-wide relative inline-block"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          📄 Resume / CV
          <span className="block w-32 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mt-2 mx-auto"></span>
        </h2>
      </div>

      {/* Career Objective */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <motion.h3
          className="text-xl font-semibold text-gray-800 dark:text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎯 Career Objective
        </motion.h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Passionate about Cybersecurity and Full-Stack Web Development, I aim
          to build impactful digital solutions and secure systems while
          continuously enhancing my skills to adapt to evolving technologies.
        </p>
      </div>

      {/* Gradient Resume Box */}
      <div className="max-w-4xl mx-auto bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-[2px] rounded-[30px] shadow-2xl hover:scale-[1.02] transition-all duration-300 mb-12">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-[28px] px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              📄 My Resume (Latest)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You can download or preview the updated PDF version of my resume.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Download */}
            <a
              href="/Mohammad_Aakib_Bhat_Resume.pdf"
              download
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition shadow-md"
            >
              <FaDownload /> Download
            </a>

            {/* Preview / Close */}
            {!showPreview ? (
              <button
                onClick={handlePreviewClick}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full transition shadow-md"
              >
                <FaEye /> Preview
              </button>
            ) : (
              <button
                onClick={handleClosePreview}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full transition shadow-md"
              >
                <FaTimes /> Close Preview
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resume Preview Iframe */}
      {showPreview && (
        <div id="resume-preview" className="max-w-5xl mx-auto mb-16">
          <div className="rounded-xl overflow-hidden shadow-xl border dark:border-gray-700">
            <iframe
              src="/Mohammad_Aakib_Bhat_Resume.pdf"
              className="w-full h-[600px]"
              title="Resume Preview"
            ></iframe>
          </div>
        </div>
      )}

      {/* Resume Details Grid */}
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 px-4">
        {/* Education */}
        <motion.div
          className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg"
          whileHover={{ scale: 1.03 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            🎓 Education
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              <strong>10th:</strong> Islamia English Medium School (88.4%)
            </li>
            <li>
              <strong>12th:</strong> GHSS Luragam (66.4%)
            </li>
            <li>
              <strong>B.Tech:</strong> CSE @ C.V. Raman Global University (CGPA:
              7.62)
            </li>
          </ul>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg"
          whileHover={{ scale: 1.03 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            📜 Certifications
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>✅ Cybersecurity Essentials – Cisco</li>
            <li>✅ Python for Everybody – Univ. of Michigan</li>
            <li>✅ Git & GitHub – LinkedIn Learning</li>
            <li>✅ HTML & CSS – FreeCodeCamp</li>
            <li>✅ Figma for UI/UX – Coursera</li>
          </ul>
        </motion.div>

        {/* Projects */}
        <motion.div
          className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg"
          whileHover={{ scale: 1.03 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            💼 Projects / Experience
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>🛠️ CGU Timetable Management System (Java, JSP, MySQL)</li>
            <li>🛒 Online Retail App (Flask, MySQL, Bootstrap)</li>
            <li>🧠 Connect Four (Python, AI logic)</li>
            <li>🧮 3D Calculator | 🏛️ Heritage App | ✅ To-Do Web App</li>
          </ul>
        </motion.div>

        {/* Skills */}
        <motion.div
          className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg"
          whileHover={{ scale: 1.03 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
            🧰 Technical Skills
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>
              <strong>Languages:</strong> C, Python, Java, JavaScript
            </li>
            <li>
              <strong>Web:</strong> HTML, CSS, Node.js, Flask
            </li>
            <li>
              <strong>Tools:</strong> Git, GitHub, Postman, VS Code, Jupyter
            </li>
            <li>
              <strong>UI/UX:</strong> Figma, Canva
            </li>
            <li>
              <strong>Databases:</strong> MySQL
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
