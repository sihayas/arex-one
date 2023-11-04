import { Interface } from "./interface/Interface";
import React, { useEffect, ReactNode, useCallback, useRef } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";
import { useUser } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: ReactNode }) {
  const { isVisible, setIsVisible, pages } = useInterfaceContext();
  const { inputRef } = useNavContext();
  const mainContentRef = useRef<HTMLElement>(null);

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
      <motion.main
        ref={mainContentRef}
        id="main-content"
        className={`origin-top-left`}
        animate={{
          scale: isVisible ? 0.88 : 1,
          filter: isVisible
            ? "brightness(85%) blur(16px)"
            : "brightness(100%) blur(0px)",
          opacity: isVisible ? 0.15 : 1,
        }}
        transition={{
          filter: {
            duration: isVisible ? 0.25 : 0.3,
          },
          scale: {
            type: "spring",
            mass: 0.75,
            stiffness: 180,
            damping: 22,
          },
        }}
      >
        {children}
      </motion.main>
    </>
  );
}
