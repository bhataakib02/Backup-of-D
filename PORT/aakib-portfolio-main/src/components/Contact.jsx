"use client";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaPaperPlane, FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xwpbjnjj", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        toast.success("✅ Message sent successfully!");
        form.reset();
      } else {
        toast.error("❌ Failed to send. Try again.");
      }
    } catch {
      toast.error("⚠️ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-transparent transition duration-300"
    >
      {/* Stylish Centered Heading */}
      <div className="text-center mb-10">
        <h2
          className="text-5xl md:text-6xl font-bold text-black dark:text-white tracking-wide relative inline-block"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          🤗 Let’s Connect
          <span className="block w-32 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mt-2 mx-auto"></span>
        </h2>
      </div>

      <p className="text-center text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
        I'm currently available to take on new projects, so feel free to send me a message about anything that you want me to work on. You can contact anytime!
      </p>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
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

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-xl p-8 rounded-3xl space-y-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name
            </label>
            <input
              required
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              required
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Message
            </label>
            <textarea
              required
              name="message"
              rows="5"
              placeholder="Write your message here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
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
