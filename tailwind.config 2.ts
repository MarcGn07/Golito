import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        ink: {
          DEFAULT: "#10140F",   // near-black, warm green-black — dark mode background
          2: "#171D14",         // dark mode elevated surface
          3: "#1F261B",         // dark mode hairline / border
        },
        paper: {
          DEFAULT: "#F2F3ED",   // pale sage-white — light mode background
          2: "#E7E9DF",         // light mode elevated surface
          3: "#D8DBCC",         // light mode hairline / border
        },
        lime: {
          DEFAULT: "#C8FF4D",   // Golito primary accent
          dim: "#9FE62E",
          deep: "#7CBF1C",
        },
        muted: {
          light: "#5B6058",
          dark: "#9BA398",
        },
        // Per-game identity colors (used for gradient cards)
        game: {
          tenable: { from: "#2E8FE0", to: "#12417E" },
          hitster: { from: "#8A5CFF", to: "#FF4FA0" },
          scaleboard: { from: "#FFC24D", to: "#FF6B35" },
          pricetag: { from: "#1FD3AE", to: "#046B5B" },
          squadstats: { from: "#FF6F5B", to: "#B32E4E" },
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
