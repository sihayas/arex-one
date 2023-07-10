// * @type {import('tailwindcss').Config}
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        low: "0px 0px 1px 0px rgba(0, 0, 0, 0.25);",
        medium: "0px 0px 20px 0px rgba(0, 0, 0, 0.09);",
        cmdkScaled: "0 0 30px rgba(0, 0, 0, 0.1)",
        nav: "0 0 0 1px hsla(0, 0%, 0%, 0.047), 0 4px 4px hsla(0, 0%, 0%, 0.141)",
      },
      colors: {
        black: "#333333",
        gray: "#585858",
        gray1: "#777777",
        gray2: "#999999",
        gray3: "#CCCCCC",
        silver: "rgba(0, 0, 0, 0.05)",
        blurEntry: "rgba(255, 255, 255, 0.2)",
        blurEntryDark: "rgba(0, 0, 0, 0.8)",
        error: "rgb(255,94,0)",
      },
      letterSpacing: {
        tight: "-.02em",
      },
      transitionProperty: {
        opacity: "opacity",
      },
      transitionTimingFunction: {
        entryPreview: "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
        renderReplies: "cubic-bezier(0.65, 0.05, 0.36, 1)",
      },
      translate: {
        "3d": "0,0,0",
      },
      width: {
        fill: "-webkit-fill-available",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "translate-z": (value) => ({
            "--tw-translate-z": value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
          }), // this is actual CSS
        },
        { values: theme("translate"), supportsNegativeValues: true }
      );
    }),
    require("tailwind-scrollbar"),
  ],
};
