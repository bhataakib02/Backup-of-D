"use client";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-8 px-4 mt-24 border-t dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Name and copyright */}
        <p className="text-sm text-center md:text-left">
          © 2025 <span className="font-semibold">Mohammad Aakib Bhat</span>. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex space-x-5 text-xl">
          <a
            href="https://www.linkedin.com/in/mohammad-aakib-bhat"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/bhataakib02"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-white transition"
          >
            <FaGithub />
          </a>
          <a
            href="mailto:bhataakib02@gmail.com"
            className="hover:text-red-500 transition"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
