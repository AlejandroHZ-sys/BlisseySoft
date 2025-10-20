/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F4F1",
          100: "#CCE8E3",
          200: "#99D1C7",
          300: "#66BAAB",
          400: "#33A38F",
          500: "#008C73", // verde hospitalario
          600: "#00725E",
          700: "#005949",
          800: "#004034",
          900: "#00271F",
        },
        secondary: {
          100: "#EAF2FB",
          200: "#D5E5F7",
          500: "#3A7BD5", // azul corporativo
          700: "#285C9A",
        },
      },
    },
  },
  plugins: [],
};
