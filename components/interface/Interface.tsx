import React, { useEffect } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";

import { Command } from "cmdk";
import Nav from "@/components/interface/nav/Nav";

import Sound from "@/components/interface/sound/Sound";
import Artifact from "@/components/interface/artifact/Artifact";
import User from "@/components/interface/user/User";

import {
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
      base: { width: 432, height: 656 },
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
  const { scrollContainerRef, activePage } = useInterfaceContext();
  const { expandInput } = useNavContext();

  const activePageName: PageName = activePage.name as PageName;
  const ActiveComponent = componentMap[activePageName];

  const { base, target } = GetDimensions(activePageName);

  const [scope, animate] = useAnimate(); // Window
  const [rootScope, animateRoot] = useAnimate(); // Root

  // Shift width and height of shape-shifter/window while scrolling
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });
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

  // Animate portal dimensions & bounce on page change
  useEffect(() => {
    const { base, target } = GetDimensions(activePage.name as PageName);

    // Page change shapeshift & bounce
    const shapeShift = () => {
      // Scale down
      animate(
        scope.current,
        { scale: 0.9 },
        { type: "spring", stiffness: 800, damping: 40 },
      );

      // Bounce up and shift
      animate(
        scope.current,
        {
          scale: [0.9, 1],
          width: activePage.isOpen ? `${target.width}px` : `${base.width}px`,
          height: activePage.isOpen ? `${target.height}px` : `${base.height}px`,
        },
        { type: "spring", stiffness: 400, damping: 40 },
      );

      console.log("activePage.isOpen", activePage.isOpen);
    };
    shapeShift();
  }, [
    animate,
    base.height,
    base.width,
    target.height,
    target.width,
    scope,
    activePage,
  ]);

  // Animate page dimensions while scrolling
  useEffect(() => {
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
      unsubWidth();
      unsubHeight();
    };
  }, [animate, newWidth, newHeight, scope]);

  return (
    <motion.div
      // transformTemplate={template} // Prevent translateZ from being applied
      ref={rootScope}
      id={`cmdk`}
      className={`cmdk rounded-full`}
    >
      {/* Shape-shift / Window, lies atop the rendered content */}
      <Command
        id={`cmdk-inner`}
        className={`shadow-shadowKitHigh relative flex items-start justify-center overflow-hidden rounded-full bg-[#F4F4F4]/80`}
        shouldFilter={false}
        loop
        ref={scope}
      >
        {/* Base layout / Static dimensions for a page */}
        <motion.div
          id={`cmdk-scroll`}
          ref={scrollContainerRef}
          className={`scrollbar-none flex snap-y snap-mandatory flex-col items-center overflow-y-scroll rounded-full`}
          style={{
            minWidth: `${target.width}px`,
            height: `${target.height}px`,
          }}
        >
          <ActiveComponent key={activePage.key} />
        </motion.div>
        <Nav />
      </Command>
    </motion.div>
  );
}

// function template({ x, y, scale }: { x: number; y: number; scale: number }) {
//   // Assuming x and y are percentages and scale is a unit-less number
//   return `translateX(${x}) translateY(${y}) scale(${scale})`;
// }
