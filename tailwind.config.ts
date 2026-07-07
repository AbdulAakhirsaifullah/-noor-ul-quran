import type { Config } from "tailwindcss";

// Design tokens for Noor-ul-Quran
// Palette: warm off-white paper, deep Islamic green, muted gold accent, ink text
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBF9F3",      // warm off-white background (light mode)
        ink: "#1B2420",        // near-black green-tinted text
        night: "#0E1712",      // dark mode background
        "night-card": "#152119",
        primary: {
          DEFAULT: "#0F5132",  // deep masjid green
          50: "#E8F3EC",
          100: "#C8E4D2",
          400: "#2E7D52",
          600: "#0F5132",
          700: "#0A3A24",
          900: "#062416",
        },
        gold: {
          DEFAULT: "#B8923F",
          light: "#D9BC7A",
          dark: "#8C6B26",
        },
      },
      fontFamily: {
        arabic: ["var(--font-amiri)", "Traditional Arabic", "serif"],
        display: ["var(--font-lateef)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        card: "0 4px 24px -8px rgba(15, 81, 50, 0.15)",
        goldGlow: "0 0 0 1px rgba(184,146,63,0.35)",
      },
      backgroundImage: {
        "islamic-pattern": "url('/patterns/geometric.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
