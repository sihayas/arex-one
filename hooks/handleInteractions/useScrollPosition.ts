import { useInterface } from "@/context/Interface";
import { debounce } from "lodash";
import { useEffect, useLayoutEffect, useRef } from "react";

export function useScrollPosition() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { pages, previousPage, activePage } = useInterface();

  // Hook to save scroll position
  useLayoutEffect(() => {
    if (scrollContainerRef.current !== null && previousPage) {
      const currentScrollPosition = scrollContainerRef.current.scrollTop;
      previousPage.scrollPosition = currentScrollPosition;
      console.log("current", currentScrollPosition);
      console.log(pages);
    }
  }, [pages.length, pages, previousPage]);

  useLayoutEffect(() => {
    if (scrollContainerRef.current !== null && activePage.scrollPosition > 0) {
      scrollContainerRef.current.scrollTop = activePage.scrollPosition;
    }
  }, [activePage.scrollPosition]);

  // hook to restore scroll position
  const restoreScrollPosition = () => {
    const scrollContainer = scrollContainerRef.current;
    const currentPage = pages[pages.length - 1];

    if (scrollContainer && currentPage.scrollPosition) {
      scrollContainer.scrollTop = currentPage.scrollPosition;
    }
  };

  const handleInfiniteScroll = (callback: () => void) => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      if (
        scrollContainer &&
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight
      ) {
        callback();
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  };

  return {
    scrollContainerRef,
    restoreScrollPosition,
    handleInfiniteScroll,
  };
}
