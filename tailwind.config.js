// * @type {import('tailwindcss').Config}

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
        shadowKitMedium:
          "0px 4px 8px 0px rgba(0, 0, 0, 0.06), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
        shadowKitLow:
          "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",
        shadowKitHigh:
          "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
        essentials:
          "0px 11px 24px 0px rgba(0, 0, 0, 0.10), 0px 43px 43px 0px rgba(0, 0, 0, 0.09), 0px 97px 58px 0px rgba(0, 0, 0, 0.05), 0px 173px 69px 0px rgba(0, 0, 0, 0.01), 0px 271px 76px 0px rgba(0, 0, 0, 0.00)",
        cardArt:
          "0px -4px 9px 0px rgba(0, 0, 0, 0.10), 0px -16px 16px 0px rgba(0, 0, 0, 0.09), 0px -35px 21px 0px rgba(0, 0, 0, 0.05), 0px -63px 25px 0px rgba(0, 0, 0, 0.01), 0px -98px 27px 0px rgba(0, 0, 0, 0.00)",
        cardArtMini:
          "0px -1px 1px 0px rgba(0, 0, 0, 0.10), 0px -2px 2px 0px rgba(0, 0, 0, 0.09), 0px -5px 3px 0px rgba(0, 0, 0, 0.05), 0px -9px 4px 0px rgba(0, 0, 0, 0.01), 0px -15px 4px 0px rgba(0, 0, 0, 0.00)",
        cartArtArtifact:
          "6px 0px 13px 0px rgba(0, 0, 0, 0.10), 23px 2px 23px 0px rgba(0, 0, 0, 0.09), 52px 4px 31px 0px rgba(0, 0, 0, 0.05), 92px 7px 37px 0px rgba(0, 0, 0, 0.01), 143px 11px 40px 0px rgba(0, 0, 0, 0.00)",
      },
      borderRadius: {
        full: "32px",
        max: "9999px",
      },
      colors: {
        gray: "#585858",
        gray1: "#777777",
        gray2: "#999999",
        gray3: "#CCCCCC",
        gray4: "rgba(60, 60, 67, 0.9)",
        gray5: "rgba(60, 60, 67, 0.6)",
        silver: "rgba(0, 0, 0, 0.05)",
        action: "rgb(255,94,0)",
        red: "#FF3319",
        violet: "rgb(75,61,103)",
      },
      dropShadow: {
        shadowKitLow:
          "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",
        shadowKitMedium: "0px 4px 8px 0px rgba(0, 0, 0, 0.06)",
        shadowKitHigh:
          "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
      },
      fontFamily: {
        baskerville: ["Baskerville", "serif"],
        serif: ["Baskerville", "serif"],
        sfRounded: ["SF Pro Rounded", "sans-serif"],
        garamond12: [`var(--font-garamond12)`],
        garamond08: [`var(--font-garamond08)`],
      },
      fontSize: {
        xs: ["11px", "125%"],
        sm: ["13px", "125%"],
        base: ["15px", "150%"],
        lg: ["17px", "150%"],
      },
      gridRowStart: {
        9: "9",
        10: "10",
        11: "11",
      },
      maskImage: {
        entryMask: "url('/images/entry_mask.svg')",
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
  plugins: [require("tailwind-scrollbar")],
};
