import { CMDK } from "./cmdk/CmdK";
import React, { useEffect, useState, ReactNode, useCallback } from "react";
import useContentControl from "../hooks/useContentControl";
import AnimatedGradient from "./cmdk/AnimatedGradient";
import { useCMDK } from "@/context/CMDKContext";

export default function Layout({ children }: { children: ReactNode }) {
  const { isContentBlurred, setIsContentBlurred } = useContentControl();
  const [isVisible, setIsVisible] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        setIsVisible((prevIsVisible) => !prevIsVisible);
        setIsContentBlurred((prevIsContentBlurred) => !prevIsContentBlurred);
        event.preventDefault();
      } else if (event.key === "Escape") {
        setIsVisible(false);
        setIsContentBlurred(false);
      }
    },
    [setIsContentBlurred]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <CMDK isVisible={isVisible} />
      <AnimatedGradient />
      <main
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

// Un-render the CMDK component when it's not visible
// const cmdkStyle: React.CSSProperties = isVisible ? {} : { display: "none" };
