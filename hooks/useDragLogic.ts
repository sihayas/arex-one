import { useDrag } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";
import { useCMDK } from "@/context/CMDKContext";

export const useDragLogic = () => {
  const { activePage, setIsVisible, navigateBack, resetPage, inputRef } =
    useCMDK();

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
  }));

  const bind = useDrag(
    ({ down, movement: [mx, my], last }) => {
      const scaleFactor = down ? 1 - Math.abs(mx / 1400) : 1;
      let newX = down ? mx : 0;
      let newY = down ? my : 0;

      const dragThreshold = 90; // Adjust as needed

      if (last) {
        // If gesture is released
        if (Math.abs(mx) > dragThreshold) {
          // If gesture is horizontal and exceeds threshold
          newX = mx; // Maintain last mx value
          if (activePage.name === "index") {
            setIsVisible(false);
          } else {
            navigateBack();
          }
        }

        // If gesture is vertical downwards and exceeds threshold
        if (Math.abs(my) > dragThreshold) {
          newY = my; // Maintain last my value
          if (my > 0) {
            inputRef.current?.focus();
          } else {
            // If gesture is vertical upwards and exceeds threshold
            resetPage();
          }
        }

        if (Math.abs(mx) <= dragThreshold && Math.abs(my) <= dragThreshold) {
          newX = 0;
          newY = 0;
        }
      }

      api.start({
        x: newX,
        y: newY,
        scale: scaleFactor,
        immediate: down,
      });
    },
    {
      filterTaps: true,
      delay: 100,
    }
  );

  return { bind, x, y, scale }; // Make sure to return the opacity
};
