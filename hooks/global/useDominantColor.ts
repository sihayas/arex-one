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

export function blendWithBackground(
  rgbArray: [number, number, number],
  opacity: number,
  backgroundRgb: [number, number, number] = [255, 255, 255],
): [number, number, number] {
  return rgbArray.map((colorValue, index) =>
    Math.round(colorValue * opacity + backgroundRgb[index] * (1 - opacity)),
  ) as [number, number, number];
}

// colorUtils.ts
export function rgbToHsv(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let v = max;

  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, v];
}

// colorUtils.ts
export function hsvToRgb(
  h: number,
  s: number,
  v: number,
): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function increaseSaturation(
  rgb: [number, number, number],
  increaseAmount: number,
): [number, number, number] {
  const [r, g, b] = rgb;
  const [h, s, v] = rgbToHsv(r, g, b);
  const newS = Math.min(1, s + increaseAmount); // Ensure saturation doesn't exceed 1
  return hsvToRgb(h, newS, v);
}
