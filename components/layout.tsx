import { Interface } from "./interface/Interface";
import React, { useEffect, ReactNode, useCallback, useRef } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useSession } from "next-auth/react";
import { LayoutGroup } from "framer-motion";

export default function Layout({ children }: { children: ReactNode }) {
  const { isVisible, setIsVisible, inputRef, pages } = useInterfaceContext();
  const mainContentRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleDoubleClick = useCallback(() => {
    setIsVisible((prevIsVisible) => !prevIsVisible);
  }, [setIsVisible]);

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
    <LayoutGroup>
      {session && pages.length > 0 && (
        <div
          className={`${
            isVisible ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <Interface isVisible={isVisible} />
        </div>
      )}
      <main
        ref={mainContentRef}
        id="main-content"
        className={` ${isVisible ? "animate-scale-down" : "animate-scale-up"}`}
      >
        {children}
      </main>
    </LayoutGroup>
  );
}
