self.addEventListener("message", (event) => {
  const { x, y, hovered, clicked, hoveredScale } = event.data;

  let newScale = clicked ? hoveredScale * 0.8 : hoveredScale;
  const cursorSize = 40;
  const newCoords = {
    x: x - cursorSize / 2,
    y: y - cursorSize / 2,
  };

  // Send back new coordinates and scale
  self.postMessage({ newCoords, newScale });
});
