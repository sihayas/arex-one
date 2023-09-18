import React, { useEffect, useRef } from "react";
import { useSound } from "@/context/Sound";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";

import { Command } from "cmdk";
import Nav from "@/components/nav/Nav";

import Album from "@/components/interface/album/Album";
import Entry from "@/components/interface/entry/Entry";
import User from "@/components/interface/user/User";

import { motion, useAnimate, useScroll, useTransform } from "framer-motion";

const componentMap: Record<PageName, React.ComponentType<any>> = {
  album: Album,
  entry: Entry,
  user: User,
};

type PageName = "album" | "user" | "entry";

const getDimensions = (pageName: PageName) => {
  const dimensions = {
    album: {
      base: { width: 544, height: 544 },
      target: { width: 480, height: 1056 }, // Placeholder values
    },
    user: {
      base: { width: 640, height: 384 },
      target: { width: 640, height: 384 }, // Placeholder values
    },
    entry: {
      base: { width: 480, height: 480 },
      target: { width: 500, height: 500 }, // Placeholder values
    },
  };

  return dimensions[pageName];
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
    scrollContainerRef,
  } = useInterfaceContext();

  const { setSelectedSound, selectedFormSound, setSelectedFormSound } =
    useSound();

  // Page Tracker
  const activePage: Page = pages[pages.length - 1];
  const activePageName: PageName = activePage.name as PageName;
  const ActiveComponent = componentMap[activePageName];

  // Dimensions
  const { base, target } = getDimensions(activePageName);

  // Scroll tracker
  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });
  const maxScroll = 64;

  // Shapeshift album art while scrolling through album page.
  const scale = useTransform(scrollY, [0, 64], [1, 0.9375]);

  // Shift width and height of shape-shifter/window while scrolling
  // towards four score and seven years ago our fathers brought forth on
  // this target okay okay okay
  // target.
  const newWidth = useTransform(
    scrollY,
    [0, maxScroll],
    [base.width, target.width],
  );

  const newHeight = useTransform(
    scrollY,
    [0, maxScroll],
    [base.height, target.height],
  );

  // Shapeshift on page change.
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Initial window dimension shift towards target page
    animate(scope.current, {
      width: `${base.width}px`,
      height: `${base.height}px`,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 50,
      },
    });

    // Animate dimensions on page ~scroll~, listens for changes via unsub
    // method below
    const shiftWidth = () => {
      animate(scope.current, {
        width: newWidth.get(),
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 50,
        },
      });
    };

    // Animate dimensions on page ~scroll~, listens for changes via unsub method below
    const shiftHeight = () => {
      animate(scope.current, {
        height: newHeight.get(),
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 10,
        },
      });
    };

    const unsubWidth = newWidth.on("change", shiftWidth);
    const unsubHeight = newHeight.on("change", shiftHeight);

    return () => {
      unsubHeight();
      unsubWidth();
    };
  }, [animate, base.height, base.width, newHeight, newWidth, scope]);

  return (
    <motion.div
      className={`cmdk`}
      initial={{
        transform: `translate(-50%, -50%) scale(0.98)`,
        opacity: 0,
      }}
      animate={
        isVisible
          ? {
              transform: `translate(-50%, -50%) scale(1)`,
              opacity: 1,
            }
          : {
              transform: `translate(-50%, -50%) scale(0.98)`,
              opacity: 0,
            }
      }
    >
      {/* CMD-K Inner  */}
      <Command
        className={`cmdk-inner flex`}
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
        {/* Shape-shift / Window, lies atop the rendered content */}
        <motion.div
          ref={scope}
          className={`flex items-start justify-center rounded-[32px] bg-white overflow-hidden z-0 shadow-interface outline-1 outline-lightSilver`}
        >
          {/* Base layout / dimensions for a page */}
          <div
            className={`flex absolute`}
            style={{
              width: `${activePage.dimensions.width}px`,
              height: `${activePage.dimensions.height}px`,
            }}
          >
            {/* Container for items within a page. */}
            <div
              ref={scrollContainerRef}
              className={`flex flex-col items-center overflow-scroll
               w-full h-full scrollbar-none z-10 ${
                 activePage.name === "user"
                   ? "snap-mandatory snap-y"
                   : "flex-col"
               }`}
            >
              <ActiveComponent scale={scale} />
            </div>
          </div>
        </motion.div>

        {/*<Nav />*/}
      </Command>
    </motion.div>
  );
}
