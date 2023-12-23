import React, { useEffect } from "react";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";

import { Command } from "cmdk";
import Nav from "@/components/interface/nav/Nav";

import Album from "@/components/interface/album/Album";
import Artifact from "@/components/interface/artifact/Artifact";
import User from "@/components/interface/user/User";

import {
  AnimatePresence,
  motion,
  useAnimate,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { PageName } from "@/context/InterfaceContext";

const componentMap: Record<PageName, React.ComponentType<any>> = {
  album: Album,
  artifact: Artifact,
  user: User,
};
// Calculate & set base dimensions and target dimensions for the window per page
export const GetDimensions = (pageName: PageName) => {
  const viewportHeight = window.innerHeight;
  const maxHeight = viewportHeight - 2 * 32;

  const dimensions = {
    user: {
      base: { width: 576, height: 400 },
      target: { width: 576, height: maxHeight },
    },
    album: {
      base: { width: 576, height: 576 },
      target: { width: 512, height: maxHeight },
    },
    artifact: {
      base: { width: 384, height: 570 },
      target: { width: 480, height: maxHeight },
    },
  };

  return dimensions[pageName];
};

export function Interface({ isVisible }: { isVisible: boolean }): JSX.Element {
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { expandInput } = useNavContext();

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
  const maxScroll = 1;
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

  // Animate portal visibility
  useEffect(() => {
    const animateParent = async () => {
      const animationConfig = {
        x: "-50%",
        y: "-50%",
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.9,
        visibility: isVisible ? "visible" : "hidden",
      };
      const transitionConfig = {
        scale: {
          type: "spring" as const,
          mass: 0.75,
          stiffness: 180,
          damping: 22,
          delay: isVisible ? 0.15 : 0,
        },
        opacity: {
          type: "spring" as const,
          mass: 0.75,
          stiffness: 180,
          damping: 22,
          delay: isVisible ? 0.15 : 0,
        },
        visibility: {
          delay: isVisible ? 0 : 0.15,
        },
      };
      await animateRoot(rootScope.current, animationConfig, transitionConfig);
    };
    animateParent();
  }, [isVisible, animateRoot, rootScope, expandInput]);

  // useEffect(() => {
  //   const blurContent = async () => {
  //     await animate(
  //       scope.current,
  //       {
  //         filter: expandInput ? "blur(12px)" : "blur(0px)",
  //         scale: expandInput ? 0.86 : 1,
  //       },
  //       {
  //         type: "spring",
  //         stiffness: 240,
  //         damping: 18,
  //       },
  //     );
  //   };
  //
  //   blurContent();
  // }, [animate, scope, expandInput]);

  // Animate shape-shifting the portal on scroll & page change & bounce
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
    <motion.div ref={rootScope} id={`cmdk`} className={`cmdk rounded-full`}>
      {/* Shape-shift / Window, lies atop the rendered content */}
      <Command
        id={`cmdk-inner`}
        className={`flex items-start justify-center bg-white rounded-full outline outline-silver outline-1 relative`}
        shouldFilter={false}
        loop
        ref={scope}
      >
        {/* Base layout / Static dimensions for a page */}
        <div
          id={`cmdk-scroll`}
          ref={scrollContainerRef}
          className={`flex flex-col items-center overflow-y-scroll w-full h-full scrollbar-none rounded-full`}
          style={{
            width: `${target.width}px`,
            height: `${target.height}px`,
          }}
        >
          <AnimatePresence>
            <ActiveComponent />
          </AnimatePresence>
        </div>
        <Nav />
      </Command>
    </motion.div>
  );
}
