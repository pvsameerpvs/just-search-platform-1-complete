import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jsOrange: {
          500: "#F97316",
          600: "#EA580C",
        },
        jsBlack: {
          900: "#000000",
          800: "#1a1a1a",
          700: "#2a2a2a",
        },
        jsWhite: "#ffffff",
      },
    },
  },
  plugins: [],
};
export default config;
