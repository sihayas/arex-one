import { useDrag } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";

interface UseDragLogicProps {
  navigateLeft: () => void;
  navigateRight: () => void;
}

export const useDragLogic = ({
  navigateLeft,
  navigateRight,
}: UseDragLogicProps) => {
  const [{ x }, api] = useSpring(() => ({ x: 0, scale: 1 }));
  const [scaleSpring, scaleApi] = useSpring(() => ({ scale: 1 }));

  const bind = useDrag(
    ({ down, movement: [mx], last }) => {
      const scaleFactor = down ? 1 - Math.abs(mx / 4000) : 1;
      api.start({
        x: down ? mx : 0,
        scale: scaleFactor,
        immediate: down,
      });

      // Update the scale spring
      scaleApi.start({ scale: down ? 0.95 : 1 });

      const dragThreshold = 80; // Adjust as needed

      if (last) {
        // If gesture is released
        if (mx > dragThreshold) {
          navigateLeft();
        } else if (mx < -dragThreshold) {
          navigateRight();
        }
      }
    },
    {
      filterTaps: true,
    }
  );

  return { bind, x, scaleSpring };
};
