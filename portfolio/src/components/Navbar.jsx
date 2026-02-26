"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { Great_Vibes } from "next/font/google";
import clsx from "clsx";

const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

const navLinks = [
  { label: "🏠 Home", href: "#hero", color: "text-red-500" },
  { label: "👤 About", href: "#about", color: "text-yellow-500" },
  { label: "🛠️ Skills", href: "#skills", color: "text-green-500" },
  { label: "💼 Projects", href: "#projects", color: "text-blue-500" },
  { label: "🎓 Certifications", href: "#certifications", color: "text-purple-500" },
  { label: "📄 Resume", href: "#resume", color: "text-pink-500" },
  { label: "📬 Contact", href: "#contact", color: "text-orange-500" },
];

const accents = [
  { name: "Aurora", value: "#6366f1" },
  { name: "Lagoon", value: "#0ea5e9" },
  { name: "Coral", value: "#f97316" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accent, setAccent] = useState(accents[0].value);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const saved = window.localStorage.getItem("accent-color");
    const initial = saved || accents[0].value;
    setAccent(initial);
    document.documentElement.style.setProperty("--accent", initial);
  }, [mounted]);

  const handleAccentChange = (value) => {
    setAccent(value);
    document.documentElement.style.setProperty("--accent", value);
    window.localStorage.setItem("accent-color", value);
  };

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
        {/* Brand Name */}
        <a href="#hero" className="text-3xl font-bold tracking-wider bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent select-none">
          <span className={greatVibes.className}>Bhat Aakib</span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={clsx(
                  "transition-all hover:underline underline-offset-4 hover:scale-105",
                  link.color
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
          {mounted && (
            <>
              <li className="flex items-center gap-2">
                {accents.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAccentChange(option.value)}
                    className={clsx(
                      "size-5 rounded-full border border-white/40 shadow-sm transition",
                      accent === option.value ? "accent-ring" : ""
                    )}
                    style={{ backgroundColor: option.value }}
                    aria-label={`Use ${option.name} accent`}
                  />
                ))}
              </li>
              <li>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                  className="text-xl ml-2 transition hover:text-yellow-400"
                >
                  {theme === "dark" ? <FaSun /> : <FaMoon />}
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-2xl text-gray-700 dark:text-gray-200"
          aria-label="Mobile Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 py-5 space-y-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-md">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={clsx(
                "block text-base font-medium transition hover:underline underline-offset-4",
                link.color
              )}
            >
              {link.label}
            </a>
          ))}
          {mounted && (
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {accents.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleAccentChange(option.value);
                    }}
                    style={{ backgroundColor: option.value }}
                    className={clsx(
                      "size-6 rounded-full border border-white/30",
                      accent === option.value ? "accent-ring" : ""
                    )}
                    aria-label={`Use ${option.name} accent`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  toggleTheme();
                  closeMenu();
                }}
                className="flex items-center gap-2 text-base font-medium hover:text-yellow-400"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
