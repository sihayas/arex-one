import { useSpring, SpringValue } from "@react-spring/web";
import { useScroll } from "@use-gesture/react";
import { RefObject } from "react";

type UseInterfaceScrollProps = {
  activePage: any; // Replace `any` with the actual type
  set: (props: any) => void;
};

export function useInterfaceScroll({
  activePage,
  set,
}: UseInterfaceScrollProps) {
  // scrollBind implementation (copied from your original code)
  // ...
  return useScroll(({ xy: [, y] }) => {
    const scrollBound = 846;
    const scaleBound = 0.89;

    const maxScrollForOpacity = 400;

    if (activePage.name === "album") {
      let newScale = 1 - y / 50;
      if (newScale > 1) newScale = 1;
      if (newScale < scaleBound) newScale = scaleBound;

      let translateValue = (y / 400) * scrollBound;
      if (translateValue > scrollBound) translateValue = scrollBound;

      let newOpacity = y / maxScrollForOpacity;
      if (newOpacity < 0) newOpacity = 0;
      if (newOpacity > 1) newOpacity = 1;

      let newHeight = 576 + (y / 400) * (1052 - 576);
      if (newHeight < 576) newHeight = 576;
      if (newHeight > 1052) newHeight = 1052;

      // Apply the new scale and width immediately to the spring animation
      set({
        height: newHeight,
        translateY: translateValue,
        scale: newScale,
      });
    } else if (activePage.name === "user") {
      let baseHeight = 712;
      let newHeight = baseHeight + (y / 120) * (994 - baseHeight);
      if (newHeight < baseHeight) newHeight = baseHeight;
      if (newHeight > 994) newHeight = 994;

      set({
        height: newHeight,
        width: 532,
      });
    }
  });
}
