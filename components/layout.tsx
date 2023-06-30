import NavBar from "./random-bullshit-go/Nav";
import React, { useEffect, useState, ReactNode, useCallback } from "react";
import { CMDK } from "./cmdk/CmdK";
import useContentControl from "../hooks/useContentControl";

export default function Layout({ children }: { children: ReactNode }) {
  const { isContentBlurred, setIsContentBlurred } = useContentControl();
  const [isVisible, setIsVisible] = useState(false);

  // Un-render the CMDK component when it's not visible
  // const cmdkStyle: React.CSSProperties = isVisible ? {} : { display: "none" };

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

  //Listen for key strokes
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <CMDK isVisible={isVisible} />
      <main id="main-content" className="h-screen grid">
        {children}
      </main>
      <NavBar />
    </>
  );
}
