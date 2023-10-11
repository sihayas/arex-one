import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { PositiveIcon, NegativeIcon, HighlightsIcon } from "@/components/icons";

type sortOrder = "newest" | "positive" | "negative";

type AnimatedCircleProps = {
  onSortOrderChange: (newSortOrder: sortOrder) => void;
  expanded: boolean;
};

const AnimatedCircle = ({
  onSortOrderChange,
  expanded,
}: AnimatedCircleProps) => {
  const controls = useAnimation();
  const [currentSortOrder, setCurrentSortOrder] = useState<sortOrder>("newest");
  const radius = 16 - 2.5 / 2;
  const strokeWidth = 1.5;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    onSortOrderChange(currentSortOrder);
  }, [currentSortOrder, onSortOrderChange]);

  useEffect(() => {
    controls.start({
      strokeDashoffset: expanded ? circumference * 0.75 : circumference * 0.25,
      rotate: expanded ? -90 : 0,
    });
  }, [expanded, controls, circumference]);

  const handleIconClick = () => {
    // Cycle through sort orders on each click
    setCurrentSortOrder((prev) => {
      switch (prev) {
        case "newest":
          return "positive";
        case "positive":
          return "negative";
        case "negative":
          return "newest";
        default:
          return "newest";
      }
    });
  };

  return (
    <motion.div
      onClick={handleIconClick}
      className="relative h-8 w-8"
      style={{ transform: "scaleX(-1)" }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ cursor: "pointer", transform: "rotate(-90deg)" }}
        className="relative"
      >
        <motion.circle
          initial={{ strokeDashoffset: circumference * 0.25 }}
          animate={controls}
          cx="16" // Center the circle at 16, 16
          cy="16"
          r={radius}
          stroke="#CCC"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <motion.div
        className="absolute top-[6px] left-[2px]"
        animate={{ scale: currentSortOrder === "negative" ? 1 : 0 }}
      >
        <NegativeIcon />
      </motion.div>
      <motion.div
        className="absolute top-[2px] left-[2px]"
        animate={{ scale: currentSortOrder === "positive" ? 1 : 0 }}
      >
        <PositiveIcon />
      </motion.div>
      <motion.div
        className="absolute top-0 left-0"
        animate={{ scale: currentSortOrder === "newest" ? 1 : 0 }}
      >
        <HighlightsIcon />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCircle;
