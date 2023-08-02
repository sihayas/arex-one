import { CMDK } from "./cmdk/CmdK";
import React, { useEffect, ReactNode, useCallback } from "react";
import AnimatedGradient from "./cmdk/pages/album/subcomponents/AnimatedGradient";
import { useCMDK } from "@/context/CMDKContext";

export default function Layout({ children }: { children: ReactNode }) {
  const { isVisible, setIsVisible } = useCMDK();

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

  return (
    <>
      <CMDK isVisible={isVisible} />
      {/* <AnimatedGradient /> */}
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
