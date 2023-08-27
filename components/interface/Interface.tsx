import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useSound } from "@/context/Sound";
import { useInterface } from "@/context/Interface";

import { animated, useSpring, useTransition } from "@react-spring/web";
import { useDrag, useScroll, useWheel } from "@use-gesture/react";
import { Command } from "cmdk";
import Nav from "@/components/nav/Nav";

import Album from "./pages/album/Album";
import Entry from "./pages/entry/Entry";
import User from "./pages/user/User";
import Signals from "./pages/signals/Signals";
import Feed from "./pages/feed/Feed";

type PageName = "feed" | "album" | "entry" | "user" | "signals";

const PAGE_DIMENSIONS: Record<PageName, { width: number; height: number }> = {
  feed: { width: 574, height: 1084 },
  album: { width: 658, height: 658 },
  entry: { width: 574, height: 164 },
  user: { width: 532, height: 712 },
  signals: { width: 96, height: 712 },
};

const componentMap: Record<string, React.ComponentType<any>> = {
  album: Album,
  entry: Entry,
  user: User,
  signals: Signals,
  feed: Feed,
};

export function Interface({ isVisible }: { isVisible: boolean }): JSX.Element {
  const {
    pages,
    navigateBack,
    activePage,
    previousPage,
    setPages,
    inputValue,
    setInputValue,
    storedInputValue,
    inputRef,
    setStoredInputValue,
    setExpandInput,
  } = useInterface();
  const { setSelectedSound, selectedFormSound, setSelectedFormSound } =
    useSound();

  // Element refs
  const ref = React.useRef<HTMLInputElement | null>(null);
  const shapeshifterContainerRef = useRef<HTMLDivElement | null>(null);

  // Page Tracker
  const ActiveComponent = componentMap[activePage.name] || Feed;

  // Shapeshift dimensions
  const [dimensionsSpring, setDimensionsSpring] = useSpring(() => ({
    width: PAGE_DIMENSIONS[previousPage!.name as PageName]?.width,
    height: PAGE_DIMENSIONS[previousPage!.name as PageName]?.height,
    config: {
      tension: 400,
      friction: 47,
      mass: 0.2,
    },
  }));

  const [{ width, scale, height, translateY, opacity }, set] = useSpring(
    () => ({
      scale: 1,
      width: activePage.dimensions.width,
      height: activePage.dimensions.height,
      translateY: 0,
      opacity: 1, // Initializing the opacity to 1 (100%)
      config: {
        tension: 400,
        friction: 47,
        mass: 0.2,
      },
    })
  );

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
  }, [activePage.name, setDimensionsSpring, activePage.dimensions, set]);

  let initialWidth: number;
  let initialHeight: number;
  let initialOpacity: number;

  function adjustDimension(
    current: number,
    target: number,
    delta: number
  ): number {
    if (target > current) return Math.min(target, current + delta * 0.5);
    if (target < current) return Math.max(target, current - delta * 0.5);
    return current;
  }

  const dragBind = useDrag(
    ({
      down,
      first,
      last,
      movement: [x, y],
      velocity: [vx, vy],
      direction: [dirX, dirY],
      swipe: [swipeX, swipeY],
    }) => {
      // Calculating the magnitude of the velocity vector
      const velocityMagnitude = Math.sqrt(vx ** 2 + vy ** 2);

      // Initialize the initial width and height when the drag starts
      if (first) {
        initialWidth = width.get();
        initialHeight = height.get();
        initialOpacity = opacity.get();
      }

      if (previousPage && previousPage.dimensions) {
        let activeWidth = width.get();
        let activeHeight = height.get();

        let prevWidth = previousPage.dimensions.width;
        let prevHeight = previousPage.dimensions.height;

        // Apply a damping factor to control the effect of the velocity
        const dampingFactor = 4;

        // Use the provided velocity with the damping factor
        let speedFactor = 1 + velocityMagnitude * dampingFactor;

        // Ensure speedFactor stays within reasonable bounds
        speedFactor = Math.min(Math.max(speedFactor, 1), 10);

        let newWidth = adjustDimension(activeWidth, prevWidth, y * speedFactor);
        let newHeight = adjustDimension(
          activeHeight,
          prevHeight,
          y * speedFactor
        );

        let newOpacity = 1 - Math.abs(y) / 20;

        set({ width: newWidth, height: newHeight, opacity: newOpacity });

        x; // Rubber-band back to initial if not met with target
        if (last) {
          // Check if target dimensions are reached
          if (newWidth === prevWidth && newHeight === prevHeight) {
            set({
              width: newWidth,
              height: newHeight,
              opacity: newOpacity + 0.001,

              onRest: () => {
                navigateBack();
                set({
                  opacity: 1,
                });
              },
            });
          } else {
            // If target dimensions arent reached, rubber-band back to initial
            newWidth = initialWidth;
            newHeight = initialHeight;
            newOpacity = initialOpacity;
            set({ width: newWidth, height: newHeight, opacity: newOpacity });
          }
        }
      }
    },
    {
      axis: "y",
    }
  );

  const scrollBind = useScroll(({ xy: [, y] }) => {
    if (activePage.name === "album") {
      let newScale = 1 - y / 50;
      if (newScale > 1) newScale = 1;
      if (newScale < 0.5) newScale = 0.5;

      let newWidth = 658 + (y / 77) * (1066 - 658);
      if (newWidth < 658) newWidth = 658;
      if (newWidth > 1066) newWidth = 1066;

      let newHeight = 658 + (y / 24) * (722 - 658);
      if (newHeight < 658) newHeight = 658;
      if (newHeight > 722) newHeight = 722;

      // Apply the new scale and width immediately to the spring animation
      set({
        scale: newScale,
        width: newWidth,
        height: newHeight,
      });
    } else if (activePage.name === "entry") {
      let baseHeight = 164;
      let newHeight = baseHeight + (y / 50) * (888 - baseHeight);
      if (newHeight < baseHeight) newHeight = baseHeight;
      if (newHeight > 888) newHeight = 888;

      set({
        width: 574,
        height: newHeight,
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
    if (activePage.name === "album" && activePage.selectedSound) {
      setSelectedSound(activePage.selectedSound);
    }
  }, [activePage, setSelectedSound, pages]);

  const transitions = useTransition(ActiveComponent, {
    from: { opacity: 0 },
    enter: { opacity: 1, delay: 750 },
    leave: { opacity: 0 },
    config: {
      duration: 150,
    },
  });

  return (
    <>
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
            isVisible ? "opacity-100 shadow-cmdkScaled2" : "opacity-0"
          }`}
          ref={ref}
          shouldFilter={false}
          onKeyDown={(e: React.KeyboardEvent) => {
            // switch to album page from form
            if (e.key === "Enter" && selectedFormSound && inputValue === "") {
              e.preventDefault();
              setExpandInput(false);
              setSelectedSound(selectedFormSound);
              setPages((prevPages) => [
                ...prevPages,
                {
                  name: "album",
                  sound: selectedFormSound,
                  dimensions: {
                    width: 658,
                    height: 658,
                  },
                  scrollPosition: 0,
                },
              ]);
              inputRef?.current?.blur();
              window.history.pushState(null, "");
            }
            // go back from form to search results
            if (
              e.key === "Backspace" &&
              selectedFormSound &&
              inputValue === ""
            ) {
              e.preventDefault();
              setSelectedFormSound(null);
              setInputValue(storedInputValue);
              setStoredInputValue("");
              inputRef?.current?.focus();
            }
          }}
          loop
        >
          <div className="absolute flex text-xs text-center z-0 text-gray2 top-1/2">
            back to {previousPage?.name}
          </div>
          <Nav />
          {/* Container / Shapeshifter */}
          <animated.div
            {...dragBind()} // Shapeshifter dragging
            {...scrollBind()} // Custom page scrolling
            style={{
              ...dimensionsSpring,
              width: width.to((w) => `${w}px`),
              height: height.to((h) => `${h}px`),
              opacity: opacity.to((o) => o),
              willChange: "width, height",
              touchAction: "pan-y",
            }}
            ref={shapeshifterContainerRef}
            className={`flex h-max rounded-[20px] z-10 hoverable-large relative overflow-y-scroll scrollbar-none `}
          >
            {/* Apply transition */}
            {transitions((style, Component) => (
              <animated.div
                style={{
                  ...style,
                  position: "absolute",
                  width: "100%",
                  backgroundColor: "white",
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

// Update the page dimensions in pages stack
// const setDebounced = useMemo(
//   () =>
//     debounce(({ newWidth, newHeight }) => {
//       setPages((prevPages) => {
//         const updatedPages = [...prevPages];
//         const activePageIndex = updatedPages.length - 1;
//         updatedPages[activePageIndex] = {
//           ...updatedPages[activePageIndex],
//           dimensions: {
//             width: newWidth,
//             height: newHeight,
//           },
//         };
//         return updatedPages;
//       });
//     }, 150),
//   [setPages]
// );

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

{
  /* Breadcrumbs  */
}
{
  /* {!isHome && (
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
      )} */
}
