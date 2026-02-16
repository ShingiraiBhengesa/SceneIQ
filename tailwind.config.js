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
          900: '#0f1729',
          800: '#1a2332',
          700: '#252d3d',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        }
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(to right, #22d3ee, #a855f7)',
      }
    },
  },
  plugins: [],
}
