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
        nav: "0 0 0 1px hsla(0, 0%, 0%, 0.047), 0 4px 4px hsla(0, 0%, 0%, 0.141)",
        cmdkScaled:
          "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",
        album:
          "0px 0px 6px rgba(0, 0, 0, 0.02), 0px 2px 4px rgba(0, 0, 0, 0.08);",
        defaultLow: "0 1px 4px rgba(0,0,0,.1), 0 2px 4px rgba(0,0,0,.1)",
        defaultLowHover: "0 10px 40px rgba(0,0,0,.2)",
      },
      colors: {
        black: "#333333",
        grey: "#999999",
        greyTitle: "#585858",
        greyUnselected: "#CCCCCC",
        greySelected: "#6A6A6A",
        greyHover: "#333333",
        silver: "rgba(0, 0, 0, 0.05)",
        blurEntry: "rgba(255, 255, 255, 0.2)",
        error: "rgb(255,94,0)",
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
