/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hina: ["Hina Mincho", "serif"],
        zenkaku: ['Zen Kaku Gothic New', "sans-serif"],
        noto: ['Noto Sans JP', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
