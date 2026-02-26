"use client";

import { useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const projects = [
  {
    name: "CGU Timetable Management System",
    tech: "Java Servlets, JSP, MySQL",
    description:
      "A Java-based web app for managing academic timetables, courses, faculty, and scheduling in institutions.",
    github: "https://github.com/bhataakib02",
    image: "/projects/cgu-timetable.png",
  },
  {
    name: "Online Retail Application",
    tech: "Flask, MySQL, HTML/CSS, Bootstrap",
    description:
      "Full-stack e-commerce platform with user cart, checkout, admin dashboard, and invoice generation.",
    github: "https://github.com/bhataakib02/retail_app",
    image: "/projects/retail-app.png",
  },
  {
    name: "3D Calculator",
    tech: "HTML, CSS, JavaScript",
    description:
      "A 3D UI calculator supporting all arithmetic operations with animated transitions.",
    github: "https://github.com/bhataakib02",
    image: "/projects/calculator.png",
  },
  {
    name: "Heritage App",
    tech: "HTML, CSS, JavaScript",
    description:
      "Displays cultural heritage monuments and facts with a responsive layout.",
    github: "https://github.com/bhataakib02",
    image: "/projects/heritage.png",
  },
  {
    name: "Connect Four",
    tech: "Python (Terminal)",
    description:
      "Classic Connect Four game playable via terminal with intelligent logic.",
    github: "https://github.com/bhataakib02",
    image: "/projects/connect-four.png",
  },
  {
    name: "To-Do List Web App",
    tech: "HTML, CSS, JavaScript",
    description:
      "A minimalist to-do app with persistent local storage and animated task controls.",
    github: "https://github.com/bhataakib02",
    image: "/projects/todo.png",
  },
];

export default function Projects() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="projects"
      className="py-20 px-4 bg-transparent transition duration-300"
    >
      {/* Stylish Centered Heading */}
      <div className="text-center mb-12">
        <h2
          className="text-5xl md:text-6xl font-bold text-black dark:text-white tracking-wide relative inline-block"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          💼 Projects
          <span className="block w-32 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mt-2 mx-auto"></span>
        </h2>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-xl hover:shadow-2xl transition duration-300"
          >
            <div
              className="cursor-pointer overflow-hidden rounded-lg mb-4"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-48 object-cover rounded-md hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Tech:</strong> {project.tech}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
              {project.description}
            </p>
            <div className="flex gap-4 text-xl">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-400"
              >
                <FaGithub />
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-400"
              >
                <FaExternalLinkAlt />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Popup */}
      {lightboxOpen && (
        <Lightbox
          mainSrc={projects[currentImageIndex].image}
          nextSrc={projects[(currentImageIndex + 1) % projects.length].image}
          prevSrc={
            projects[
              (currentImageIndex + projects.length - 1) % projects.length
            ].image
          }
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setCurrentImageIndex(
              (currentImageIndex + projects.length - 1) % projects.length
            )
          }
          onMoveNextRequest={() =>
            setCurrentImageIndex((currentImageIndex + 1) % projects.length)
          }
          imageCaption={projects[currentImageIndex].name}
        />
      )}
    </section>
  );
}
