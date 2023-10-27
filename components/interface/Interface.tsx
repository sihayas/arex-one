import React, { useEffect } from "react";
import { useSound } from "@/context/SoundContext";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";

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
  MotionValue,
} from "framer-motion";
import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
import { createPortal } from "react-dom";

const MotionNav = motion(Nav);

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
    expandInput,
    expandSignals,
  } = useNavContext();

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

  // Makes root visible/invisible, useAnimate dont use inline
  useEffect(() => {
    const animateParent = async () => {
      const animationConfig = {
        x: "-50%",
        y: "-50%",
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
  }, [isVisible, animateRoot, rootScope, expandInput]);

  // Animates window shadows
  useEffect(() => {
    const animateParent = async () => {
      const animationConfig = {
        boxShadow: isVisible
          ? expandInput || expandSignals
            ? "2px 4px 10px 0px rgba(0, 0, 0, 0.04), 7px 16px 17px 0px rgba(0, 0, 0, 0.04), 15px 36px 23px 0px rgba(0, 0, 0, 0.02), 27px 64px 28px 0px rgba(0, 0, 0, 0.01), 42px 100px 30px 0px rgba(0, 0, 0, 0.00)"
            : "9px 20px 49px 0px rgba(0, 0, 0, 0.04), 35px 82px 89px 0px rgba(0, 0, 0, 0.04), 78px 184px 120px 0px rgba(0, 0, 0, 0.02), 139px 327px 142px 0px rgba(0, 0, 0, 0.01), 216px 511px 155px 0px rgba(0, 0, 0, 0.00)"
          : "none",
        scale: isVisible ? (expandInput ? 0.944 : 1) : 0.9,
      };
      const transitionConfig = {
        type: "spring" as const,
        stiffness: isVisible ? 800 : 500,
        damping: isVisible ? 120 : 50,
        scale: expandInput
          ? { stiffness: 180, damping: 12 }
          : { stiffness: 240, damping: 12 },
      };
      await animate(scope.current, animationConfig, transitionConfig);
    };
    animateParent();
  }, [isVisible, animate, scope, expandInput, expandSignals]);

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

  // Responsible for shapeshifting the window & bouncing
  useEffect(() => {
    // Bounce and shift dimensions on page change
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
          stiffness: 500,
          damping: dimension === "width" ? 50 : 60,
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
    <div ref={rootScope} className={`cmdk z-10 rounded-[32px]`}>
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
          className={`flex items-start justify-center bg-white overflow-hidden z-20 outline outline-[.5px] outline-silver rounded-[32px]`}
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
