"use client";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaPaperPlane, FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const initialStatus = { type: "idle", message: "" };

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setStatus(initialStatus);

    try {
      const response = await fetch("https://formspree.io/f/xwpbjnjj", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setStatus({ type: "success", message: "Thanks for reaching out! I’ll reply soon." });
        form.reset();
      } else {
        setStatus({ type: "error", message: "Something went wrong. Please try again shortly." });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network hiccup detected. Please check your connection and retry.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-transparent transition duration-300"
    >
      <div className="text-center mb-10 space-y-4 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-300">
          Contact
        </p>
        <h2 className="section-title text-gray-900 dark:text-white">
          🤗 Let’s work together.
        </h2>
        <p className="section-subtitle">
          I'm currently open to internships, freelance work, and collaborations. Tell me about your
          idea, tech stack, or the problem you are solving—I’d love to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <motion.div
          className="space-y-6 text-gray-800 dark:text-gray-200 text-base"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4">
            <MdEmail className="text-3xl text-blue-600" />
            <span>bhataakib02@gmail.com</span>
          </div>
          <div className="flex items-center gap-4">
            <MdPhone className="text-3xl text-green-600" />
            <span>+91 9622935158</span>
          </div>
          <div className="flex items-center gap-4">
            <MdLocationOn className="text-3xl text-red-600" />
            <span>Tral, Pulwama, Jammu & Kashmir</span>
          </div>
          <div className="flex items-center gap-4">
            <FaWhatsapp className="text-3xl text-green-500" />
            <a
              href="https://wa.me/919622935158"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-xl p-8 rounded-3xl space-y-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contact-name">
              Your Name
            </label>
            <input
              id="contact-name"
              required
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contact-email">
              Email Address
            </label>
            <input
              id="contact-email"
              required
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="contact-message">
              Your Message
            </label>
            <textarea
              id="contact-message"
              required
              name="message"
              rows="5"
              placeholder="Write your message here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {status.message && (
            <p
              className={`text-sm ${status.type === "success" ? "text-emerald-600" : "text-rose-500"}`}
              role="status"
              aria-live="polite"
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            <FaPaperPlane className="text-lg" />
            {loading ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
