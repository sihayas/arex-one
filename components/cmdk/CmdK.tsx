import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useCMDK } from "@/context/CMDKContext";

import { animated, useSpring, useTransition } from "@react-spring/web";
import { useDrag, useScroll, useWheel } from "@use-gesture/react";

import { Command } from "cmdk";
import Album from "./pages/album/Album";
import Form from "./pages/form/Form";
import Search from "./pages/search/Search";
import Entry from "./pages/entry/Entry";
import Index from "./pages/index/Index";
import User from "./pages/user/User";
import Signals from "./pages/signals/Signals";
// const Lethargy = require("lethargy").Lethargy;
import { Lethargy } from "lethargy-ts";

import SearchAlbums from "@/lib/api/searchAPI";
import { debounce } from "lodash";

type PageName = "index" | "album" | "entry" | "form" | "user" | "signals";

const PAGE_DIMENSIONS: Record<PageName, { width: number; height: number }> = {
  index: { width: 922, height: 600 },
  album: { width: 658, height: 658 },
  entry: { width: 516, height: 608 },
  form: { width: 960, height: 480 },
  user: { width: 532, height: 712 },
  signals: { width: 96, height: 712 },
};

const MemoizedSearch = React.memo(Search);

const componentMap: Record<string, React.ComponentType<any>> = {
  index: Index,
  album: Album,
  entry: Entry,
  form: Form,
  user: User,
  signals: Signals,
};

export function CMDK({ isVisible }: { isVisible: boolean }): JSX.Element {
  //Context stuff
  const {
    pages,
    hideSearch,
    setHideSearch,
    activePage,
    navigateBack,
    inputRef,
    previousPage,
    resetPage,
    setPages,
    prevPageCount,
    setPrevPageCount,
  } = useCMDK();
  const { setSelectedAlbum } = useCMDKAlbum();

  //Element refs
  const ref = React.useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const shapeshifterContainerRef = useRef<HTMLDivElement | null>(null);

  //Page Tracker
  const isHome = activePage.name === "index";
  const ActiveComponent = componentMap[activePage.name] || Index;

  // Search albums
  const { data, isLoading, isFetching, error } = SearchAlbums(inputValue);

  // Shapeshift dimensionss
  const [dimensionsSpring, setDimensionsSpring] = useSpring(() => ({
    width: PAGE_DIMENSIONS[previousPage!.name as PageName]?.width,
    height: PAGE_DIMENSIONS[previousPage!.name as PageName]?.height,
    config: {
      tension: 400,
      friction: 77,
    },
  }));
  useEffect(() => {
    setDimensionsSpring({
      to: async (next, cancel) => {
        // If the page has custom dimensions, use them
        const targetPageDimensions = activePage.dimensions;
        await next({
          width: targetPageDimensions?.width,
          height: targetPageDimensions?.height,
        });
      },
    });
    set({
      width: activePage.dimensions.width,
      height: activePage.dimensions.height,
    });
  }, [activePage.name, setDimensionsSpring]);

  // Update the page dimensions in pages stack
  const setDebounced = useMemo(
    () =>
      debounce(({ newWidth, newHeight }) => {
        setPages((prevPages) => {
          const updatedPages = [...prevPages];
          const activePageIndex = updatedPages.length - 1;
          updatedPages[activePageIndex] = {
            ...updatedPages[activePageIndex],
            dimensions: {
              width: newWidth,
              height: newHeight,
            },
          };
          return updatedPages;
        });
      }, 150),
    [setPages]
  );

  // Inertia tracking with lethargy to trigger shape shift/navigation
  const [{ width, scale, height, translateY, opacity }, set] = useSpring(
    () => ({
      scale: 1,
      width: activePage.dimensions.width,
      height: activePage.dimensions.height,
      translateY: 0,
      opacity: 1, // Initializing the opacity to 1 (100%)
      config: {
        tension: 400,
        friction: 57,
        mass: 0.2,
      },
    })
  );

  let initialWidth: number;
  let initialHeight: number;
  let initialOpacity: number;

  function adjustDimension(
    current: number,
    target: number,
    delta: number
  ): number {
    if (target > current) return Math.min(target, current + delta * 2);
    if (target < current) return Math.max(target, current - delta * 2);
    return current;
  }

  const dragBind = useDrag(
    ({ down, first, last, movement: [x, y], direction: [dirX, dirY] }) => {
      // Initialize the initial width and height when the drag starts
      if (first) {
        initialWidth = width.get();
        initialHeight = height.get();
        initialOpacity = opacity.get();
      }

      if (previousPage && previousPage.dimensions) {
        let activeWidth = activePage.dimensions.width;
        let activeHeight = activePage.dimensions.height;

        let prevWidth = previousPage.dimensions.width;
        let prevHeight = previousPage.dimensions.height;

        let newWidth = adjustDimension(activeWidth, prevWidth, y);
        let newHeight = adjustDimension(activeHeight, prevHeight, y);
        let newOpacity = 1 - Math.abs(y) / 20; // Adjust this calculation to match your drag length

        set({ width: newWidth, height: newHeight, opacity: newOpacity });

        // Rubberband back to initial if not met with target
        if (last) {
          const isWidthCloseToTarget = Math.abs(newWidth - prevWidth) < 48;
          const isHeightCloseToTarget = Math.abs(newHeight - prevHeight) < 48;

          // If not close enough to the target dimensions, revert to initial dimensions
          if (!isWidthCloseToTarget || !isHeightCloseToTarget) {
            newWidth = initialWidth;
            newHeight = initialHeight;
            newOpacity = initialOpacity; // Resetting the opacity
          }

          set({ width: newWidth, height: newHeight, opacity: newOpacity });
          setDebounced({ newWidth, newHeight });
        }
        if (newWidth === prevWidth && newHeight === prevHeight) {
          set({ width: newWidth, height: newHeight, opacity: 1 });
          navigateBack();
        }
      }
    }
  );

  const scrollBind = useScroll(({ xy: [, y] }) => {
    if (activePage.name === "album") {
      let newScale = 1 - y / 77;
      if (newScale > 1) newScale = 1;
      if (newScale < 0.738) newScale = 0.738;

      let newWidth = 658 + (y / 77) * (1066 - 658);
      if (newWidth < 658) newWidth = 658;
      if (newWidth > 1066) newWidth = 1066;

      let newHeight = 658 + (y / 300) * (888 - 658);
      if (newHeight < 658) newHeight = 658;
      if (newHeight > 888) newHeight = 888;

      // Apply the new scale and width immediately to the spring animation
      set({
        scale: newScale,
        width: newWidth,
        height: newHeight,
      });

      // Defer updating the page dimensions
      setDebounced({ newWidth, newHeight });
    } else if (activePage.name === "entry") {
      let baseHeight = 610;
      let newHeight = baseHeight + (y / 50) * (888 - baseHeight);
      if (newHeight < baseHeight) newHeight = baseHeight;
      if (newHeight > 888) newHeight = 888;

      let translateY = -y / 20;
      if (translateY < -4) translateY = -4;

      set({
        width: 516,
        height: newHeight,
        translateY: translateY,
      });

      // Defer updating the page dimensions
      setDebounced({ newWidth: 580, newHeight: newHeight });
    } else if (activePage.name === "user") {
      let baseHeight = 712;
      let newHeight = baseHeight + (y / 120) * (994 - baseHeight);
      if (newHeight < baseHeight) newHeight = baseHeight;
      if (newHeight > 994) newHeight = 994;

      set({
        height: newHeight,
        width: 532,
      });

      // Defer updating the page dimensions
      setDebounced({ newWidth: 532, newHeight: newHeight });
    }
  });

  // Spring CMDK visibility
  const visibilitySpring = useSpring({
    transform: isVisible
      ? `translate(-50%, -50%) scale(1)`
      : `translate(-50%, -50%) scale(0.95)`,
    config: {
      tension: 400,
      friction: 70,
    },
  });

  // Adjust album context when navigating to an album page
  useEffect(() => {
    if (activePage.name === "album" && activePage.album) {
      setSelectedAlbum(activePage.album);
    }
    console.log(pages);
  }, [activePage, setSelectedAlbum, pages]);

  // Handle input changes
  const onValueChange = useCallback(
    (value: string) => {
      if (hideSearch) {
        setHideSearch(false);
      }
      setInputValue(value);
    },
    [hideSearch, setInputValue, setHideSearch]
  );
  const onFocus = useCallback(() => {
    setHideSearch(false);
  }, [setHideSearch]);
  const onBlur = useCallback(() => {
    setHideSearch(true);
  }, [setHideSearch]);

  const transitions = useTransition(ActiveComponent, {
    from: { opacity: 0, blur: 5 },
    enter: { opacity: 1, blur: 0, delay: 150 },
    leave: { opacity: 0, blur: 6 },
    config: {
      duration: 150,
    },
  });

  // Unmount cleanup
  useEffect(() => {
    return () => {
      setDebounced.cancel();
    };
  }, [setDebounced]);

  useEffect(() => {
    if (pages.length > prevPageCount) {
      if (shapeshifterContainerRef.current !== null) {
        shapeshifterContainerRef.current.scrollTop = 0;
      }
    }

    setPrevPageCount(pages.length);
  }, [pages.length, prevPageCount, shapeshifterContainerRef, setPrevPageCount]);

  return (
    <>
      {/* Breadcrumbs  */}
      {/* {!isHome && (
        <div className="flex flex-col gap-2 items-center absolute top-1/2">
          <button className="text-xs text-grey" onClick={resetPage}>
            reset
          </button>
          {pages.map((page, index) => (
            <button
              key={index}
              className="text-xs text-grey"
              onClick={() => navigateBack(pages.length - index - 1)}
            >
              <div>{page.name}</div>
            </button>
          ))}
        </div>
      )} */}

      <animated.div
        style={{
          ...visibilitySpring, // To appear
        }}
        className={`cmdk  ${
          isVisible ? "pointer-events-auto" : "!shadow-none pointer-events-none"
        }`}
      >
        {/* CMDK Inner Content  */}
        <Command
          className={`transition-opacity bg-white duration-150 w-full h-full ${
            isVisible ? "opacity-100 drop-shadow-2xl" : "opacity-0"
          }`}
          ref={ref}
          shouldFilter={false}
          onKeyDown={(e: React.KeyboardEvent) => {
            // console.log(`Keydown event: ${e.key}`);
            if (e.key === "Backspace" && !isHome && !inputValue) {
              navigateBack();
              e.preventDefault();
              return;
            }
          }}
        >
          {/* Container / Shapeshifter */}
          <animated.div
            {...dragBind()} // Shapeshifter dragging
            {...scrollBind()} // Custom page scrolling
            style={{
              ...dimensionsSpring, // Finalize shapeshifter dimensions
              width: width.to((w) => `${w}px`),
              height: height.to((h) => `${h}px`),
              opacity: opacity.to((o) => o),
              willChange: "width, height",
            }}
            ref={shapeshifterContainerRef}
            className={`flex rounded-[20px] z-0 hoverable-large relative overflow-y-scroll scrollbar-none ${
              isVisible ? `` : ""
            } `}
          >
            {/* Apply transition */}
            {transitions((style, Component) => (
              <animated.div
                style={{
                  ...style,
                  position: "absolute",
                  width: "100%",
                }}
              >
                {Component === Album ? (
                  <Component scale={scale} />
                ) : Component === Entry ? (
                  <Component translateY={translateY} />
                ) : (
                  <Component />
                )}
              </animated.div>
            ))}
          </animated.div>
        </Command>
      </animated.div>
    </>
  );
}

// const wheelBind = useWheel(({ event, last, delta, velocity }) => {
//   const [, y] = delta;

//   if (y > 0) {
//     return;
//   }

//   let isUserScroll = true;

//   if (!last && event && event.nativeEvent instanceof WheelEvent) {
//     const wheelEvent = event.nativeEvent;
//     const s = lethargy.check(wheelEvent);
//     console.log("Lethargy check result", s);

//     if (s === false) {
//       isUserScroll = false;
//     }
//   }

//   if (
//     isUserScroll &&
//     cursorOnRight &&
//     previousPage &&
//     previousPage.dimensions
//   ) {
//     if (isUserScroll) {
//       let activeWidth = activePage.dimensions.width;
//       let activeHeight = activePage.dimensions.height;
//       let prevWidth = previousPage.dimensions.width;
//       let prevHeight = previousPage.dimensions.height;

//       const targetWidth = prevWidth;
//       const targetHeight = prevHeight;

//       const widthRatio =
//         (targetWidth - activeWidth) / (targetHeight - activeHeight);
//       const heightRatio = 1;

//       const widthStep = -y * widthRatio;
//       const heightStep = -y * heightRatio;

//       let newWidth = width.get() + widthStep;
//       let newHeight = height.get() + heightStep;

//       // Clamp to bounds
//       if (
//         (widthStep > 0 && newWidth > targetWidth) ||
//         (widthStep < 0 && newWidth < targetWidth)
//       ) {
//         newWidth = targetWidth;
//       }
//       if (
//         (heightStep > 0 && newHeight > targetHeight) ||
//         (heightStep < 0 && newHeight < targetHeight)
//       ) {
//         newHeight = targetHeight;
//       }

//       // Check if target dimensions are reached
//       if (newWidth === targetWidth && newHeight === targetHeight) {
//         navigateBack();
//       }

//       set({ width: newWidth, height: newHeight });
//       // console.log("newWidth", newWidth, "newHeight", newHeight);
//       // Defer updating the page dimensions
//       setDebounced({ newWidth, newHeight });
//     }
//   }
// });

// const wheelBind = useWheel(
//   (state) => {
//     const { event, last } = state;

//     // console.log("Wheel event triggered");
//     // console.log("State:", state);
//     // console.log("Last:", last);

//     if (!last && event && event.nativeEvent instanceof WheelEvent) {
//       const wheelEvent = event.nativeEvent;
//       // console.log("Wheel event object present", wheelEvent);

//       const s = lethargy.check(wheelEvent);
//       console.log("Lethargy check result", s);

//       // Your logic here
//     } else {
//       // console.log("Last event in sequence or event object not found");
//       return false;
//     }
//   },
//   { passive: true }
// );
