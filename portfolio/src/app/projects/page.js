"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { projects } from "@/components/Projects";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Summary");

  useEffect(() => {
    setActiveTab("Summary");
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <div className="mb-12 space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition"
            >
              <FaArrowLeft className="text-sm" />
              Back to Home
            </Link>
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
                All Projects
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Complete Project Portfolio
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Explore all my projects and dive deep into each case study, architecture, and results.
              </p>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.article
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ translateY: -4 }}
                className="flex h-full flex-col rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="relative h-48 w-full overflow-hidden rounded-t-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  aria-label={`Open details for ${project.name}`}
                >
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </button>
                <div className="flex flex-1 flex-col p-5 space-y-4">
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                    {project.tech.map((stack) => (
                      <span
                        key={stack}
                        className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-600 dark:bg-white/10 dark:text-white"
                      >
                        {stack}
                      </span>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-4 text-lg">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.name} on GitHub`}
                      className="rounded-full border border-gray-200 px-3 py-2 text-gray-700 transition hover:bg-gray-50 dark:border-white/20 dark:text-gray-100 dark:hover:bg-white/10"
                    >
                      <FaGithub />
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open live demo for ${project.name}`}
                        className="rounded-full border border-emerald-500 px-3 py-2 text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for project details */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-labelledby="project-dialog-title"
            role="dialog"
            aria-modal="true"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedProject(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
                    Case Study
                  </p>
                  <h3 id="project-dialog-title" className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {selectedProject.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  aria-label="Close project details"
                >
                  Close ✕
                </button>
              </div>
              <div className="mt-5 flex gap-3 text-sm font-semibold">
                {["Summary", "Architecture", "Results"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "rounded-full px-4 py-2 transition border",
                      activeTab === tab
                        ? "border-[var(--accent)] text-[var(--accent)]"
                        : "border-transparent text-gray-500 dark:text-gray-300"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-700 dark:text-gray-200 space-y-3">
                {activeTab === "Summary" && <p>{selectedProject.description}</p>}
                {activeTab === "Architecture" &&
                  selectedProject.architecture.map((item) => (
                    <p key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      {item}
                    </p>
                  ))}
                {activeTab === "Results" &&
                  selectedProject.results.map((item) => (
                    <p key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </p>
                  ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  <FaGithub /> View Code
                </a>
                {selectedProject.demo && (
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                  >
                    <FaExternalLinkAlt /> Watch Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
