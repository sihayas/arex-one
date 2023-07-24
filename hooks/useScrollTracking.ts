import { useEffect, useRef } from "react";
import { debounce } from "lodash";

export const useScrollPosition = (
  scrollHandler: (scrollPos: number) => void,
  delay: number
) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = debounce(() => {
    const currentScrollPosition = scrollContainerRef.current?.scrollTop || 0;
    scrollHandler(currentScrollPosition);
  }, delay); // Delay scroll position update to prevent lag.

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollContainerRef, handleScroll]);

  return scrollContainerRef;
};
