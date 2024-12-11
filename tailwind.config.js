/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokeball: {
          DEFAULT: '#ee1515',
          hover: '#d10808',
        },
      },
    },
  },
  plugins: [],
}