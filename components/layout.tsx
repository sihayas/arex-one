import { Interface } from "./interface/Interface";
import React, { useEffect, ReactNode } from "react";
import { useInterfaceContext } from "@/context/Interface";
import { useNavContext } from "@/context/Nav";
import { motion, useAnimate } from "framer-motion";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useInterfaceContext();
  const { isVisible, setIsVisible, activePage } = useInterfaceContext();
  const { inputRef } = useNavContext();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animateMainContent = () => {
      const animationConfig = {
        scale: isVisible ? 0.9 : 1,
        pointerEvents: isVisible ? "none" : "auto",
        filter: isVisible ? "blur(12px)" : "blur(0px)",
      };
      const transitionConfig = {
        type: "spring" as const,
        duration: 0.5,
        bounce: 0.2,
        delay: isVisible ? 0 : 0.15,
      };
      animate(scope.current, animationConfig, transitionConfig);
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
      {user && activePage && <Interface />}

      {/* Feed */}
      <motion.main
        transformTemplate={template} // Prevent translateZ
        ref={scope}
        id="main-content"
        className={`flex origin-center items-center justify-center `}
      >
        {children}
      </motion.main>

      {/*System */}
      <motion.div
        className={`fixed top-4 left-4 flex-col flex items-start gap-2`}
      >
        <motion.button
          whileHover={{ opacity: 1, fontWeight: 600 }}
          className="opacity-75 text-white cursor-pointer uppercase text-sm tracking-widest"
        >
          privacy
        </motion.button>
        <motion.button
          whileHover={{ opacity: 1, fontWeight: 600 }}
          className="opacity-75 cursor-pointer uppercase text-sm tracking-widest text-white"
        >
          contact
        </motion.button>
        <Link href={`/diary`}>
          <motion.div
            whileHover={{ opacity: 1, fontWeight: 600 }}
            className="opacity-75 cursor-pointer uppercase text-sm tracking-widest text-white"
          >
            system diary
          </motion.div>
        </Link>
      </motion.div>
    </>
  );
}

function template({ x, y, scale }: { x: number; y: number; scale: number }) {
  // Assuming x and y are percentages and scale is a unit-less number
  return `scale(${scale})`;
}
