import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSound } from "@/context/Sound";
import { useInterface } from "@/context/Interface";
import { useThreadcrumb } from "@/context/Threadcrumbs";

import { animated, useSpring, useTransition } from "@react-spring/web";
import { Command } from "cmdk";
import Nav from "@/components/nav/Nav";

import Album from "./pages/album/Album";
import Entry from "./pages/entry/Entry";
import User from "./pages/user/User";
import Signals from "./pages/signals/Signals";
import Feed from "./pages/feed/Feed";

import { useInterfaceDrag } from "@/hooks/handleInteractions/useDrag/interface";
import { useInterfaceScroll } from "@/hooks/handleInteractions/useScroll/interface";

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
    activePage,
    setPages,
    inputValue,
    setInputValue,
    storedInputValue,
    inputRef,
    setStoredInputValue,
    setExpandInput,
    entryContainerRef,
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

  const dragBind = useInterfaceDrag({ width, height, opacity, set });

  const scrollBind = useInterfaceScroll({
    activePage,
    set,
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
    enter: { opacity: 1 },
    leave: { opacity: 0, delay: 750 },
    config: {
      duration: 750,
    },
  });

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
        {/* CMDK Inner  */}
        <Command
          className={`cmdk-inner flex transition-opacity bg-white duration-150 w-full h-full ${
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
                  key: selectedFormSound.sound.id,
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
                className="flex items-center justify-center"
                style={{
                  ...style,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              >
                {Component === Album ? (
                  <Component translateY={translateY} scale={scale} />
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
