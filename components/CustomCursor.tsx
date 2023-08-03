import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { throttle } from "lodash";
import { useCMDK } from "@/context/CMDKContext";
import { useScrollContext } from "@/context/ScrollContext";

const springConfig = { tension: 500, friction: 70 };

function CustomCursor() {
  const { pages, activePage } = useCMDK();
  const componentWidth = activePage.dimensions.minWidth;

  // Cursor context
  const {
    setIsScrollingRight,
    setCursorOnRight,
    cursorOnRight,
    setScrollDelta,
    scrollDelta,
  } = useScrollContext();

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hoveredScale, setHoveredScale] = useState(1);

  // Reactive cursor size
  const { scale } = useSpring({
    scale: clicked ? hoveredScale * 0.8 : hoveredScale,
    config: springConfig,
  });
  const cursorSize = 40;

  // Track cursor position
  const moveCursor = throttle((e: MouseEvent) => {
    const cursorX = e.clientX - cursorSize / 2;
    const cursorY = e.clientY - cursorSize / 2;

    // Detect if the cursor is on the right side of the component
    if (cursorX > componentWidth / 2) {
      setCursorOnRight(true);
    } else {
      setCursorOnRight(false);
    }

    setCoords({ x: cursorX, y: cursorY });
  }, 16);

  useEffect(() => {
    console.log("is cursor on right?", cursorOnRight);
  }, [cursorOnRight]);

  const hoverCursor = (e: MouseEvent) => {
    let target: HTMLElement | null = e.target as HTMLElement;
    let hoverScale = 1;

    while (target) {
      if (target.classList.contains("hoverable-large")) {
        hoverScale = 0.85;
      } else if (target.classList.contains("hoverable-medium")) {
        hoverScale = 0.65;
      } else if (target.classList.contains("hoverable-small")) {
        hoverScale = 0.5;
      }

      if (hoverScale !== 1) {
        setHovered(true);
        setHoveredScale(hoverScale);
        return;
      }

      target = target.parentElement;
    }

    setHovered(false);
    setHoveredScale(1);
  };

  const clickCursor = () => {
    setClicked(true);
  };

  const releaseCursor = () => {
    setClicked(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", hoverCursor);
    document.addEventListener("mouseout", hoverCursor);
    document.addEventListener("mousedown", clickCursor);
    document.addEventListener("mouseup", releaseCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", hoverCursor);
      document.removeEventListener("mouseout", hoverCursor);
      document.removeEventListener("mousedown", clickCursor);
      document.removeEventListener("mouseup", releaseCursor);
    };
  }, []);

  return (
    <animated.div
      className="cursor"
      style={{
        position: "fixed",
        transform: scale.to(
          (s) =>
            `translate3d(${Math.round(coords.x)}px, ${Math.round(
              coords.y
            )}px, 0) scale(${s})`
        ),
        willChange: "transform, opacity",
      }}
    />
  );
}

export default React.memo(CustomCursor);
