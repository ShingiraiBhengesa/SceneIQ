/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          950: '#070c18',
          900: '#0f1729',
          800: '#1a2332',
          700: '#252d3d',
          600: '#2e3a4e',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #22d3ee, #a855f7)',
        'gradient-card': 'linear-gradient(135deg, rgba(34,211,238,0.05), rgba(168,85,247,0.05))',
      },
      boxShadow: {
        'glow-cyan': '0 0 24px rgba(34, 211, 238, 0.25)',
        'glow-purple': '0 0 24px rgba(168, 85, 247, 0.25)',
        'card': '0 4px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.35)' },
        },
      },
    },
  },
  plugins: [],
}
