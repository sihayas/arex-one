import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { PositiveIcon, NegativeIcon, HighlightsIcon } from "@/components/icons";

type sortOrder = "newest" | "positive" | "negative";

type AnimatedCircleProps = {
  onSortOrderChange: (newSortOrder: sortOrder) => void;
};

const AnimatedCircle = ({ onSortOrderChange }: AnimatedCircleProps) => {
  const controls = useAnimation();
  const [currentSortOrder, setCurrentSortOrder] = useState<sortOrder>("newest");
  const radius = 16 - 2.5 / 2;
  const strokeWidth = 1.5;
  const circumference = 2 * Math.PI * radius;

  // Update the sort order when the current sort order changes
  useEffect(() => {
    onSortOrderChange(currentSortOrder);
  }, [currentSortOrder, onSortOrderChange]);

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
      className="p-2 cursor-pointer origin-center"
    >
      <motion.div
        className="absolute"
        animate={{
          scale: currentSortOrder === "negative" ? 1 : 0,
          opacity: currentSortOrder === "negative" ? 1 : 0,
        }}
      >
        <NegativeIcon color={"#000"} />
      </motion.div>
      <motion.div
        className="absolute "
        animate={{
          scale: currentSortOrder === "positive" ? 1 : 0,
          opacity: currentSortOrder === "positive" ? 1 : 0,
        }}
      >
        <PositiveIcon color={"#000"} />
      </motion.div>
      <motion.div
        className="absolute"
        animate={{
          scale: currentSortOrder === "newest" ? 1 : 0,
          opacity: currentSortOrder === "newest" ? 1 : 0,
        }}
      >
        <HighlightsIcon color={"#000"} />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCircle;
