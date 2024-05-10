/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          1000: "#2b2b2b",
          900: "#202a33",
          800: "#2f3136",
          700: "#313338",
          600: "#34363C",
          400: "#d4d7dc",
          300: "#e3e5e8",
          200: "#ebedef",
          100: "#f2f3f5",
        }
      }
    },
  },
  plugins: [],
}