import React, { useEffect } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";

import { Command } from "cmdk";
import Nav from "@/components/interface/nav/Nav";

import Sound from "@/components/interface/sound/Sound";
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
  sound: Sound,
  artifact: Artifact,
  user: User,
};
// Calculate & set base dimensions and target dimensions for the window per page
export const GetDimensions = (pageName: PageName) => {
  const viewportHeight = window.innerHeight;
  const maxHeight = viewportHeight - 2 * 64;

  const dimensions = {
    user: {
      base: { width: 688, height: 384 },
      target: { width: 688, height: maxHeight },
    },
    sound: {
      base: { width: 432, height: 432 },
      target: { width: 512, height: maxHeight },
    },
    artifact: {
      base: { width: 528, height: 748 },
      target: { width: 560, height: maxHeight },
    },
  };

  return dimensions[pageName];
};

export function Interface({ isVisible }: { isVisible: boolean }) {
  const { pages, scrollContainerRef, activePage } = useInterfaceContext();
  const { expandInput } = useNavContext();

  const activePageName: PageName = activePage.name as PageName;
  const ActiveComponent = componentMap[activePageName];

  const { base, target } = GetDimensions(activePageName); // Dimensions

  const [contentScope, animateContent] = useAnimate();

  const setRefs = (element: HTMLDivElement | null) => {
    (contentScope as React.MutableRefObject<HTMLDivElement | null>).current =
      element;

    if (scrollContainerRef) {
      scrollContainerRef.current = element;
    }
  };

  const [rootScope, animateRoot] = useAnimate(); // Root

  const [scope, animate] = useAnimate(); // Window

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
    const animateParent = () => {
      const animationConfig = {
        x: "-50%",
        y: "-50%",
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.97,
        visibility: isVisible ? "visible" : "hidden",
      };
      const transitionConfig = {
        scale: {
          type: "spring" as const,
          mass: 1,
          stiffness: 180,
          damping: 22,
          delay: isVisible ? 0.15 : 0,
        },
        opacity: {
          type: "spring" as const,
          mass: 1,
          stiffness: 180,
          damping: 22,
          delay: isVisible ? 0.15 : 0,
        },
        visibility: {
          delay: isVisible ? 0 : 0.15,
        },
      };
      animateRoot(rootScope.current, animationConfig, transitionConfig);
    };
    animateParent();
  }, [isVisible, animateRoot, rootScope, expandInput]);

  // Animate content blur
  useEffect(() => {
    const blurContent = () => {
      animateContent(
        contentScope.current,
        {
          filter: expandInput ? "brightness(.75)" : "brightness(1)",
          opacity: expandInput ? 0.5 : 1,
        },
        {
          type: "spring",
          stiffness: 240,
          damping: 18,
        },
      );
    };

    blurContent();
  }, [animateContent, contentScope, expandInput]);

  // Animate portal dimensions & bounce
  useEffect(() => {
    const isOpen = activePage.isOpen;
    // Animate dimensions on page change & bounce
    const sequence = () => {
      // Scale down
      animate(
        scope.current,
        { scale: 0.95 },
        { type: "spring", stiffness: 800, damping: 40 },
      );

      // Bounce up and shift
      animate(
        scope.current,
        {
          scale: [0.95, 1],
          width: isOpen ? `${target.width}px` : `${base.width}px`,
          height: isOpen ? `${target.height}px` : `${base.height}px`,
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
          stiffness: 240,
          damping: 40,
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
    target.height,
    target.width,
    newHeight,
    newWidth,
    scope,
    pages,
    activePageName,
    activePage.isOpen,
  ]);

  return (
    <motion.div
      transformTemplate={template} // Prevent translateZ from being applied
      ref={rootScope}
      id={`cmdk`}
      className={`cmdk rounded-full`}
    >
      {/* Shape-shift / Window, lies atop the rendered content */}
      <Command
        id={`cmdk-inner`}
        className={`flex items-start justify-center bg-[#F4F4F4]/80 rounded-full relative shadow-shadowKitHigh overflow-hidden`}
        shouldFilter={false}
        loop
        ref={scope}
      >
        {/* Base layout / Static dimensions for a page */}
        <motion.div
          id={`cmdk-scroll`}
          ref={setRefs}
          className={`flex flex-col items-center overflow-y-scroll scrollbar-none rounded-full snap-mandatory snap-y`}
          style={{
            width: `${target.width}px`,
            height: `${target.height}px`,
          }}
        >
          <AnimatePresence>
            <ActiveComponent />
          </AnimatePresence>
        </motion.div>
        <Nav />
      </Command>
    </motion.div>
  );
}

function template({ x, y, scale }: { x: number; y: number; scale: number }) {
  // Assuming x and y are percentages and scale is a unit-less number
  return `translateX(${x}) translateY(${y}) scale(${scale})`;
}
