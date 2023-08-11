import { useDrag } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";

export const useDragLogic = () => {
  const [activeSection, setActiveSection] = useState(0); // Keeping track of the active section
  const [{ x }, api] = useSpring(() => ({
    x: activeSection === 0 ? 0 : -532,
  }));

  const bind = useDrag(
    ({ down, movement: [mx], last }) => {
      if (last) {
        // Determine which section to switch to based on the drag direction
        if (
          (activeSection === 0 && mx < -100) ||
          (activeSection === 1 && mx > 100)
        ) {
          setActiveSection((prevSection) => (prevSection === 0 ? 1 : 0));
        }
      }
      // Handle the drag movement, considering the current section
      api.start({
        x: down
          ? activeSection === 0
            ? mx
            : mx - 532
          : activeSection === 0
          ? 0
          : -532,
        immediate: down,
      });
    },
    {
      filterTaps: true,
    }
  );

  // Update the spring x value based on the active section
  useEffect(() => {
    api.start({
      x: activeSection === 0 ? 0 : -532,
    });
  }, [activeSection, api]);

  return { bind, x };
};
