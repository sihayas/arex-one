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
  LayoutGroup,
} from "framer-motion";
import { useHandleSoundClick } from "@/hooks/useInteractions/useHandlePageChange";
import { PageName } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";

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
  const maxHeight = viewportHeight - 2 * 32; // * by 40 for base

  // When switching to record page, use calculated->stored height from
  // useLayoutEffect in Record to set the base height for record page. We
  // are adding the foundation height of the record + height of entry content
  useEffect(() => {
    if (activePage.name === "record") {
      setBaseHeight(activePage.dimensions.height + 432);
    }
  }, [pages, activePage.name, activePage.dimensions.height]);

  const dimensions = {
    user: {
      base: { width: 448, height: 672 },
      target: { width: 448, height: 672 },
    },
    album: {
      base: { width: 480, height: 480 },
      target: { width: 480, height: maxHeight },
    },
    record: {
      base: { width: 432, height: baseHeight },
      target: { width: 432, height: maxHeight },
    },
  };

  return dimensions[pageName];
};

export function Interface({ isVisible }: { isVisible: boolean }): JSX.Element {
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { expandInput, expandSignals } = useNavContext();

  // Page Tracker
  const activePage: Page = pages[pages.length - 1];
  const activePageName: PageName = activePage.name as PageName;
  const ActiveComponent = componentMap[activePageName];

  // Dimensions for pages
  const { base, target } = GetDimensions(activePageName);

  // Window ref
  const [scope, animate] = useAnimate();
  // Root ref
  const [rootScope, animateRoot] = useAnimate();

  // Shift width and height of shape-shifter/window while scrolling
  const { scrollY } = useScroll({ container: scrollContainerRef });
  const maxScroll = 24;
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
    const adjustBoxShadow = async () => {
      // Define the initial and final box shadow values
      const initialBoxShadow =
        "4px 7px 18px 0px rgba(0, 0, 0, 0.04), 15px 28px 32px 0px rgba(0, 0, 0, 0.04), 35px 63px 43px 0px rgba(0, 0, 0, 0.02), 61px 113px 51px 0px rgba(0, 0, 0, 0.01), 96px 176px 56px 0px rgba(0, 0, 0, 0.00)";
      const finalBoxShadow =
        "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)";

      // Animate the box shadow
      await animate(scope.current, {
        boxShadow:
          expandInput || expandSignals ? finalBoxShadow : initialBoxShadow,
      });
    };

    adjustBoxShadow();
  }, [animate, scope, expandInput, expandSignals]);

  // Animate shape-shifting the WINDOW on scroll & page change & bounce
  useEffect(() => {
    // Bounce and shift dimensions on page change
    const sequence = async () => {
      // Scale down
      await animate(
        scope.current,
        { scale: 0.95 },
        { type: "spring", stiffness: 800, damping: 40 },
      );

      // Bounce up and shift
      await animate(
        scope.current,
        {
          scale: [0.95, 1],
          width: `${base.width}px`,
          height: `${base.height}px`,
        },
        { type: "spring", stiffness: 400, damping: 40 },
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
        },
      );
    };

    const unsubWidth = newWidth.on("change", () =>
      shiftDimension("width", newWidth),
    );
    const unsubHeight = newHeight.on("change", () =>
      shiftDimension("height", newHeight),
    );

    return () => {
      unsubHeight();
      unsubWidth();
    };
  }, [
    animate,
    base.height,
    base.width,
    newHeight,
    newWidth,
    scope,
    pages,
    activePageName,
  ]);

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
        // onKeyDown={handleKeyDown}
        loop
      >
        {/* Shape-shift / Window, lies atop the rendered content */}
        <motion.div
          id={`cmdk-window`}
          ref={scope}
          className={`flex items-start justify-center bg-white overflow-hidden z-20 outline outline-1 outline-silver relative flex-shrink-0 rounded-[32px]`}
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
        </motion.div>
        <Nav />
        {/*{renderPageContent(activePage)}*/}
      </Command>
    </motion.div>
  );
}
