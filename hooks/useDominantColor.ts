import ColorThief from "colorthief";

export const useDominantColor = () => {
  const getDominantColor = (imgElement: HTMLImageElement) => {
    const colorThief = new ColorThief();
    const colors = colorThief.getPalette(imgElement);
    const topColors = colors.slice(0, 3);
    return topColors.map((color) => `rgba(${color.join(",")}`);
  };
  return { getDominantColor };
};
