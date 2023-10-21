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
      base: { width: 576, height: 352 },
      target: { width: 576, height: 352 }, // Placeholder values
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
  const { pages, setPages, scrollContainerRef } = useInterfaceContext();
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
  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });
  const maxScroll = 64;

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

  // Shapeshift on page change.
  const [scope, animate] = useAnimate();
  const [rootScope, animateRoot] = useAnimate();

  useEffect(() => {
    const sequence = async () => {
      // Scale down
      await animate(
        scope.current,
        {
          scale: 0.95,
        },
        {
          type: "spring",
          stiffness: 600,
          damping: 40,
        }
      );

      // Scale up and dimension shift
      await animate(
        scope.current,
        {
          scale: [0.95, 1],
          width: `${base.width}px`,
          height: `${base.height}px`,
        },
        {
          type: "spring",
          stiffness: 400,
          damping: 40,
        }
      );
    };

    sequence();
    // Animate dimensions on page ~scroll~, listens for changes via unsub
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
  }, [animate, base.height, base.width, newHeight, newWidth, scope, pages]);

  // useAnimate is necessary to visor the root because in-line motion.div
  // breaks the filter in Album page through some weird child effects.
  useEffect(() => {
    const animateParent = async () => {
      if (isVisible) {
        // Animate to visible state
        await animateRoot(
          rootScope.current,
          {
            x: "-50%",
            y: "-50%",
            scale: 1,
            opacity: 1,
          },
          {
            type: "spring",
            stiffness: 800,
            damping: 120,
          }
        );
      } else {
        // Animate to hidden state
        await animateRoot(
          rootScope.current,
          {
            x: "-50%",
            y: "-50%",
            scale: 0.97,
            opacity: 0,
          },
          {
            type: "spring",
            stiffness: 500,
            damping: 50,
          }
        );
      }
    };

    animateParent();
  }, [animate, isVisible, scope, animateRoot, rootScope]);

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
          className={`flex items-start justify-center bg-white overflow-hidden z-20 outline outline-[.5px] outline-silver drop-shadow-2xl rounded-3xl`}
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
    <div className="flex items-center justify-center w-full p-8 pt-4 fixed -bottom-16 uppercase">
      <div className="text-xs text-gray3 font-medium pr-4">{typeLabel}</div>
      <div className="text-xs text-black font-semibold pr-2">{mainContent}</div>
      <div className="text-xs text-black">{subContent}</div>
    </div>
  );
}
