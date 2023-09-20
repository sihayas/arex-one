import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { LoveIcon } from "../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  liked: boolean;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  handleLikeClick,
  liked,
  className,
}) => {
  const [color, setColor] = useState(liked ? "#000" : "#CCC");
  const [dotColor, setDotColor] = useState(liked ? "#000" : "#CCC");
  const controls = useAnimation();

  useEffect(() => {
    setColor(liked ? "#000" : "#CCC");
  }, [liked]);

  const handleMouseEnter = () => {
    controls.start("hover");
    setDotColor(liked ? "#CCC" : "#000");
  };

  const handleMouseLeave = () => {
    controls.start("initial");
    setDotColor(liked ? "#000" : "#CCC");
  };

  return (
    <button
      className={`${className} group`}
      onClick={(event) => {
        handleLikeClick(event);
        event.stopPropagation();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute bottom-0 right-0 w-4 h-4 border border-[2.5px] border-white rounded-full z-30"
        style={{ backgroundColor: dotColor }}
      />
      <motion.div
        className="absolute bottom-0 right-0 bg-[#E5E5E6] outline outline-[2.5px] outline-white p-2 flex items-center rounded-full origin-bottom-right"
        initial={{ scale: 0.5714, x: 0, y: 0 }}
        animate={controls}
        variants={{
          hover: { scale: 1, x: "-8px", y: "-8px" },
          initial: { scale: 0.5714, x: 0, y: 0 },
        }}
      >
        <LoveIcon color={color} />
      </motion.div>
    </button>
  );
};

export default LikeButton;
