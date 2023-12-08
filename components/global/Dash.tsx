import React from "react";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Dash = ({
  width = "2px",
  color = "rgba(0, 0, 0, 0.05)",
  className = "",
  dotSize = "1",
  spaceBetween = "8",
}) => {
  const { isLoading } = useInterfaceContext();
  const lineAnimation = isLoading
    ? {
        stroke: ["#A6FF47", "#A6FF47"],
        opacity: [1, 0.5, 1],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          ease: "linear",
        },
      }
    : {};

  return (
    <svg
      className={className}
      style={{ width: width, height: "100%", zIndex: -10 }}
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
        animate={lineAnimation}
      />
    </svg>
  );
};

export default Dash;
