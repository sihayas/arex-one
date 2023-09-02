import { SpringValue } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useInterface } from "@/context/Interface";

type UseInterfaceDragProps = {
  width: SpringValue<number>;
  height: SpringValue<number>;
  set: (props: any) => void;
};

let initialWidth: number;
let initialHeight: number;

function adjustDimension(
  current: number,
  target: number,
  delta: number
): number {
  return target > current
    ? Math.min(target, current + delta * 0.5)
    : target < current
    ? Math.max(target, current - delta * 0.5)
    : current;
}

export function useInterfaceDrag({
  width,
  height,
  set,
}: UseInterfaceDragProps) {
  const { navigateBack, previousPage, resetPage } = useInterface();
  return useDrag(
    ({
      down,
      first,
      last,
      movement: [x, y],
      velocity: [vx, vy],
      direction: [dirX, dirY],
    }) => {
      // Calculating the magnitude of the velocity vector
      const velocityMagnitude = Math.sqrt(vx ** 2 + vy ** 2);

      // Initialize the initial width and height when the drag starts
      if (first) {
        initialWidth = width.get();
        initialHeight = height.get();
      }

      if (previousPage && previousPage.dimensions) {
        // Get the current width and height
        let activeWidth = width.get();
        let activeHeight = height.get();

        // Get the previous page's width and height
        let prevWidth = previousPage.dimensions.width;
        let prevHeight = previousPage.dimensions.height;

        let feedWidth = 574;
        let feedHeight = 1084;

        let targetWidth = dirY > 0 ? prevWidth : feedWidth;
        let targetHeight = dirY > 0 ? prevHeight : feedHeight;

        // Apply a damping factor to control the effect of the velocity
        const dampingFactor = 4;

        // Use the provided velocity with the damping factor
        let speedFactor = 1 + velocityMagnitude * dampingFactor;

        // Ensure speedFactor stays within reasonable bounds
        speedFactor = Math.min(Math.max(speedFactor, 1), 10);

        let newWidth = adjustDimension(
          activeWidth,
          targetWidth,
          Math.abs(y * speedFactor)
        );
        let newHeight = adjustDimension(
          activeHeight,
          targetHeight,
          Math.abs(y * speedFactor)
        );

        set({ width: newWidth, height: newHeight });
        if (last) {
          // Check if target dimensions are reached
          if (newWidth === targetWidth && newHeight === targetHeight) {
            set({
              width: newWidth,
              height: newHeight + 0.00000002,
              onRest: () => {
                // Check the direction of dragging to decide the function to call
                if (dirY > 0) {
                  navigateBack();
                } else {
                  resetPage();
                }
                set({
                  opacity: 1,
                });
              },
            });
          } else {
            // If target dimensions aren't reached, rubber-band back to initial
            newWidth = initialWidth;
            newHeight = initialHeight;
            set({ width: newWidth, height: newHeight });
          }
        }
      }
    },
    {
      axis: "y",
    }
  );
}
