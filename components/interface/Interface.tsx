import React from "react";
import { useSound } from "@/context/Sound";
import { useInterfaceContext } from "@/context/InterfaceContext";

import { animated, to, useSpring } from "@react-spring/web";
import { Command } from "cmdk";
import Nav from "@/components/nav/Nav";

import Album from "./pages/album/Album";
import Entry from "./pages/entry/Entry";
import User from "./pages/user/User";
import Signals from "./pages/signals/Signals";

import { useInterfaceDrag } from "@/hooks/useDrag/interface";
import { useSession } from "next-auth/react";

const componentMap: Record<string, React.ComponentType<any>> = {
  album: Album,
  entry: Entry,
  user: User,
  signals: Signals,
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
      : `translate(-10vw, -50%) scale(0.95)`,
    opacity: isVisible ? 1 : 0,
    config: {
      tension: 200,
      friction: 40,
    },
  });

  const activePage = pages[pages.length - 1];
  // Page Tracker
  const ActiveComponent = componentMap[activePage.name] || User;

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
        className={`cmdk-inner flex bg-white duration-150 relative`}
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
        style={{
          width: 576,
          height: 712,
        }}
      >
        {/* Container / Shapeshifter / Magnifying Glass  */}
        <animated.div
          {...dragBind()} // Shapeshifter dragging
          style={{
            transform: to(
              [scaleX, scaleY, translateX, translateY],
              (sX, sY, tX, tY) =>
                `scaleX(${sX}) scaleY(${sY}) translateX(${tX}px) translateY(${tY}px)`
            ),
          }}
          className={`flex rounded-[24px] bg-transparent overflow-hidden w-[576px] h-[576px] z-20 ${
            isVisible ? "shadow-cmdkScaled2" : ""
          } `}
        ></animated.div>
        {/* Actual page content */}
        <div className="flex absolute w-full h-full">
          <ActiveComponent />
        </div>
        {/* <Nav /> */}
      </Command>
    </animated.div>
  );
}
// useEffect(() => {
//   requestAnimationFrame(() => {
//     const targetHeight = activePage.dimensions.height; // 1084
//     const targetWidth = activePage.dimensions.width; // can also be 576 or another value

//     const baseHeight = 576; // Base Height
//     const baseWidth = 576; // Base Width

//     const scaleFactorY = targetHeight / baseHeight;
//     const scaleFactorX = targetWidth / baseWidth;

//     set({
//       scaleX: scaleFactorX,
//       scaleY: scaleFactorY,
//     });
//   });
// }, [activePage.name, entryContainerRef.current, activePage.dimensions, set]);
