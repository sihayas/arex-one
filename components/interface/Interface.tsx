import React, { useEffect, useRef } from "react";
import { useSound } from "@/context/Sound";
import { useInterfaceContext } from "@/context/InterfaceContext";

import { animated, to, useSpring } from "@react-spring/web";
import { Command } from "cmdk";
import Nav from "@/components/nav/Nav";

import Album from "./pages/album/Album";
import Entry from "./pages/entry/Entry";
import User from "./pages/user/User";

import { useInterfaceDrag } from "@/hooks/useDrag/interface";
import { debounce } from "lodash";

const componentMap: Record<string, React.ComponentType<any>> = {
  album: Album,
  entry: Entry,
  user: User,
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
  } = useInterfaceContext();

  const { setSelectedSound, selectedFormSound, setSelectedFormSound } =
    useSound();

  const [{ translateY, translateX, scaleX, scaleY }, set] = useSpring(() => ({
    translateY: 0,
    translateX: 0,
    scaleX: 1,
    scaleY: 1,
    config: {
      tension: 400,
      friction: 47,
      mass: 0.2,
    },
  }));

  const dragBind = useInterfaceDrag({
    set,
    scaleX,
    scaleY,
  });

  // Spring CMDK visibility
  const visibilitySpring = useSpring({
    transform: isVisible
      ? `translate(-10vw, -50%) scale(1)`
      : `translate(-10vw, -50%) scale(0.97)`,
    opacity: isVisible ? 1 : 0,
    config: {
      tension: 200,
      friction: 40,
    },
  });

  // Page Tracker
  const activePage = pages[pages.length - 1];
  const ActiveComponent = componentMap[activePage.name] || User;

  const activeComponentRef = useRef(null); // Create a ref to observe active component

  useEffect(() => {
    const handleResize = debounce(() => {
      requestAnimationFrame(() => {
        if (activeComponentRef.current) {
          const { clientWidth: targetWidth, clientHeight: targetHeight } =
            activeComponentRef.current;

          const baseHeight = 480;
          const baseWidth = 480;

          const scaleFactorY = targetHeight / baseHeight;
          const scaleFactorX = targetWidth / baseWidth;

          set({
            scaleX: scaleFactorX,
            scaleY: scaleFactorY,
          });
        }
      });
    }, 250); // 200ms debounce

    const resizeObserver = new ResizeObserver(handleResize);

    if (activeComponentRef.current) {
      resizeObserver.observe(activeComponentRef.current);
    }

    return () => {
      // Clean up
      resizeObserver.disconnect();
      handleResize.cancel();
    };
  }, [activeComponentRef, set]);

  return (
    <animated.div
      style={{
        ...visibilitySpring,
      }}
      className={`cmdk ${
        isVisible ? "pointer-events-auto" : "!shadow-none pointer-events-none"
      }`}
    >
      {/* CMDK Inner  */}
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
        // Dimensions of CMDK change to hold new page content...
        style={{
          width: activePage.dimensions.width,
          height: activePage.dimensions.height,
        }}
      >
        {/* Shapeshifter dragging */}
        <animated.div
          {...dragBind()}
          style={{
            transform: to(
              [scaleX, scaleY, translateX, translateY],
              (sX, sY, tX, tY) =>
                `scaleX(${sX}) scaleY(${sY}) translateX(${tX}px) translateY(${tY}px)`
            ),
          }}
          className={`flex rounded-3xl bg-transparent overflow-hidden w-[480px] h-[480px] z-10 border border-silver2 shadow-2xl`}
        ></animated.div>

        {/* Actual page content */}
        <div ref={activeComponentRef} className={`flex absolute w-fit h-fit`}>
          <ActiveComponent />
        </div>
        <Nav />
      </Command>
    </animated.div>
  );
}
