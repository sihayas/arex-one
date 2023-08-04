import { useWheel } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";
import { useMemo } from "react";
import { debounce } from "lodash";
import { useScrollContext } from "@/context/ScrollContext";

const Lethargy = require("lethargy").Lethargy;
const lethargy = new Lethargy(2, 200, 0.4);
let lastScrollTime = Date.now();

export const useWheelBind = (
  previousPage,
  activePage,
  navigateBack,
  setPages
) => {
  const [{ width }, set] = useSpring(() => ({ width: 722 }));
  const { cursorOnRight } = useScrollContext();

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

  const bind = useWheel(({ event, last, delta, velocity }) => {
    const [, y] = delta;

    let isUserScroll = true;

    // Last is necessary cause React does not register the last event
    if (!last && event) {
      isUserScroll = lethargy.check(event);
    }

    if (
      isUserScroll &&
      cursorOnRight &&
      previousPage &&
      previousPage.dimensions
    ) {
      const now = Date.now();
      const elapsedTime = now - lastScrollTime;
      const scrollSpeed = Math.abs(y) / elapsedTime;
      const magnitudeVelocity = Math.sqrt(
        velocity[0] * velocity[0] + velocity[1] * velocity[1]
      );

      // Log scroll speed and velocity here for debugging

      if (scrollSpeed > 1 && magnitudeVelocity > 3.41) {
        let newWidth = width.get() - -y * 3;
        if (newWidth < previousPage.dimensions.minWidth) {
          newWidth = previousPage.dimensions.minWidth;
          navigateBack();
        }
        if (newWidth > activePage.dimensions.minWidth) {
          newWidth = activePage.dimensions.minWidth;
        }
        // Apply the new width immediately to the spring animation
        set({ width: newWidth });
        console.log("newWidth", newWidth);
        // Defer updating the page dimensions
        setDebounced({ newWidth });
      }

      lastScrollTime = now;
    }
  });

  return { bind, setDebounced, width };
};
