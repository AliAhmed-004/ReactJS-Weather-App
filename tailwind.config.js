/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // VERY important to cover all source files
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {},
  },
  plugins: [],
};
