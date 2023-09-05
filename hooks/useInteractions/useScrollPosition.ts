import { useInterface } from "@/context/Interface";
import { useLayoutEffect, useRef } from "react";

export function useScrollPosition() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { pages, previousPage, activePage } = useInterface();

  // Hook to save scroll position
  // useLayoutEffect(() => {
  //   if (scrollContainerRef.current !== null && previousPage) {
  //     const currentScrollPosition = scrollContainerRef.current.scrollTop;
  //     previousPage.scrollPosition = currentScrollPosition;
  //     console.log("current", currentScrollPosition);
  //     console.log(pages);
  //   }
  // }, [pages.length, pages, previousPage]);

  // useLayoutEffect(() => {
  //   if (scrollContainerRef.current !== null && activePage.scrollPosition > 0) {
  //     scrollContainerRef.current.scrollTop = activePage.scrollPosition;
  //   }
  // }, [activePage.scrollPosition]);

  // return {
  //   scrollContainerRef,
  // };
}
