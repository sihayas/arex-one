import { useEffect, useRef } from "react";

export const useCustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (cursorRef.current) {
      const cursorRoot = cursorRef.current;
      const hoverTransformDiv = cursorRoot.querySelector("div > div");
      const clickTransformDiv = hoverTransformDiv.querySelector("div > div");

      const handleMouseMove = (e) => {
        cursorRoot.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
      };

      const handleMouseOver = () => {
        hoverTransformDiv.style.transform = "scale(0.5)";
      };

      const handleMouseOut = () => {
        hoverTransformDiv.style.transform = "scale(1)";
      };

      const handleMouseDown = () => {
        clickTransformDiv.style.transform = "scale(0.9)";
      };

      const handleMouseUp = () => {
        clickTransformDiv.style.transform = "scale(1)";
      };

      document.addEventListener("mousemove", handleMouseMove);

      const clickableElements = document.querySelectorAll(".clickable");
      clickableElements.forEach((elem) => {
        elem.addEventListener("mouseover", handleMouseOver);
        elem.addEventListener("mouseout", handleMouseOut);
        elem.addEventListener("mousedown", handleMouseDown);
        elem.addEventListener("mouseup", handleMouseUp);
      });

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        clickableElements.forEach((elem) => {
          elem.removeEventListener("mouseover", handleMouseOver);
          elem.removeEventListener("mouseout", handleMouseOut);
          elem.removeEventListener("mousedown", handleMouseDown);
          elem.removeEventListener("mouseup", handleMouseUp);
        });
      };
    }
  }, [cursorRef]);

  return cursorRef;
};
