import { Interface } from "./interface/Interface";
import React, { useEffect, ReactNode } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";

import { motion, useAnimate } from "framer-motion";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useInterfaceContext();
  const { isVisible, setIsVisible, activePage } = useInterfaceContext();
  const { inputRef } = useNavContext();
  const [scope, animate] = useAnimate();

  const handleLogout = async () => {
    // Make a POST request to the logout API endpoint
    const response = await fetch("/api/oauth/apple/logout", {
      method: "POST",
    });
    // Handle the response, e.g., redirect to home
    if (response.ok) {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const animateMainContent = () => {
      const animationConfig = {
        scale: isVisible ? 0.9 : 1,
        pointerEvents: isVisible ? "none" : "auto",
        opacity: isVisible ? 0 : 1,
      };
      const transitionConfig = {
        scale: {
          type: "spring" as const,
          mass: 0.75,
          stiffness: 200,
          damping: 22,
          delay: isVisible ? 0 : 0.15,
        },
        opacity: {
          type: "spring" as const,
          stiffness: 400,
          damping: 22,
          delay: isVisible ? 0 : 0.15,
        },
      };
      animate(scope.current, animationConfig, transitionConfig);
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
      {user && activePage && <Interface isVisible={isVisible} />}

      {/* Feed */}
      <main
        ref={scope}
        id="main-content"
        className={`flex origin-center items-center justify-center`}
      >
        {children}
      </main>

      {/* System */}
      <motion.div
        className={`fixed bottom-8 left-8 flex-col flex items-start gap-2`}
      >
        <motion.button
          whileHover={{
            opacity: 1,
            fontWeight: 600,
          }}
          className="text-black opacity-50 cursor-pointer uppercase text-sm tracking-widest"
        >
          ethos
        </motion.button>

        <motion.button
          whileHover={{
            opacity: 1,
            fontWeight: 600,
          }}
          className="text-black opacity-50 cursor-pointer uppercase text-sm tracking-widest"
        >
          contact
        </motion.button>

        {/* System Interactions */}
        {user && (
          <motion.button
            whileHover={{
              opacity: 1,
              fontWeight: 600,
            }}
            className="text-[#FF0000] opacity-50  cursor-pointer uppercase text-sm tracking-widest"
            onClick={handleLogout}
          >
            disconnect
          </motion.button>
        )}

        <motion.button
          whileHover={{
            opacity: 1,
            fontWeight: 600,
          }}
          className="text-black opacity-50 cursor-pointer uppercase text-sm tracking-widest"
        >
          privacy & safety
        </motion.button>
      </motion.div>
    </>
  );
}
