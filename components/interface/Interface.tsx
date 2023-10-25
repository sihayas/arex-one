import React, { useEffect } from "react";
import { useSound } from "@/context/SoundContext";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useInputContext } from "@/context/InputContext";

import { Command } from "cmdk";
import Nav from "@/components/interface/nav/Nav";

import Album from "@/components/interface/album/Album";
import Entry from "@/components/interface/entry/Entry";
import User from "@/components/interface/user/User";

import {
  AnimatePresence,
  motion,
  useAnimate,
  useScroll,
  useTransform,
  motionValue,
  MotionValue,
} from "framer-motion";
import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";

const componentMap: Record<PageName, React.ComponentType<any>> = {
  album: Album,
  entry: Entry,
  user: User,
};

type PageName = "album" | "user" | "entry";

const getDimensions = (pageName: PageName) => {
  const dimensions = {
    user: {
      base: { width: 352, height: 576 },
      target: { width: 352, height: 576 }, // Placeholder values
    },
    album: {
      base: { width: 480, height: 480 },
      target: { width: 480, height: 1024 }, // Placeholder values
    },
    entry: {
      base: { width: 480, height: 480 },
      target: { width: 480, height: 1024 }, // Placeholder values
    },
  };

  return dimensions[pageName];
};

export function Interface({ isVisible }: { isVisible: boolean }): JSX.Element {
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { handleSelectSound } = useHandleSoundClick();

  const {
    inputValue,
    setInputValue,
    storedInputValue,
    inputRef,
    setStoredInputValue,
  } = useInputContext();

  const { setSelectedSound, selectedFormSound, setSelectedFormSound } =
    useSound();

  // Page Tracker
  const activePage: Page = pages[pages.length - 1];
  const activePageName: PageName = activePage.name as PageName;
  const ActiveComponent = componentMap[activePageName];

  // Dimensions
  const { base, target } = getDimensions(activePageName);

  // Scroll tracker
  const { scrollY } = useScroll({ container: scrollContainerRef });
  const maxScroll = 64;

  //Window scope
  const [scope, animate] = useAnimate();
  // Root scope
  const [rootScope, animateRoot] = useAnimate();

  // Shift width and height of shape-shifter/window while scrolling
  const newWidth = useTransform(
    scrollY,
    [0, maxScroll],
    [base.width, target.width]
  );
  const newHeight = useTransform(
    scrollY,
    [0, maxScroll],
    [base.height, target.height]
  );

  // useAnimate is necessary to visor the root because in-line motion.div
  // breaks the filter in Album page through some weird child effects.
  // Responsible for making window visible/invisible
  useEffect(() => {
    const animateParent = async () => {
      const animationConfig = {
        x: "-50%",
        y: "-50%",
        scale: isVisible ? 1 : 0.97,
        opacity: isVisible ? 1 : 0,
      };
      const transitionConfig = {
        type: "spring" as const,
        stiffness: isVisible ? 800 : 500,
        damping: isVisible ? 120 : 50,
      };
      await animateRoot(rootScope.current, animationConfig, transitionConfig);
    };
    animateParent();
  }, [isVisible, animateRoot, rootScope]);

  // Responsible for shapeshifting the window
  useEffect(() => {
    const sequence = async () => {
      // Scale down
      await animate(
        scope.current,
        { scale: 0.95 },
        { type: "spring", stiffness: 800, damping: 40 }
      );
      // Scale up and dimension shift
      await animate(
        scope.current,
        {
          scale: [0.95, 1],
          width: `${base.width}px`,
          height: `${base.height}px`,
        },
        { type: "spring", stiffness: 400, damping: 40 }
      );
    };
    sequence();

    // Animate dimensions on page ~scroll~, listens for changes via unsub
    const shiftDimension = (dimension: string, newDimension: MotionValue) => {
      animate(
        scope.current,
        { [dimension]: newDimension.get() },
        {
          type: "spring",
          stiffness: 100,
          damping: dimension === "width" ? 50 : 10,
        }
      );
    };

    const unsubWidth = newWidth.on("change", () =>
      shiftDimension("width", newWidth)
    );
    const unsubHeight = newHeight.on("change", () =>
      shiftDimension("height", newHeight)
    );

    return () => {
      unsubHeight();
      unsubWidth();
    };
  }, [animate, base.height, base.width, newHeight, newWidth, scope, pages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // switch to album page from form
    if (e.key === "Enter" && selectedFormSound && inputValue === "") {
      e.preventDefault();
      handleSelectSound(selectedFormSound.sound, selectedFormSound.artworkUrl);
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
  };

  return (
    <div ref={rootScope} className={`cmdk z-10 `}>
      {/* CMD-K Inner  */}
      <Command
        className={`cmdk-inner flex rounded-3xl`}
        shouldFilter={false}
        onKeyDown={handleKeyDown}
        loop
      >
        {/* Shape-shift / Window, lies atop the rendered content */}
        <motion.div
          ref={scope}
          className={`flex items-start justify-center bg-white overflow-hidden z-20 outline outline-[.5px] outline-silver shadow-2xl rounded-[32px]`}
        >
          {/* Base layout / dimensions for a page */}
          <div
            className={`flex absolute z-10`}
            style={{
              width: `${activePage.dimensions.width}px`,
              height: `${activePage.dimensions.height}px`,
            }}
          >
            {/* Container for items within a page. */}
            <div
              ref={scrollContainerRef}
              className={`flex flex-col items-center overflow-y-scroll overflow-x-hidden w-full h-full scrollbar-none`}
            >
              <AnimatePresence>
                <ActiveComponent />
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        <Nav />
        {/* Footer */}
        {renderPageContent(activePage)}
      </Command>
    </div>
  );
}

function renderPageContent(page: Page) {
  const { name, sound, user, record } = page;

  let typeLabel, mainContent, subContent;

  switch (name.toLowerCase()) {
    case "album":
      typeLabel = "ALBUM";
      mainContent = sound?.attributes.name || "Unknown Album";
      subContent = sound?.attributes.artistName || "Unknown Artist";
      break;
    case "user":
      typeLabel = "USER";
      mainContent = user?.username || "Unknown User";
      break;
    case "entry":
      typeLabel = "ENTRY";
      mainContent = record?.appleAlbumData.attributes.name;
      subContent = "by @" + record?.author.username;
      break;
    default:
      typeLabel = "UNKNOWN";
      mainContent = "Unknown Content";
  }

  return (
    <div className="flex items-center justify-center w-full p-8 pt-4 fixed -top-12 uppercase">
      <div className="text-xs text-gray3 font-medium pr-4">{typeLabel}</div>
      <div className="text-xs text-black font-semibold pr-2">{mainContent}</div>
      <div className="text-xs text-black">{subContent}</div>
    </div>
  );
}
