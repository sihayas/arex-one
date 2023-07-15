// hooks/useScrollTracking.js
import { useEffect, useRef } from "react";
import { debounce } from "lodash";

const useScrollTracking = (setPages) => {
  const scrollContainerRef = useRef(null);

  const handleScroll = debounce(() => {
    const currentScrollPosition = scrollContainerRef.current?.scrollTop;

    setPages((prevPages) => {
      const currentPage = { ...prevPages[prevPages.length - 1] };
      currentPage.scrollPosition = currentScrollPosition;
      return [...prevPages.slice(0, -1), currentPage];
    });
  }, 200);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    // Cleanup on component unmount
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollContainerRef, handleScroll]);

  return scrollContainerRef;
};

export default useScrollTracking;
