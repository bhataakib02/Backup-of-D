// Loader hide after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  setTimeout(() => loader && loader.classList.add('hidden'), 250);

  // Active nav link
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });

  // Theme toggle
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);
  const toggle = document.querySelector('#themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
    });
  }

  // Intersection Observer for reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('reveal');
    });
  }, { threshold: 0.125 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
});

export function currency(num) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num || 0);
}

export function qs(sel) { return document.querySelector(sel); }
export function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }


