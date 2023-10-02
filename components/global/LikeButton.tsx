import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { LoveIcon } from "../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  liked: boolean;
  className?: string;
  likeCount?: number;
  replyCount?: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  handleLikeClick,
  liked,
  className,
  likeCount,
  replyCount,
}) => {
  const [color, setColor] = useState(liked ? "#000" : "#FFF");
  const [dotColor, setDotColor] = useState(liked ? "#000" : "#CCC");
  const controls = useAnimation();

  useEffect(() => {
    setColor(liked ? "#000" : "#FFF");
  }, [liked]);

  const handleMouseEnter = () => {
    controls.start("hover");
    setDotColor(liked ? "#CCC" : "#000");
  };

  const handleMouseLeave = () => {
    controls.start("initial");
    setDotColor(liked ? "#000" : "#CCC");
  };

  const formatText = (
    count: number | undefined,
    singular: string,
    plural: string,
  ) => (
    <>
      {count === 0 ? "NO" : <span className="text-black">{count}</span>}&nbsp;
      {count === 1 ? singular : plural}
    </>
  );

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
      {/* Icon / Button */}
      <motion.div
        className="absolute bottom-0 right-0 bg-[#E5E5E6] outline outline-4 outline-white p-2 flex items-center rounded-full origin-bottom-right"
        animate={controls}
        initial={{ scale: 0.5714, x: 0, y: 0 }}
        variants={{
          hover: { scale: 1, x: "-10px", y: "-10px" },
          initial: { scale: 0.5714, x: 0, y: 0 },
        }}
      >
        <LoveIcon color={color} />
      </motion.div>
      {/* Dot */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 border-[2.5px] border-white rounded-full z-30"
        style={{ backgroundColor: dotColor }}
      />

      <div className="text-xs text-gray2 absolute -bottom-3 right-[8px] leading-[75%]">
        {formatText(likeCount, "HEART", "HEARTS")}&nbsp;:&nbsp;
        {formatText(replyCount, "CHAIN", "CHAINS")}
      </div>
    </button>
  );
};

export default LikeButton;
