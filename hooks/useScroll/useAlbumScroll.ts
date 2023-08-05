// hooks/pageScrollHooks/useAlbumScroll.js
import { useCallback } from "react";
import { useScrollContext } from "@/context/ScrollContext";
import { useSpring } from "@react-spring/web";
import { Page } from "@/context/CMDKContext";

type useAlbumScrollProps = {
  activePage: Page;
  set: any;
  setDebounced: any;
};

export const useAlbumScroll = ({
  activePage,
  set,
  setDebounced,
}: useAlbumScrollProps) => {
  const { cursorOnRight } = useScrollContext();

  return useCallback(
    ({ xy: [, y] }) => {
      if (!cursorOnRight && activePage.name === "album") {
        let newScale = 1 - y / 1000;
        if (newScale > 1) newScale = 1;
        if (newScale < 0.5) newScale = 0.5;

        let newWidth = 722 + (y / 300) * (1066 - 722);
        if (newWidth < 722) newWidth = 722;
        if (newWidth > 1066) newWidth = 1066;

        set({ scale: newScale, width: newWidth });
        setDebounced({ newWidth });
      }
    },
    [activePage, set, setDebounced, cursorOnRight]
  );
};
