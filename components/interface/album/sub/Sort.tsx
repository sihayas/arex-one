import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PositiveIcon, NegativeIcon, FireIcon } from "@/components/icons";
import { SortOrder } from "@/components/interface/album/Album";

type SortProps = {
  onSortOrderChange: (newSortOrder: SortOrder) => void;
};

const Sort = ({ onSortOrderChange }: SortProps) => {
  const [currentSortOrder, setCurrentSortOrder] = useState<SortOrder>("newest");

  // Update the sort order when the current sort order changes
  useEffect(() => {
    onSortOrderChange(currentSortOrder);
  }, [currentSortOrder, onSortOrderChange]);

  const handleIconClick = () => {
    setCurrentSortOrder((prev) => {
      switch (prev) {
        case "newest":
          return "ablaze";
        case "ablaze":
          return "positive";
        case "positive":
          return "critical";
        default:
          return "newest";
      }
    });
  };

  return (
    <motion.div
      onClick={handleIconClick}
      whileHover={{
        scale: 1.25,
      }}
      className="p-2 cursor-pointer origin-center w-8 h-8 outline outline-1 outline-silver drop-shadow rounded-full "
    >
      <motion.div
        className="absolute"
        animate={{
          scale: currentSortOrder === "critical" ? 1 : 0,
          opacity: currentSortOrder === "critical" ? 1 : 0,
        }}
      >
        <NegativeIcon color={"#000"} />
      </motion.div>
      <motion.div
        className="absolute"
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
        <FireIcon color={"#000"} />
      </motion.div>
    </motion.div>
  );
};

export default Sort;
