/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: "#062332",
          900: "#07364a",
          800: "#07506c",
          700: "#0a6783",
        },
        mangrove: {
          900: "#143828",
          800: "#1d4f35",
          700: "#286a45",
          500: "#4a9b62",
        },
        sand: {
          100: "#fff6df",
          200: "#f3dfb5",
          300: "#d8b878",
        },
        cyanSoft: "#94e7ee",
      },
      boxShadow: {
        glow: "0 20px 80px rgba(148, 231, 238, 0.24)",
        card: "0 18px 55px rgba(6, 35, 50, 0.14)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
