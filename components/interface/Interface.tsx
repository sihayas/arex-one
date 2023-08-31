import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSound } from "@/context/Sound";
import { useInterface } from "@/context/Interface";
import { useThreadcrumb } from "@/context/Threadcrumbs";

import {
  animated,
  useSpring,
  useSprings,
  useTransition,
} from "@react-spring/web";
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

  const [{ width, scale, height, translateY, translateX, opacity }, set] =
    useSpring(() => ({
      scale: 1,
      width: activePage.dimensions.width,
      height: activePage.dimensions.height,
      translateY: 0,
      translateX: 0,
      opacity: 1,
      config: {
        tension: 400,
        friction: 47,
        mass: 0.2,
      },
    }));

  const [{ opacity: scrollOpacity, scale: scrollScale }, setScroll] = useSpring(
    () => ({
      opacity: 1,
      scale: 1,
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
    const scrollBound = 846;
    const scaleBound = 0.89;

    const maxScrollForOpacity = 400;

    if (activePage.name === "album") {
      let newScale = 1 - y / 50;
      if (newScale > 1) newScale = 1;
      if (newScale < scaleBound) newScale = scaleBound;

      let translateValue = (y / 400) * scrollBound;
      if (translateValue > scrollBound) translateValue = scrollBound;

      let newOpacity = y / maxScrollForOpacity;
      if (newOpacity < 0) newOpacity = 0;
      if (newOpacity > 1) newOpacity = 1;

      let newWidth = 658 + (y / 24) * (574 - 658);
      if (newWidth < 574) newWidth = 574;
      if (newWidth > 658) newWidth = 658;

      let newHeight = 658 + (y / 24) * (1052 - 658);
      if (newHeight < 658) newHeight = 658;
      if (newHeight > 1052) newHeight = 1052;

      // Apply the new scale and width immediately to the spring animation
      set({
        width: newWidth,
        height: newHeight,
        translateY: translateValue,
      });
      // Apply the unique scroll opacity
      setScroll({
        opacity: newOpacity,
        scale: newScale,
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

  const [activeIndex, setActiveIndex] = useState(0); // Initialize to the index of the first page

  const [ghostSprings, setGhostSprings] = useSprings(pages.length, (index) => ({
    width: pages[index].dimensions.width,
    height: pages[index].dimensions.height,
    translateX: index * 48,
    opacity: 0,
    config: { tension: 200, friction: 80 },
  }));

  useEffect(() => {
    const newIndex = pages.findIndex((page) => page.key === activePage.key);
    setActiveIndex(newIndex);
  }, [activePage.key, pages]);

  useEffect(() => {
    setGhostSprings((index) => {
      const isCurrentPage = pages[index].key === activePage.key;
      const translateAmount =
        index < activeIndex ? (activeIndex - index) * 80 : 0;
      return {
        width: isCurrentPage ? pages[index].dimensions.width : 572,
        height: isCurrentPage ? pages[index].dimensions.height : 572,
        translateX: translateAmount,
        opacity: isCurrentPage ? 0 : 1,
      };
    });
  }, [pages, setGhostSprings, activePage.key, activeIndex]);

  return (
    <>
      <animated.div
        style={{
          ...visibilitySpring,
        }}
        className={`cmdk border border-silver ${
          isVisible ? "pointer-events-auto" : "!shadow-none pointer-events-none"
        }`}
      >
        {/* Ghost Container for Breadcrumbs */}
        {ghostSprings.map((props, index) => (
          <animated.div
            className="absolute border border-silver bg-silver rounded-3xl"
            key={index}
            style={{
              width: props.width,
              height: props.height,
              transform: props.translateX.to((t) => `translateX(${t}px)`),
              opacity: props.opacity,
            }}
          >
            {/* ghost container content */}
          </animated.div>
        ))}

        {/* CMDK Inner  */}
        <Command
          className={`cmdk-inner flex transition-opacity bg-white duration-150 w-full h-full ${
            isVisible ? "opacity-100 shadow-artworkFeed" : "opacity-0"
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
            className={`flex rounded-[24px] z-10 hoverable-large relative overflow-y-scroll scrollbar-none bg-white`}
          >
            {/* Apply transition */}
            {transitions((style, Component) => (
              <animated.div
                style={{
                  ...style,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              >
                {Component === Album ? (
                  <Component
                    translateY={translateY}
                    scale={scrollScale}
                    opacity={scrollOpacity}
                  />
                ) : Component === Entry ? (
                  <Component translateY={translateY} />
                ) : (
                  <Component />
                )}
              </animated.div>
            ))}
          </animated.div>
          <Nav />
        </Command>
      </animated.div>
    </>
  );
}
