/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'electric-blue': '#0080ff',
        'plasma-green': '#00ff80',
        'quantum-purple': '#8000ff',
        'fusion-orange': '#ff8000',
        'danger-red': '#ff0040',
        'warning-yellow': '#ffff00',
        'info-cyan': '#00d4ff',
        'dark-bg': '#0a0a0f',
        'dark-surface': '#1a1a2e',
        'dark-elevated': '#16213e',
        'dark-border': '#0f3460',
        'text-primary': '#ffffff',
        'text-secondary': '#e0e6ed',
        'text-muted': '#a0a6ad',
        // Legacy colors for compatibility
        'matrix-green': '#00ffff',
        'cyber-green': '#00ff80',
        'primary-green': '#00ffff',
        'cyber-red': '#ff0040',
        'cyber-blue': '#0080ff',
        'cyber-purple': '#8000ff',
        'cyber-orange': '#ff8000',
        'dark-900': '#0a0a0f',
        'dark-800': '#1a1a2e',
        'dark-700': '#16213e',
        'dark-600': '#0f3460',
      },
      fontFamily: {
        'serif': ['Times New Roman', 'Times', 'serif'],
        'mono': ['Courier New', 'Monaco', 'Consolas', 'monospace'],
        'cyber': ['Orbitron', 'Exo 2', 'Rajdhani', 'sans-serif'],
        'sans': ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'glow': 'professionalGlow 3s ease-in-out infinite',
        'slideInUp': 'slideInUp 0.6s ease-out',
        'fadeIn': 'fadeIn 0.8s ease-out',
        'pulse': 'pulse 2s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        professionalGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.2)'
          }
        },
        slideInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        }
      },
      boxShadow: {
        'cyber': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 255, 136, 0.1)',
        'cyber-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 255, 136, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}