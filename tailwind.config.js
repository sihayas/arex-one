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
        cardArt: "rgba(0, 0, 0, 0.04) 0px 3px 5px",
        wispArt:
          "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
        cartArtArtifact:
          "6px 0px 13px 0px rgba(0, 0, 0, 0.10), 23px 2px 23px 0px rgba(0, 0, 0, 0.09), 52px 4px 31px 0px rgba(0, 0, 0, 0.05), 92px 7px 37px 0px rgba(0, 0, 0, 0.01), 143px 11px 40px 0px rgba(0, 0, 0, 0.00)",
      },
      borderRadius: {
        full: "32px",
        max: "9999px",
      },
      colors: {
        gray: "#777777",
        gray2: "#999999",
        gray3: "#CCCCCC",
        gray4: "#F4F4F4",
        gray5: "#F5F5F5",
        silver: "rgba(0, 0, 0, 0.05)",
        action: "rgb(255,94,0)",
        red: "#FF3319",
        violet: "rgb(75,61,103)",
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
