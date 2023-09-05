import { useSpring, SpringValue } from "@react-spring/web";
import { useScroll } from "@use-gesture/react";
import { RefObject } from "react";

type UseInterfaceScrollProps = {
  activePage: any;
  set: (props: any) => void;
};

export function useInterfaceScroll({
  activePage,
  set,
}: UseInterfaceScrollProps) {
  return useScroll(({ xy: [, y] }) => {
    const scrollBound = 846;

    if (activePage.name === "album") {
      // let newHeight = 576 + (y / 400) * (1052 - 576);
      // if (newHeight < 576) newHeight = 576;
      // if (newHeight > 1052) newHeight = 1052;
      // // Apply the new scale and width immediately to the spring animation
      // set({
      //   height: newHeight,
      // });
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
