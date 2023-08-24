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
        low: "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
        nav: "0px 0px 20px 0px rgba(0, 0, 0, 0.09)",
        cmdkScaled:
          "0px 0px 0px 0px rgba(0, 0, 0, 0.03), 0px 11px 23px 0px rgba(0, 0, 0, 0.03), 0px 43px 43px 0px rgba(0, 0, 0, 0.03), 0px 96px 57px 0px rgba(0, 0, 0, 0.02), 0px 170px 68px 0px rgba(0, 0, 0, 0.00), 0px 266px 75px 0px rgba(0, 0, 0, 0.00)",
        index: "0px 1px 5px 0px rgba(0, 0, 0, 0.25)",
        album:
          "0px 0px 0px 0px rgba(0, 0, 0, 0.11), 0px 6px 14px 0px rgba(0, 0, 0, 0.11), 0px 26px 26px 0px rgba(0, 0, 0, 0.10), 0px 58px 35px 0px rgba(0, 0, 0, 0.06), 0px 103px 41px 0px rgba(0, 0, 0, 0.02), 0px 161px 45px 0px rgba(0, 0, 0, 0.00)",
      },
      colors: {
        black: "#333333",
        gray: "#585858",
        gray1: "#777777",
        gray2: "#999999",
        gray3: "#CCCCCC",
        silver: "rgba(0, 0, 0, 0.05)",
        blurWhite: "rgba(255, 255, 255, 0.2)",
        blurDark: "rgba(0, 0, 0, 0.8)",
        action: "rgb(255,94,0)",
        cursor: "rgba(108, 108, 108, 0.5)",
        red: "#FF0000",
        nav: "rgba(250, 250, 250, 0.75)",
        violet: "rgb(75,61,103)",
      },
      fontFamily: {
        baskerville: ["Baskerville", "serif"],
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
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".shadow-bubble": {
          filter:
            "drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.01)) drop-shadow(-7px 4px 18px rgba(0, 0, 0, 0.01)) drop-shadow(-30px 15px 33px rgba(0, 0, 0, 0.01)) drop-shadow(-67px 33px 45px rgba(0, 0, 0, 0.01)) drop-shadow(-119px 59px 53px rgba(0, 0, 0, 0.00)) drop-shadow(-185px 92px 58px rgba(0, 0, 0, 0.00))",
        },
      });
    }),
    require("tailwind-scrollbar"),
  ],
};
