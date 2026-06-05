/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme premium color palette
        background: "#0f172a", // Deep slate background
        surface: "#1e293b",    // Lighter slate card surface
        primary: "#3b82f6",    // Electric blue accents
        accent: "#10b981",     // Emerald green matching indicators
        border: "#334155"      // Clean subtle dividing borders
      }
    },
  },
  plugins: [],
}