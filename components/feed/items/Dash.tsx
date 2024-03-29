import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInterfaceContext } from "@/context/Interface";

const Dot = ({
  index,
  controls,
  initialColor,
}: {
  index: number;
  controls: any;
  initialColor: string;
}) => (
  <motion.div
    custom={index}
    animate={controls}
    style={{
      width: "4px",
      height: "4px",
      margin: "4px 0",
      borderRadius: "50%",
      backgroundColor: initialColor,
    }}
  />
);

const Dash = ({ color = "rgba(0, 0, 0, 0.05)", className = "" }) => {
  const { isLoading } = useInterfaceContext();
  const controls = useAnimation();
  const [dots, setDots] = useState([]);

  // Dieter Rams orange color
  const dieterRamsOrange = "#f5a623";

  useEffect(() => {
    if (isLoading) {
      // Start or continue the animation when isLoading is true
      controls.start((i) => ({
        scale: [1, 1.5, 1],
        backgroundColor: [color, dieterRamsOrange, color],
        transition: {
          delay: i * 0.05,
          duration: 0.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
      }));
    } else {
      // Smoothly transition the animation to stop when isLoading is false
      controls.start({
        scale: 1,
        backgroundColor: ["#70FF00", color],
        transition: { duration: 0.5, ease: "linear" },
      });
    }
  }, [isLoading, controls, dots.length, color]);

  useEffect(() => {
    const calculateDots = () => {
      const dotSize = 4;
      const gap = 8; // Space between dots
      const totalSize = dotSize + gap;
      const viewportHeight = window.innerHeight;
      const numberOfDots = Math.floor(viewportHeight / totalSize);
      setDots(Array.from({ length: numberOfDots }));
    };

    calculateDots();
    window.addEventListener("resize", calculateDots);
    return () => window.removeEventListener("resize", calculateDots);
  }, []);

  return (
    <div
      className={`${className} dots-container`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
    >
      {dots.map((_, index) => (
        <Dot
          key={index}
          index={index}
          controls={controls}
          initialColor={color}
        />
      ))}
    </div>
  );
};

export default Dash;
