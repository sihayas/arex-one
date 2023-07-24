import { useCMDK } from "@/context/CMDKContext";
import { debounce } from "lodash";
import { useRef } from "react";

export function useScrollPosition() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { setPages, pages } = useCMDK();

  // useEffect hook to save scroll position to pages
  const saveScrollPosition = debounce(() => {
    const currentScrollPosition = scrollContainerRef.current?.scrollTop;
    setPages((prevPages) => {
      const currentPage = { ...prevPages[prevPages.length - 1] };
      currentPage.scrollPosition = currentScrollPosition;
      return [...prevPages.slice(0, -1), currentPage];
    });
  }, 100); // Delay scroll position update to prevent lag.

  // useEffect hook to restore scroll position
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
    saveScrollPosition,
    restoreScrollPosition,
    handleInfiniteScroll,
  };
}
