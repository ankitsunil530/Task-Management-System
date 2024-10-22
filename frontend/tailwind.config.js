/** @type {import('tailwindcss').Config} */
export default {
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

