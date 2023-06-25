const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      // app content
      `src/**/*.{js,ts,jsx,tsx}`,
      // include packages if not transpiling
      // "../../packages/**/*.{js,ts,jsx,tsx}",
   ],
   darkMode: "class",
   theme: {
      extend: {
         colors: {
            floral: {
               DEFAULT: "#D0BCFF",
               50: "#d0bcff",
               100: "#48464c",
               200: "#575360",
               300: "#655f73",
               400: "#756d88",
               500: "#847a9b",
               600: "#9387af",
               700: "#a395c3",
               800: "#b1a1d7",
               900: "#c1afeb",
            },
            "slate-blue": {
               DEFAULT: "#4F378B",
            },
            lavender: {
               DEFAULT: "#E8DEF8",
            },
            nickel: { DEFAULT: "#737373" },
            snow: {
               DEFAULT: "#FFFBFE",
            },
            "royal-purple": {
               DEFAULT: "#6750A4",
            },
            "earie-black": {
               DEFAULT: "#1C1B1F",
               50: "#1E1F1B",
               100: "#1E1F1B",
               200: "#1E1F1B",
               300: "#1E1F1B",
               400: "#1E1F1B",
               500: "#1E1F1B",
               600: "#1E1F1B",
               700: "#1E1F1B",
               800: "#1E1F1B",
               900: "#1C1C1C",
            },
         },
         dropShadow: {
            "btn-dark":
               "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)",
            btn: "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)",
            card: "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
            "card-dark":
               "0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)",
         },
      },
   },
   variants: {
      typography: ["dark"],
   },
   plugins: [require("@tailwindcss/typography")],
};
