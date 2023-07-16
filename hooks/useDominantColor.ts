import ColorThief from "colorthief";

export const useDominantColor = () => {
  const getDominantColor = (imgElement: HTMLImageElement) => {
    const color = new ColorThief().getColor(imgElement);
    return `rgba(${color.join(",")}`;
  };
  return { getDominantColor };
};
