import { SpringValue } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useInterfaceContext } from "@/context/InterfaceContext";

type UseInterfaceDragProps = {
  set: (props: any) => void;
  scaleX: SpringValue<number>;
  scaleY: SpringValue<number>;
};

function adjustTranslation(
  current: number,
  target: number,
  delta: number
): number {
  return target > current
    ? Math.min(target, current + delta)
    : target < current
    ? Math.max(target, current - delta)
    : current;
}

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

let initialWidth: number;
let initialHeight: number;
let initialScaleX: number;
let initialScaleY: number;

const feedWidth = 576;
const feedHeight = 1084;

export function useInterfaceDrag({
  set,
  scaleX,
  scaleY,
}: UseInterfaceDragProps) {
  const { navigateBack, previousPage, resetPage, activePage } =
    useInterfaceContext();
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
        initialScaleX = scaleX.get();
        initialScaleY = scaleY.get();
      }

      if (previousPage && previousPage.dimensions) {
        // Target for dragging up = feed, dragging down = previous page
        let targetWidth = dirY > 0 ? previousPage.dimensions.width : feedWidth;
        let targetHeight =
          dirY > 0 ? previousPage.dimensions.height : feedHeight;

        // Calculate the target scale relative to the initial scale.
        // This ensures smooth scaling transitions when switching pages.
        const targetScaleY = (targetHeight / 576) * initialScaleY;
        const targetScaleX = (targetWidth / 576) * initialScaleX;

        // Get the translateX and translateY for going back
        let targetTranslateX = -(activePage.translate?.x || 0);
        let targetTranslateY = -(activePage.translate?.y || 0);

        // Apply a damping factor to control the effect of the velocity
        const dampingFactor = 4;

        // Use the provided velocity with the damping factor
        let speedFactor = 1 + velocityMagnitude * dampingFactor;
        speedFactor = Math.min(Math.max(speedFactor, 1), 10);

        // Ensure speedFactor stays within reasonable bounds
        const scaleDelta = Math.abs(y * speedFactor); // Adjust the divisor to control scaling speed

        // Interpolate the scale factor during the drag based on y-axis
        let newScaleY =
          initialScaleY + (targetScaleY - initialScaleY) * (scaleDelta / 800);

        // Interpolate the scale factor during the drag based on x-axis
        let newScaleX =
          initialScaleX + (targetScaleX - initialScaleX) * (scaleDelta / 800);

        let newTranslateX =
          x +
          (targetTranslateX - x) *
            Math.min(1, 0.1 / Math.abs(targetTranslateX - x));
        let newTranslateY =
          y +
          (targetTranslateY - y) *
            Math.min(1, 0.1 / Math.abs(targetTranslateY - y));

        newScaleX = Math.min(Math.max(newScaleX, 0.75), targetScaleX);
        newScaleY = Math.min(Math.max(newScaleY, 0.75), targetScaleY);

        set({
          translateX: newTranslateX,
          translateY: newTranslateY,
          scaleX: newScaleX,
          scaleY: newScaleY,
        });

        // Upon letting go
        if (last) {
          // Check if target positioning is reached
          if (newScaleX === targetScaleX && newScaleY === targetScaleY) {
            console.log("target reached");

            {
              dirY > 0 ? navigateBack() : resetPage();
            }

            set({
              translateX: 0,
              translateY: 0,
              scaleX: targetScaleX,
              scaleY: targetScaleY,
              // Load the previous page maybe for performance?
              onRest: () => {},
            });
          } else {
            // If target dimensions aren't reached, rubber-band back to initial
            newScaleX = initialScaleX;
            newScaleY = initialScaleY;
            newTranslateX = 0;
            newTranslateY = 0;
            set({
              scaleX: newScaleX,
              scaleY: newScaleY,
              translateX: 0,
              translateY: 0,
            });
          }
        }
      }
    },
    {
      axis: "y",
    }
  );
}
