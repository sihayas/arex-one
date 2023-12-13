import { Interface } from "./interface/Interface";
import React, { useEffect, ReactNode, useCallback, useRef } from "react";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";
import { useUser } from "@supabase/auth-helpers-react";
import { motion, useAnimate } from "framer-motion";

export default function Layout({ children }: { children: ReactNode }) {
  const user = useUser();
  const { isVisible, setIsVisible, pages } = useInterfaceContext();
  const { inputRef } = useNavContext();
  const mainContentRef = useRef<HTMLElement>(null);
  const [scope, animate] = useAnimate();

  const activePage: Page = pages[pages.length - 1];

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
      {user && pages.length > 0 && (
        <div
          className={`${
            isVisible ? "pointer-events-auto" : "pointer-events-none hidden"
          }`}
        >
          {/*  Blur Backdrop */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-screen h-screen bg-white/5 backdrop-blur-[124px] pointer-events-none z-0`}
          ></div>
          {/* Ambien */}
          <motion.div
            style={{
              backgroundColor: `#${activePage.color}`,
              width: `${activePage.dimensions.width}px`,
              height: `${activePage.dimensions.height}px`,
            }}
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 -z-10 rounded-max"
          />
          <Interface isVisible={isVisible} />
        </div>
      )}

      {/* Feed */}
      <main
        ref={scope}
        id="main-content"
        className={`origin-center flex items-center justify-center`}
      >
        {children}
      </main>
    </>
  );
}
