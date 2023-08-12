import { CMDK } from "./cmdk/CmdK";
import React, { useEffect, ReactNode, useCallback, useRef } from "react";
import { useCMDK } from "@/context/CMDKContext";

export default function Layout({ children }: { children: ReactNode }) {
  const { isVisible, setIsVisible } = useCMDK();
  const mainContentRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      setIsVisible((prevIsVisible) => !prevIsVisible);
      event.preventDefault();
    } else if (event.key === "Escape") {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleDoubleClick = useCallback(() => {
    setIsVisible((prevIsVisible) => !prevIsVisible);
  }, []);

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
      <CMDK isVisible={isVisible} />
      <main
        ref={mainContentRef}
        id="main-content"
        className={`h-screen grid relative ${
          isVisible ? "animate-scale-down" : "animate-scale-up"
        }`}
      >
        {children}
      </main>
    </>
  );
}
