import { Interface } from "./interface/Interface";
import React, { useEffect, ReactNode, useCallback, useRef } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";
import { useUser } from "@supabase/auth-helpers-react";
import { useAnimate } from "framer-motion";

export default function Layout({ children }: { children: ReactNode }) {
  const { isVisible, setIsVisible, pages } = useInterfaceContext();
  const { inputRef } = useNavContext();
  const mainContentRef = useRef<HTMLElement>(null);
  const [scope, animate] = useAnimate();

  const user = useUser();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        setIsVisible((prevIsVisible) => !prevIsVisible);
        event.preventDefault();
      } else if (event.key === "Escape") {
        if (inputRef && inputRef.current === document.activeElement) {
          inputRef.current?.blur();
        } else {
          setIsVisible(false);
        }
      }
    },
    [inputRef, setIsVisible],
  );

  // Modify this to animate the main content
  useEffect(() => {
    const animateMainContent = async () => {
      const animationConfig = {
        scale: isVisible ? 0.86 : 1,
        opacity: isVisible ? 0.5 : 1,
        filter: isVisible ? "blur(24px)" : "blur(0px)",
        pointerEvents: isVisible ? "none" : "auto",
      };
      const transitionConfig = {
        scale: {
          type: "spring" as const,
          mass: 0.75,
          stiffness: 200,
          damping: 22,
        },
        opacity: {
          duration: 0.5,
        },
      };
      await animate(scope.current, animationConfig, transitionConfig);
    };
    animateMainContent();
  }, [isVisible, animate, scope]);

  const handleDoubleClick = useCallback(() => {
    setIsVisible((prevIsVisible) => !prevIsVisible);
  }, [setIsVisible]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
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
  }, [handleKeyDown, handleDoubleClick]);

  return (
    <>
      {user && pages.length > 0 && (
        <div
          className={`${
            isVisible ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <Interface isVisible={isVisible} />
        </div>
      )}
      <main ref={scope} id="main-content" className={`origin-top-left`}>
        {children}
      </main>
    </>
  );
}
