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
        stars: "0px 1px 4px 0px rgba(0, 0, 0, 0.07);",
        new: "0px 0px 0px 0px rgba(0, 0, 0, 0.07), 0px 1px 2px 0px rgba(0, 0, 0, 0.07), 0px 3px 3px 0px rgba(0, 0, 0, 0.06), 0px 6px 4px 0px rgba(0, 0, 0, 0.04), 0px 11px 4px 0px rgba(0, 0, 0, 0.01), 0px 17px 5px 0px rgba(0, 0, 0, 0.00);",
        cmdkScaled2:
          "0px 0px 0px 0px rgba(0, 0, 0, 0.12), 4px 9px 22px 0px rgba(0, 0, 0, 0.11), 15px 37px 40px 0px rgba(0, 0, 0, 0.10), 35px 84px 55px 0px rgba(0, 0, 0, 0.06), 62px 149px 65px 0px rgba(0, 0, 0, 0.02), 97px 233px 71px 0px rgba(0, 0, 0, 0.00);",
        entry: "0px 0px 2px rgba(0, 0, 0, 0.11);",
        artworkFeed:
          "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04);",
      },
      colors: {
        black: "#333333",
        gray: "#585858",
        gray1: "#777777",
        gray2: "#999999",
        gray3: "#CCCCCC",
        silver: "rgba(0, 0, 0, 0.05)",
        silver2: "rgba(0, 0, 0, 0.1)",
        blurWhite: "rgba(255, 255, 255, 0.2)",
        blurDark: "rgba(0, 0, 0, 0.8)",
        action: "rgb(255,94,0)",
        cursor: "rgba(108, 108, 108, 0.5)",
        red: "#FF0000",
        nav: "rgba(250, 250, 250, 0.75)",
        violet: "rgb(75,61,103)",
        stars: "rgba(250, 250, 255, 0.75)",
      },
      fontFamily: {
        baskerville: ["Baskerville", "serif"],
      },
      gridRowStart: {
        9: "9",
        10: "10",
        11: "11",
      },
      gridTemplateColumns: {
        17: "repeat(17, minmax(0, 1fr))", // 17 columns
      },
      gridTemplateRows: {
        11: "repeat(11, minmax(0, 1fr))", // 11 rows
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
