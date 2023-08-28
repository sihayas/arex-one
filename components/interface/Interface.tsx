import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useSound } from "@/context/Sound";
import { useInterface } from "@/context/Interface";
import { useThreadcrumb } from "@/context/Threadcrumbs";

import { animated, useSpring, useTransition } from "@react-spring/web";
import { useDrag, useScroll } from "@use-gesture/react";
import { Command } from "cmdk";
import Nav from "@/components/nav/Nav";

import Album from "./pages/album/Album";
import Entry from "./pages/entry/Entry";
import User from "./pages/user/User";
import Signals from "./pages/signals/Signals";
import Feed from "./pages/feed/Feed";

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
    entryContainerRef,
    resetPage,
  } = useInterface();
  const { setSelectedSound, selectedFormSound, setSelectedFormSound } =
    useSound();
  const { openThreads } = useThreadcrumb();

  // Page Tracker
  const ActiveComponent = componentMap[activePage.name] || Feed;

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
    requestAnimationFrame(() => {
      if (activePage.name === "entry" && entryContainerRef.current) {
        set({
          height: entryContainerRef.current.offsetHeight,
          width: entryContainerRef.current.offsetWidth,
        });
        activePage.dimensions.height = entryContainerRef.current.offsetHeight;
      } else {
        const targetPageDimensions = activePage.dimensions;
        set({
          height: targetPageDimensions.height,
          width: targetPageDimensions.width,
        });
      }
    });
  }, [activePage.name, entryContainerRef.current, activePage.dimensions, set]);

  let initialWidth: number;
  let initialHeight: number;
  let initialOpacity: number;

  function adjustDimension(
    current: number,
    target: number,
    delta: number
  ): number {
    return target > current
      ? Math.min(target, current + delta * 0.5)
      : target < current
      ? Math.max(target, current - delta * 0.5)
      : current;
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
        // Get the current width and height
        let activeWidth = width.get();
        let activeHeight = height.get();

        // Get the previous page's width and height
        let prevWidth = previousPage.dimensions.width;
        let prevHeight = previousPage.dimensions.height;

        let feedWidth = 574;
        let feedHeight = 1084;

        let targetWidth = dirY > 0 ? prevWidth : feedWidth;
        let targetHeight = dirY > 0 ? prevHeight : feedHeight;

        // Apply a damping factor to control the effect of the velocity
        const dampingFactor = 4;

        // Use the provided velocity with the damping factor
        let speedFactor = 1 + velocityMagnitude * dampingFactor;

        // Ensure speedFactor stays within reasonable bounds
        speedFactor = Math.min(Math.max(speedFactor, 1), 10);

        let newWidth = adjustDimension(
          activeWidth,
          targetWidth,
          Math.abs(y * speedFactor)
        );
        let newHeight = adjustDimension(
          activeHeight,
          targetHeight,
          Math.abs(y * speedFactor)
        );

        let newOpacity = 1 - Math.abs(y) / 20;

        set({ width: newWidth, height: newHeight, opacity: newOpacity });
        if (last) {
          // Check if target dimensions are reached
          if (newWidth === targetWidth && newHeight === targetHeight) {
            set({
              width: newWidth,
              height: newHeight,
              opacity: newOpacity + 0.001,

              onRest: () => {
                // Check the direction of dragging to decide the function to call
                if (dirY > 0) {
                  navigateBack();
                } else {
                  resetPage();
                }
                set({
                  opacity: 1,
                });
              },
            });
          } else {
            // If target dimensions aren't reached, rubber-band back to initial
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

  useEffect(() => {
    if (activePage.name === "entry") {
      {
        openThreads
          ? set({
              height: 724,
            })
          : set({
              height: activePage.dimensions.height,
            });
      }
    }
  }, [openThreads, activePage.name, set, activePage.dimensions.height]);

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
          ...visibilitySpring,
        }}
        className={`cmdk  ${
          isVisible ? "pointer-events-auto" : "!shadow-none pointer-events-none"
        }`}
      >
        {/* CMDK Inner  */}
        <Command
          className={`flex transition-opacity bg-white duration-150 w-full h-full border border-silver ${
            isVisible ? "opacity-100 shadow-cmdkScaled2" : "opacity-0"
          }`}
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
          <Nav />
          {/* Container / Shapeshifter */}
          <animated.div
            {...dragBind()} // Shapeshifter dragging
            {...scrollBind()} // Custom page scrolling
            style={{
              width: width.to((w) => `${w}px`),
              height: height.to((h) => `${h}px`),
              opacity: opacity.to((o) => o),
              willChange: "width, height",
              touchAction: "pan-y",
            }}
            className={`flex rounded-[20px] z-10 hoverable-large relative overflow-y-scrolli scrollbar-none`}
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
