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
        nav: "0px 0px 20px 0px rgba(0, 0, 0, 0.09)",
        interface: "rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;",
        stars:
          "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
        shadowKitMedium:
          "0px 4px 8px 0px rgba(0, 0, 0, 0.06), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
        shadowKitLow:
          "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",
        shadowKitHigh:
          "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
      },
      fontFamily: {
        baskerville: ["Baskerville", "serif"],
      },
      colors: {
        black: "#333333",
        gray: "#585858",
        gray1: "#777777",
        gray2: "#999999",
        gray3: "#CCCCCC",
        gray4: "rgba(60, 60, 67, 0.6)",
        silver: "rgba(0, 0, 0, 0.05)",
        lightSilver: "rgba(0, 0, 0, 0.02)",
        action: "rgb(255,94,0)",
        red: "#FF0000",
        violet: "rgb(75,61,103)",
        nav: "rgba(255, 255, 255, 0.92)",
      },
      dropShadow: {
        interface: "rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;",
      },
      gridRowStart: {
        9: "9",
        10: "10",
        11: "11",
      },
      gridTemplateColumns: {
        17: "repeat(17, minmax(0, 1fr))",
        feed: `repeat(12, 32px)`,
        "tab-cols": "auto 32px",
      },
      gridColumnGap: {
        feed: "32px",
      },
      gridTemplateRows: {
        11: "repeat(11, minmax(0, 1fr))",
        feed: `repeat(17, 32px)`,
      },
      gridRowGap: {
        feed: "32px",
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
      height: {
        fill: "-webkit-fill-available",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          ".h-albums": {
            height: "calc(100% - 64px)",
          },
        },
        ["responsive", "hover"]
      );
    },
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
