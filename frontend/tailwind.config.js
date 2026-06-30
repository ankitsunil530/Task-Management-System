/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // This enables dark mode via the 'dark' class on <html>
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'aboutbg': "url('/src/images/aboutbg.jpg')"
      }
    },
  },
  plugins: [],
}

