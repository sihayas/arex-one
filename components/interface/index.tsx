import React, { useEffect, useRef } from "react";
import { useInterfaceContext } from "@/context/Interface";
import { useNavContext } from "@/context/Nav";

import { Command } from "cmdk";
import Nav from "@/components/interface/nav";

import Sound from "@/components/interface/sound";
import Artifact from "@/components/interface/artifact";
import User from "@/components/interface/user";

import {
  motion,
  useAnimate,
  useScroll,
  useTransform,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import { PageName } from "@/context/Interface";
import { createPortal } from "react-dom";

// Calculate & set base dimensions and target dimensions for the window per page
export const GetDimensions = (pageName: PageName) => {
  const viewportHeight = window.innerHeight;
  const maxHeight = viewportHeight - 2 * 64;

  const dimensions = {
    user: {
      base: { width: 640, height: 400 },
      target: { width: 640, height: maxHeight },
    },
    sound: {
      base: { width: 496, height: 496 },
      target: { width: 688, height: maxHeight },
    },
    artifact: {
      base: { width: 512, height: 640 },
      target: { width: 512, height: maxHeight },
    },
  };

  return dimensions[pageName];
};

export function Interface({ isVisible }: { isVisible: boolean }) {
  const { scrollContainerRef, activePage } = useInterfaceContext();
  const { expandInput, activeAction } = useNavContext();
  const cmdkPortal = document.getElementById("cmdk");
  const isNotifications = activeAction === "notifications";
  const isChanging = useRef(false);

  const { base, target } = GetDimensions(activePage.name as PageName);

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
      animateRoot(
        rootScope.current,
        {
          x: "-50%",
          y: "-50%",
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.9,
          pointerEvents: isVisible ? "auto" : "none",
          zIndex: isVisible ? 10 : -10,
        },
        {
          scale: {
            type: "spring" as const,
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
            delay: isVisible ? 0.15 : 0.25,
          },
        },
      );
    };
    animateParent();
  }, [isVisible, animateRoot, rootScope, expandInput]);

  // Shape-shifts the window while scrolling or if page changes. Page change
  // changes the base.width and base.height in the newWidth and newHeight
  // functions which in turn triggers the useEffect below so we don't need
  // a separate useEffect for page change.
  useEffect(() => {
    const shiftDimension = (dimension: string, newDimension: MotionValue) => {
      animate(
        scope.current,
        { [dimension]: newDimension.get() },
        {
          type: "spring",
          stiffness: 250,
          damping: 35,
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

  // Animate portal styles mainly for expandInput
  useEffect(() => {
    const animateShadow = () => {
      const animationConfig = {
        boxShadow: expandInput
          ? "rgba(0, 0, 0, 0.0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.0) 0px 0px 0px 0px"
          : "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
        scale: expandInput ? 0.9 : 1,
        filter: expandInput && isNotifications ? "blur(24px)" : "blur(0px)",
      };
      const transitionConfig = {
        type: "spring" as const,
        mass: 1,
        stiffness: 180,
        damping: 22,
        delay: expandInput ? 0 : 0.15,
      };
      animate(scope.current, animationConfig, transitionConfig);
    };
    animateShadow();
  }, [expandInput, animate, scope, isNotifications]);

  return (
    <motion.div
      key={`cmdk`}
      // transformTemplate={template} // Prevent translateZ from being applied
      ref={rootScope}
      id={`cmdk`}
      className={`cmdk rounded-full`}
    >
      {/* Shape-shift Window, lies atop the rendered content */}
      <Command
        id={`cmdk-inner`}
        className={`relative flex items-start justify-center overflow-hidden rounded-full bg-[#F6F6F6] bg-opacity-75 ${
          expandInput ? "mix-blend-darken" : ""
        }`}
        shouldFilter={false}
        loop
        ref={scope}
      >
        {/* Base layout / Static dimensions for a page */}
        <motion.div
          id={`cmdk-scroll`}
          ref={scrollContainerRef}
          className={`scrollbar-none flex snap-y snap-mandatory flex-col items-center overflow-y-scroll overflow-x-hidden rounded-full`}
          style={{
            minWidth: `${target.width}px`,
            height: `${target.height}px`,
          }}
        >
          <AnimatePresence mode={`wait`}>
            <motion.div
              key={activePage.key}
              className={`flex flex-col w-full h-full items-center origin-[50%_25%]`}
              initial={{ filter: "blur(24px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              exit={{ filter: "blur(24px)", opacity: 0, scale: 0.75 }}
              transition={{ ease: "easeInOut", duration: 0.25 }}
              onAnimationStart={() => {
                isChanging.current = true;
              }}
              onAnimationComplete={() => {
                isChanging.current = false;
              }}
            >
              {activePage.name === "sound" && <Sound />}
              {activePage.name === "artifact" && <Artifact />}
              {activePage.name === "user" && <User />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        {/* Dial */}
        {cmdkPortal && createPortal(<Nav />, cmdkPortal)}
      </Command>
    </motion.div>
  );
}

function template({ x, y, scale }: { x: number; y: number; scale: number }) {
  // Assuming x and y are percentages and scale is a unit-less number
  return `translateX(${x}) translateY(${y}) scale(${scale})`;
}
