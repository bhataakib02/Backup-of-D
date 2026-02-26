"use client";
import { motion } from "framer-motion";

const posts = [
  {
    title: "Designing Secure Contact Flows with Formspree + reCAPTCHA",
    date: "Jan 2025",
    link: "https://medium.com/@bhataakib02",
    summary:
      "Step-by-step checklist I use to keep marketing forms resilient, spam-free, and accessible.",
    tags: ["Security", "Accessibility"],
  },
  {
    title: "What Building a Retail Dashboard Taught Me About Data Storytelling",
    date: "Nov 2024",
    link: "https://medium.com/@bhataakib02",
    summary:
      "Turning SQL tables into intuitive, colorful insights (without overwhelming shop owners).",
    tags: ["UX", "Data Viz"],
  },
  {
    title: "Java Servlets Still Matter: Architecting the CGU Timetable System",
    date: "Sep 2024",
    link: "https://medium.com/@bhataakib02",
    summary:
      "Decisions behind caching, permissions, and workflows that scaled to hundreds of faculty updates.",
    tags: ["Java", "Architecture"],
  },
];

const Blog = () => {
  return (
    <section id="writing" className="py-20 px-4 bg-transparent">
      <div className="text-center mb-12 space-y-4 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
          Writing
        </p>
        <h2 className="section-title text-gray-900 dark:text-white">
          ✍️ Documenting the lessons along the way.
        </h2>
        <p className="section-subtitle">
          I write to clarify my thinking and help classmates ramp faster. Here are a few favourites.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        {posts.map((post, index) => (
          <motion.article
            key={post.title}
            className="rounded-2xl border border-white/40 bg-white/80 p-5 shadow dark:border-white/10 dark:bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-300">
              {post.date}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              {post.title}
            </h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{post.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-white/10 dark:text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-300"
            >
              Read article →
            </a>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default Blog;

