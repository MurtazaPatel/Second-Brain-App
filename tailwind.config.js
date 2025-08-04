/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        purple:{
          300:"#e1e7fd",
          500:"#5952ca",
          600: "#4e46dc",
        }
      }
    },
  },
  plugins: [],
}

