// hooks/useDragLogic.ts

import { useDrag } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";

interface UseDragLogicProps {
  navigateBack: () => void;
  resetPage: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const useDragLogic = ({
  navigateBack,
  resetPage,
  inputRef,
}: UseDragLogicProps) => {
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
  }));

  const bind = useDrag(
    ({ down, movement: [mx, my], last }) => {
      const scaleFactor = down ? 1 - Math.abs(mx / 1400) : 1;
      api.start({
        x: down ? mx : 0,
        y: down ? my : 0,
        scale: scaleFactor,
        immediate: down,
      });

      const dragThreshold = 80; // Adjust as needed

      if (last) {
        // If gesture is released
        if (Math.abs(mx) > dragThreshold) {
          // If gesture is horizontal and exceeds threshold
          navigateBack();
        }

        // If gesture is vertical downwards and exceeds threshold
        if (Math.abs(my) > dragThreshold) {
          if (my > 0) {
            inputRef.current?.focus();
          } else {
            // If gesture is vertical upwards and exceeds threshold
            resetPage();
          }
        }
      }
    },
    {
      filterTaps: true,
      // bounds: { left: -120, right: 120, top: -120, bottom: 120 },
      // rubberband: true,
    }
  );

  return { bind, x, y, scale }; // Make sure to return the opacity
};
