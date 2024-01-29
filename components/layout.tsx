import { Interface } from "./interface/Interface";
import React, { useEffect, ReactNode, useRef } from "react";
import { PageName, useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";
import { Player } from "@/components/global/Player";

import { motion, useAnimate } from "framer-motion";
import { GetDimensions } from "./interface/Interface";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useInterfaceContext();
  const { isVisible, setIsVisible, activePage } = useInterfaceContext();
  const { inputRef } = useNavContext();
  const mainContentRef = useRef<HTMLElement>(null);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateMainContent = async () => {
      const animationConfig = {
        scale: isVisible ? 0.95 : 1,
        pointerEvents: isVisible ? "none" : "auto",
        opacity: isVisible ? 0 : 1,
        visibility: isVisible ? "hidden" : "visible",
      };
      const transitionConfig = {
        scale: {
          type: "spring" as const,
          mass: 0.75,
          stiffness: 200,
          damping: 22,
          delay: isVisible ? 0 : 0.15,
        },
        opacity: {
          type: "spring" as const,
          mass: 0.75,
          stiffness: 200,
          damping: 22,
          delay: isVisible ? 0 : 0.15,
        },
        visibility: {
          delay: 0.15,
        },
      };
      await animate(scope.current, animationConfig, transitionConfig);
    };
    animateMainContent();
  }, [isVisible, animate, scope]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        setIsVisible((prevIsVisible) => !prevIsVisible);
        event.preventDefault();
      } else if (event.key === "Escape") {
        if (inputRef?.current === document.activeElement) {
          inputRef.current?.blur();
        } else {
          setIsVisible(false);
        }
      }
    };

    const handleDoubleClick = () => {
      setIsVisible((prevIsVisible) => !prevIsVisible);
    };

    window.addEventListener("keydown", handleKeyDown);
    const mainContentElement = mainContentRef.current;
    if (mainContentElement) {
      mainContentElement.addEventListener("dblclick", handleDoubleClick);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (mainContentElement) {
        mainContentElement.removeEventListener("dblclick", handleDoubleClick);
      }
    };
  }, [setIsVisible, inputRef, mainContentRef]);

  return (
    <>
      {/* Interface */}
      {user && activePage && (
        <motion.div
          animate={{
            opacity: isVisible ? 1 : 0,
          }}
        >
          {/*  Blur Backdrop */}
          {/*<div*/}
          {/*  className={`absolute top-0 left-0 w-screen h-screen bg-white/20 backdrop-blur-[80px] pointer-events-none z-0`}*/}
          {/*></div>*/}
          {/* Ambien */}
          {/*<motion.div*/}
          {/*  style={{*/}
          {/*    backgroundColor: `#${activePage?.color}`,*/}
          {/*    width: `400px`,*/}
          {/*    height: `400px`,*/}
          {/*  }}*/}
          {/*  className="absolute center-x center-y -z-10 rounded-max"*/}
          {/*/>*/}
          <Interface isVisible={isVisible} />
        </motion.div>
      )}

      {/* Feed */}
      <main
        ref={scope}
        id="main-content"
        className={`origin-center flex items-center justify-center`}
      >
        {children}
      </main>

      {/*<Slider />*/}
    </>
  );
}
