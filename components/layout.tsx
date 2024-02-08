import { Interface } from "./interface/Interface";
import React, { useEffect, ReactNode } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";

import { useAnimate } from "framer-motion";

const opacityConfig = {
  type: "spring" as const,
  mass: 0.75,
  stiffness: 200,
  damping: 22,
  delay: 0.15,
};

const scaleConfig = {
  type: "spring" as const,
  mass: 0.75,
  stiffness: 200,
  damping: 22,
  delay: 0.15,
};

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useInterfaceContext();
  const { isVisible, setIsVisible, activePage } = useInterfaceContext();
  const { inputRef } = useNavContext();
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
        scale: scaleConfig,
        opacity: opacityConfig,
        visibility: {
          delay: 0.15,
        },
      };
      await animate(scope.current, animationConfig, transitionConfig);
    };
    animateMainContent();
  }, [isVisible, animate, scope]);

  // CMD + K to toggle interface
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

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef, setIsVisible]);

  // Double click to toggle interface
  useEffect(() => {
    const handleDoubleClick = () => {
      setIsVisible((prevIsVisible) => !prevIsVisible);
    };

    document.body.addEventListener("dblclick", handleDoubleClick);

    return () => {
      document.body.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [setIsVisible]);

  return (
    <>
      {/* Interface */}
      {user && activePage && MusicKit && <Interface isVisible={isVisible} />}

      {/* Feed */}
      <main
        ref={scope}
        id="main-content"
        className={`flex origin-center items-center justify-center`}
      >
        {children}
      </main>
    </>
  );
}
