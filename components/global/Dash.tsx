import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Dash = ({
  width = "2px",
  color = "rgba(0, 0, 0, 0.05)",
  className = "",
  dotSize = "1",
  spaceBetween = "8",
}) => {
  const { isLoading } = useInterfaceContext();
  const controls = useAnimation();

  useEffect(() => {
    if (isLoading) {
      // Flashing orange when loading
      controls.start({
        stroke: ["#FFA500", "#FFA500"],
        opacity: [1, 0.5, 1],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          ease: "linear",
        },
      });
    } else {
      // Green for a second, then revert to normal
      controls.start({
        stroke: ["#A6FF47", color],
        transition: { duration: 1 },
      });
    }
  }, [isLoading, color, controls]);

  return (
    <svg
      className={className}
      style={{ width: width, height: "100%" }}
      preserveAspectRatio="none"
    >
      <motion.line
        x1="50%"
        y1="0"
        x2="50%"
        y2="100%"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={`${dotSize}, ${spaceBetween}`}
        strokeLinecap="round"
        animate={controls}
      />
    </svg>
  );
};

export default Dash;
