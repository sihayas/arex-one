import React, { useEffect, useRef, useState } from "react";
import { useSound } from "@/context/Sound";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";

import { animated, to, useSpring } from "@react-spring/web";
import { Command } from "cmdk";
import Nav from "@/components/nav/Nav";

import Album from "./pages/album/Album";
import Entry from "./pages/entry/Entry";
import User from "./pages/user/User";

import { debounce } from "lodash";
import { motion, useAnimate, useScroll, useTransform } from "framer-motion";

const componentMap: Record<PageName, React.ComponentType<any>> = {
  album: Album,
  entry: Entry,
  user: User,
};

type PageName = "album" | "user" | "entry";

const getDimensions = (pageName: PageName) => {
  const dimensions = {
    album: { width: 480, height: 480 },
    user: { width: 480, height: 600 },
    entry: { width: 480, height: 480 },
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
  const activePage: Page = pages[pages.length - 1];
  const activePageName: PageName = activePage.name as PageName;
  const ActiveComponent = componentMap[activePageName];

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  // Shapeshift while scrolling through a page.
  const maxScroll = 64;
  const newHeight = useTransform(scrollY, [0, maxScroll], [480, 928]);
  const newWidth = useTransform(scrollY, [0, maxScroll], [480, 620]);

  // Shapeshift on page change.
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Animate dimensions on page ~change~
    const { width, height } = getDimensions(activePageName);
    animate(scope.current, {
      width: `${width}px`,
      height: `${height}px`,
    });

    // Animate dimensions on page ~scroll~
    const shiftHeight = () => {
      animate(scope.current, {
        height: newHeight.get(),
      });
    };

    const shiftWidth = () => {
      animate(scope.current, {
        width: newWidth.get(),
      });
    };

    const unsubHeight = newHeight.on("change", shiftHeight);
    const unsubWidth = newWidth.on("change", shiftWidth);

    return () => {
      unsubHeight();
      unsubWidth();
    };
  }, [activePageName, animate, scope, newHeight, newWidth]);

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
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
          ref={scope}
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
