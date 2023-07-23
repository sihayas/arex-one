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
        medium: "0px 0px 20px 0px rgba(0, 0, 0, 0.09)",
        cmdkScaled:
          "0px 0px 0px 0px rgba(0, 0, 0, 0.03), 0px 11px 23px 0px rgba(0, 0, 0, 0.03), 0px 43px 43px 0px rgba(0, 0, 0, 0.03), 0px 96px 57px 0px rgba(0, 0, 0, 0.02), 0px 170px 68px 0px rgba(0, 0, 0, 0.00), 0px 266px 75px 0px rgba(0, 0, 0, 0.00)",
        entry:
          "0px 0px 0px rgba(0, 0, 0, 0.03), 0px 2px 5px rgba(0, 0, 0, 0.03), 0px 8px 8px rgba(0, 0, 0, 0.03), 0px 19px 11px rgba(0, 0, 0, 0.02), 0px 33px 13px rgba(0, 0, 0, 0.00), 0px 52px 15px rgba(0, 0, 0, 0.00)",
        reply:
          "0px 0px 0px rgba(0, 0, 0, 0.03), 0px 1px 2px rgba(0, 0, 0, 0.03), 0px 3px 3px rgba(0, 0, 0, 0.03), 0px 7px 4px rgba(0, 0, 0, 0.02), 0px 13px 5px rgba(0, 0, 0, 0.00), 0px 21px 6px rgba(0, 0, 0, 0.00)",
        albumFavorite:
          "0px 0px 0px 0px rgba(0, 0, 0, 0.20), 0px 2px 4px 0px rgba(0, 0, 0, 0.20), 0px 7px 7px 0px rgba(0, 0, 0, 0.17), 0px 16px 10px 0px rgba(0, 0, 0, 0.10), 0px 29px 12px 0px rgba(0, 0, 0, 0.03), 0px 45px 13px 0px rgba(0, 0, 0, 0.00);",
        search:
          "0px 0px 0px rgba(0, 0, 0, 0.03), 0px 6px 14px rgba(0, 0, 0, 0.03), 0px 26px 26px rgba(0, 0, 0, 0.03), 0px 58px 35px rgba(0, 0, 0, 0.02), 0px 103px 41px rgba(0, 0, 0, 0.00), 0px 161px 45px rgba(0, 0, 0, 0.00)",
        stars:
          "0px 0px 0px 0px rgba(0, 0, 0, 0.03), 0px 0px 0px 0px rgba(0, 0, 0, 0.03), 0px 1px 1px 0px rgba(0, 0, 0, 0.03), 0px 1px 1px 0px rgba(0, 0, 0, 0.02), 0px 2px 1px 0px rgba(0, 0, 0, 0.00), 0px 4px 1px 0px rgba(0, 0, 0, 0.00);",
        rating: "0px 0px 10px 0px rgba(0, 0, 0, 0.08);",
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
