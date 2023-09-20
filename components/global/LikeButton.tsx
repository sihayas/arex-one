import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoveIcon } from "../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  liked: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  handleLikeClick,
  liked,
  className,
}) => {
  const [color, setColor] = useState(liked ? "#000" : "#CCC");

  // Update color when `liked` changes
  useEffect(() => {
    setColor(liked ? "#000" : "#CCC");
  }, [liked]);

  const variants = {
    hover: { scale: 1, x: "-8px", y: "-8px" },
    initial: { scale: 0.5714, x: 0, y: 0 },
  };

  return (
    <button
      className={`${className}`}
      onClick={(event) => {
        handleLikeClick(event);
        event.stopPropagation();
      }}
    >
      <div
        className="hover-wrapper"
        onMouseEnter={() => setColor(liked ? "#CCC" : "#000")}
        onMouseLeave={() => setColor(liked ? "#000" : "#CCC")}
      >
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#E5E5E6] outline outline-[2.5px] outline-white rounded-full pointer-events-none z-30" />
        <motion.div
          className="absolute bottom-0 right-0 bg-[#E5E5E6] outline outline-[2.5px] outline-white p-2 flex items-center rounded-full origin-bottom-right"
          initial="initial"
          whileHover="hover"
          variants={variants}
        >
          <LoveIcon color={color} />
        </motion.div>
      </div>
    </button>
  );
};

export default LikeButton;
