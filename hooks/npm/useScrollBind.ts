// useScrollBind.js
import { useScroll } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";
import { useMemo } from "react";
import { debounce } from "lodash";

export const useScrollBind = (cursorOnRight, setPages) => {
  const [{ scale, width }, set] = useSpring(() => ({ scale: 1, width: 722 }));

  const setDebounced = useMemo(
    () =>
      debounce(({ newWidth }) => {
        setPages((prevPages) => {
          const updatedPages = [...prevPages];
          const activePageIndex = updatedPages.length - 1;
          updatedPages[activePageIndex] = {
            ...updatedPages[activePageIndex],
            dimensions: {
              minWidth: newWidth,
              height: 722,
            },
          };
          return updatedPages;
        });
      }, 150),
    [setPages]
  );

  const bind = useScroll(({ xy: [, y] }) => {
    if (!cursorOnRight) {
      let newScale = 1 - y / 1000;
      if (newScale > 1) newScale = 1;
      if (newScale < 0.5) newScale = 0.6;

      let newWidth = 722 + (y / 300) * (1066 - 722);
      if (newWidth < 722) newWidth = 722;
      if (newWidth > 1066) newWidth = 1066;

      // Apply the new scale and width immediately to the spring animation
      set({ scale: newScale, width: newWidth });

      // Defer updating the page dimensions
      setDebounced({ newScale, newWidth });
    }
  });

  return { bind, setDebounced, scale, width };
};
