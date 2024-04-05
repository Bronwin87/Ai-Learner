const { addDynamicIconSelectors } = require("@iconify/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      width: {
        inherit: "inherit",
      },
      fontFamily: {
        zabal: ["Zabal", "sans-serif"],
      },
      screens: {
        "max-400": { max: "399px" },
      },
      textShadow: {
        sm: "-2px 2px 2px rgba(0, 0, 0, 0.5)",
        DEFAULT: "2px 2px 2px rgba(0, 0, 0, 0.5)",
        white: " -2px 2px 10px rgba(255,255,255,0.6)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [
    addDynamicIconSelectors(),
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    },
  ],
};
