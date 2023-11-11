import React, { useEffect, useState } from "react";
import { useSound } from "@/context/SoundContext";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";

import { Command } from "cmdk";
import Nav from "@/components/interface/nav/Nav";

import Album from "@/components/interface/album/Album";
import RecordFace from "@/components/interface/record/RecordFace";
import User from "@/components/interface/user/User";

import {
  AnimatePresence,
  motion,
  useAnimate,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
import { PageName } from "@/context/InterfaceContext";

const componentMap: Record<PageName, React.ComponentType<any>> = {
  album: Album,
  record: RecordFace,
  user: User,
};
// Calculate & set base dimensions and target dimensions for the window per page
export const GetDimensions = (pageName: PageName) => {
  // Initialize base height for window at its longest
  const viewportHeight = window.innerHeight;
  const { pages } = useInterfaceContext();
  const activePage = pages[pages.length - 1];

  // Initialize base height for record page
  const [baseHeight, setBaseHeight] = useState(432);

  // When switching to record page, use calculated->stored height from
  // useLayoutEffect to set base height for record page.
  useEffect(() => {
    if (activePage.name === "record") {
      setBaseHeight(activePage.dimensions.height + 432);
    }
  }, [pages, activePage.name, activePage.dimensions.height]);

  const dimensions = {
    user: {
      base: { width: 448, height: 448 },
      target: { width: 448, height: 448 },
    },
    album: {
      base: { width: 480, height: 480 },
      target: { width: 480, height: viewportHeight - 2 * 24 },
    },
    record: {
      base: { width: 432, height: baseHeight },
      target: { width: 432, height: viewportHeight - 2 * 72 },
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
    expandInput,
    expandSignals,
  } = useNavContext();

  const { selectedFormSound, setSelectedFormSound } = useSound();

  // Page Tracker
  const activePage: Page = pages[pages.length - 1];
  const activePageName: PageName = activePage.name as PageName;
  const ActiveComponent = componentMap[activePageName];

  // Get dimensions for active page to use with hooks
  const { base, target } = GetDimensions(activePageName);

  // Window scope
  const [scope, animate] = useAnimate();
  // Root scope
  const [rootScope, animateRoot] = useAnimate();

  // Shift width and height of shape-shifter/window while scrolling
  const { scrollY } = useScroll({ container: scrollContainerRef });
  const maxScroll = 64;
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
  // Only for user page
  const newBorderRadius = useTransform(scrollY, [0, maxScroll], [224, 32]);

  // Animate ROOT opacity.
  useEffect(() => {
    const animateParent = async () => {
      const animationConfig = {
        x: "-50%",
        y: "-50%",
        opacity: isVisible ? 1 : 0,
      };
      const transitionConfig = {
        type: "spring" as const,
        stiffness: isVisible ? 1200 : 800,
        damping: isVisible ? 120 : 50,
      };
      await animateRoot(rootScope.current, animationConfig, transitionConfig);
    };
    animateParent();
  }, [isVisible, animateRoot, rootScope, expandInput]);

  // Animates WINDOW presence
  useEffect(() => {
    const animateParent = async () => {
      const animationConfig = {
        scale: isVisible ? 1 : 0.9,
      };
      const transitionConfig = {
        type: "spring" as const,
        mass: 0.75,
        stiffness: 180,
        damping: 22,
      };

      await animate(scope.current, animationConfig, transitionConfig);
    };
    animateParent();
  }, [isVisible, animate, scope, expandInput, expandSignals]);

  // Animate WINDOW to shrink when nav is expanded
  useEffect(() => {
    const adjustHeight = async () => {
      const newHeight = expandInput || expandSignals ? 64 : base.height;
      await animate(
        scope.current,
        { height: `${newHeight}px` },
        {
          type: "spring",
          stiffness: 500,
          damping: 60,
          mass: 2,
          velocity: 10,
          restSpeed: 0.5,
          restDelta: 0.5,
        }
      );
    };

    adjustHeight();
  }, [animate, base.height, scope, expandInput, expandSignals]);

  // Animate shape-shifting the WINDOW on scroll & page change & bounce
  useEffect(() => {
    // Bounce and shift dimensions on page change
    const sequence = async () => {
      // Scale down
      await animate(
        scope.current,
        { scale: 0.95 },
        { type: "spring", stiffness: 800, damping: 40 }
      );

      // Bounce up and shift
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
          stiffness: 500,
          damping: 60,
          mass: 2,
          velocity: 10,
          restSpeed: 0.5,
          restDelta: 0.5,
        }
      );
    };

    const unsubWidth = newWidth.on("change", () =>
      shiftDimension("width", newWidth)
    );
    const unsubHeight = newHeight.on("change", () =>
      shiftDimension("height", newHeight)
    );

    const unsubBorderRadius = newBorderRadius.on("change", () => {
      if (activePageName === "user") {
        shiftDimension("borderRadius", newBorderRadius);
      }
    });

    return () => {
      unsubHeight();
      unsubWidth();
      unsubBorderRadius();
    };
  }, [
    animate,
    base.height,
    base.width,
    newHeight,
    newWidth,
    newBorderRadius,
    scope,
    pages,
    activePageName,
  ]);

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
    <motion.div
      ref={rootScope}
      id={`cmdk`}
      className={`cmdk z-10 rounded-[32px]`}
    >
      {/* CMD-K Inner  */}
      <Command
        id={`cmdk-inner`}
        className={`cmdk-inner flex rounded-[32px] gap-8 items-center`}
        shouldFilter={false}
        onKeyDown={handleKeyDown}
        loop
      >
        {/* Shape-shift / Window, lies atop the rendered content */}
        <motion.div
          id={`cmdk-window`}
          ref={scope}
          className={`flex items-start justify-center bg-white overflow-hidden z-20 outline outline-1 outline-silver shadow-interface relative flex-shrink-0 rounded-[32px]`}
        >
          {/* Base layout / Static dimensions for a page */}
          <div
            className={`flex absolute z-10`}
            style={{
              width: `${target.width}px`,
              height: `${target.height}px`,
            }}
          >
            {/* Container for items within a page. */}
            <div
              ref={scrollContainerRef}
              className={`flex flex-col items-center overflow-y-scroll w-full h-full scrollbar-none rounded-[32px]`}
            >
              <AnimatePresence>
                <ActiveComponent />
              </AnimatePresence>
            </div>
          </div>
          {/* Footer */}
          {renderPageContent(activePage)}
        </motion.div>
        <Nav />
      </Command>
    </motion.div>
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
    case "record":
      typeLabel = "RECORD";
      mainContent = record?.appleAlbumData.attributes.name;
      subContent = "by @" + record?.author.username;
      break;
    default:
      typeLabel = "UNKNOWN";
      mainContent = "Unknown Content";
  }

  return (
    <div className="flex items-center justify-center w-full fixed -top-4 uppercase font-mono">
      <div className="text-xs text-gray2 pr-4 leading-[8px%]">{typeLabel}</div>
      <div className="text-xs text-gray4 pr-2 leading-[8px]">{mainContent}</div>
      <div className="text-xs text-gray5 leading-[8px]">{subContent}</div>
    </div>
  );
}
