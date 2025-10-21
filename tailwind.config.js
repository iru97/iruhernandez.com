/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
      },
      colors: {
        primary: "#197278",
        secondary: "#283d3b",
        accent: "#c44536",
        "accent-dark": "#772e25",
      },
    },
  },
  plugins: [],
};
