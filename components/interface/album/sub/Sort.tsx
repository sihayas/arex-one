import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { PositiveIcon, NegativeIcon, HighlightsIcon } from "@/components/icons";

type sortOrder = "newest" | "positive" | "negative";

type SortChangeProps = {
  onSortOrderChange: (newSortOrder: sortOrder) => void;
};

const SortChange = ({ onSortOrderChange }: SortChangeProps) => {
  const [currentSortOrder, setCurrentSortOrder] = useState<sortOrder>("newest");

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

export default SortChange;
