/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
        },
        indigo: {
          950: '#1e1b4b',
        },
        emerald: {
          950: '#022c22',
        },
        amber: {
          950: '#451a03',
        },
        red: {
          950: '#450a0a',
        },
        purple: {
          950: '#3b0764',
        },
      },
    },
  },
  plugins: [],
}