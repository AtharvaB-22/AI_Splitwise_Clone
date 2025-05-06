/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}", // Adjust if using src/: "./src/app/**/*.{js,jsx}"
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class', // For dark/light mode support
};