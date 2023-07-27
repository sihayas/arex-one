import { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

function CustomCursor() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const cursorSpring = useSpring({
    x: coords.x,
    y: coords.y,
    scale: hovered ? 0.5 : clicked ? 0.9 : 1,
    config: { mass: 1, tension: 1000, friction: 100, precision: 0.00001 },
  });

  const moveCursor = (e: MouseEvent) => {
    setCoords({ x: e.clientX, y: e.clientY });
  };

  const hoverCursor = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("hoverable")) {
      setHovered(true);
    } else {
      setHovered(false);
    }
  };

  const clickCursor = (e: MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("hoverable")) {
      setClicked(true);
      setTimeout(() => setClicked(false), 150);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", hoverCursor);
    document.addEventListener("mousedown", clickCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", hoverCursor);
      document.removeEventListener("mousedown", clickCursor);
    };
  }, []);

  return (
    <animated.div
      className="cursor"
      style={{
        position: "fixed",
        transform: cursorSpring.x.to(
          (x) =>
            `translate3d(${Math.round(x)}px, ${Math.round(
              cursorSpring.y.get()
            )}px, 0) scale(${cursorSpring.scale.get()})`
        ),

        willChange: "transform, opacity",
      }}
    />
  );
}

export default CustomCursor;
