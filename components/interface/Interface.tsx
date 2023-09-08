import React, { useEffect, useRef, useState } from "react";
import { useSound } from "@/context/Sound";
import { useInterfaceContext } from "@/context/InterfaceContext";

import { animated, to, useSpring } from "@react-spring/web";
import { Command } from "cmdk";
import Nav from "@/components/nav/Nav";

import Album from "./pages/album/Album";
import Entry from "./pages/entry/Entry";
import User from "./pages/user/User";

import { useInterfaceDrag } from "@/hooks/useDrag/interface";
import { debounce } from "lodash";
import {
  motion,
  useAnimation,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";

const componentMap: Record<string, React.ComponentType<any>> = {
  album: Album,
  entry: Entry,
  user: User,
};

type PageName = "album" | "user";

const getDimensions = (pageName: PageName) => {
  const dimensions = {
    album: { width: 480, height: 480 },
    user: { width: 480, height: 600 },
  };

  return dimensions[pageName] || { width: 480, height: 480 };
};

export function Interface({ isVisible }: { isVisible: boolean }): JSX.Element {
  const {
    pages,
    setPages,
    inputValue,
    setInputValue,
    storedInputValue,
    inputRef,
    setStoredInputValue,
    setExpandInput,
  } = useInterfaceContext();

  const { setSelectedSound, selectedFormSound, setSelectedFormSound } =
    useSound();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Spring CMDK visibility
  const visibilitySpring = useSpring({
    transform: isVisible
      ? `translate(-50%, -50%) scale(1)`
      : `translate(-50%, -50%) scale(0.98)`,
    opacity: isVisible ? 1 : 0,
    config: {
      tension: 200,
      friction: 40,
    },
  });

  // Page Tracker
  const activePage = pages[pages.length - 1];
  const ActiveComponent = componentMap[activePage.name] || User;

  const controls = useAnimation();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  // Shapeshift while scrolling through a page.
  const maxScroll = 124;
  const newHeight = useTransform(scrollY, [0, maxScroll], [480, 928]);

  // Shapeshift when going to a page
  useEffect(() => {
    const { width, height } = getDimensions(activePage.name);

    controls.start({
      width: `${width}px`,
      height: `${height}px`,
    });
  }, [activePage, controls]);

  console.log(newHeight.get());

  return (
    <animated.div
      className={`cmdk`}
      style={{
        ...visibilitySpring,
      }}
    >
      {/* CMDK Inner  */}
      <Command
        className={`cmdk-inner flex relative`}
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
          if (e.key === "Backspace" && selectedFormSound && inputValue === "") {
            e.preventDefault();
            setSelectedFormSound(null);
            setInputValue(storedInputValue);
            setStoredInputValue("");
            inputRef?.current?.focus();
          }
        }}
        loop
      >
        {/* Shapeshifter / Window, lays atop the rendered content */}
        <motion.div
          // style={{
          //   height: newHeight,
          // }}
          animate={controls}
          className={`flex items-center justify-center rounded-3xl bg-transparent overflow-hidden z-0 border border-silver2 shadow-2xl relative`}
        >
          {/* Base layout / dimensions for a page */}
          <div
            className={`flex absolute w-full h-full`}
            style={{
              width: `${activePage.dimensions.width}px`,
              height: `${activePage.dimensions.height}px`,
            }}
          >
            {/* Container for items within a page. */}
            <div
              ref={scrollContainerRef}
              className="flex flex-col items-center justify-center overflow-scroll w-full relative p-8"
            >
              <ActiveComponent />
            </div>
          </div>
        </motion.div>

        <Nav />
      </Command>
    </animated.div>
  );
}
