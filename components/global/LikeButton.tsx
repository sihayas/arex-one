import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { CrossIcon, LoveIcon } from "../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  liked: boolean;
  className?: string;
  likeCount?: number;
  replyCount?: number;
  isReply?: boolean;
  isEvenLevel?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  handleLikeClick,
  liked,
  className,
  likeCount,
  replyCount,
  isReply = false,
  isEvenLevel = true,
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
    plural: string
  ) => {
    if (count === 0) {
      return null;
    }
    return (
      <>
        <span className="gray2">{count}</span>&nbsp;
        {count === 1 ? singular : plural}
      </>
    );
  };

  const renderCounts = () => {
    if (isReply) {
      return formatText(likeCount, "Heart", "Hearts");
    } else if (likeCount && replyCount) {
      return (
        <>
          {formatText(replyCount, "Chain", "Chains")}
          <CrossIcon />
          {formatText(likeCount, "Heart", "Hearts")}
        </>
      );
    } else if (likeCount) {
      return formatText(likeCount, "Heart", "Hearts");
    } else if (replyCount) {
      return formatText(replyCount, "Chain", "Chains");
    }
    return null;
  };

  return (
    <button
      className={`${className}`}
      onClick={(event) => {
        handleLikeClick(event);
        event.stopPropagation();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon / Button */}
      <motion.div
        className={`absolute bg-[#E5E5E6] outline outline-4 outline-white p-2 flex items-center rounded-full  ${
          isEvenLevel
            ? "origin-bottom-right bottom-0 right-0"
            : "origin-bottom-left bottom-0 -left-1"
        }`}
        animate={controls}
        initial={{ scale: 0.2856, x: 0, y: 0, opacity: 0 }}
        variants={{
          hover: {
            scale: 1,
            x: isEvenLevel ? "-8px" : "0px",
            y: isEvenLevel ? "-8px" : "-8px",
            opacity: 1,
          },
          initial: { scale: 0.2856, x: 0, y: 0, opacity: 1 },
        }}
        transition={{ type: "tween", ease: "anticipate", duration: 0.5 }}
      >
        <LoveIcon color={color} />
      </motion.div>
      {/* Dot */}
      <div
        className="absolute bottom-0 right-0 w-2 h-2 rounded-full z-0 outline outline-4 outline-white "
        style={{ backgroundColor: dotColor }}
      />
      <div
        className={`text-xs text-gray2 absolute -bottom-3 right-[8px] leading-[75%] flex`}
      >
        {renderCounts()}
      </div>
    </button>
  );
};

export default LikeButton;
