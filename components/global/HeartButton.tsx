import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { CrossIcon, LoveIcon } from "../icons";

interface HeartButtonProps {
  handleHeartClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  hearted: boolean;
  className?: string;
  heartCount?: number;
  replyCount?: number;
  isReply?: boolean;
  isEvenLevel?: boolean;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  handleHeartClick,
  hearted,
  className,
  heartCount,
  replyCount,
  isReply = false,
  isEvenLevel = true,
}) => {
  const [color, setColor] = useState(hearted ? "#000" : "#FFF");
  const [dotColor, setDotColor] = useState(hearted ? "#000" : "#CCC");
  const controls = useAnimation();

  useEffect(() => {
    setColor(hearted ? "#000" : "#FFF");
  }, [hearted]);

  const handleMouseEnter = () => {
    controls.start("hover");
    setDotColor(hearted ? "#CCC" : "#000");
  };

  const handleMouseLeave = () => {
    controls.start("initial");
    setDotColor(hearted ? "#000" : "#CCC");
  };

  const formatText = (
    count: number | undefined,
    singular: string,
    plural: string,
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
      return formatText(heartCount, "Heart", "Hearts");
    } else if (heartCount && replyCount) {
      return (
        <>
          {formatText(replyCount, "Chain", "Chains")}
          <CrossIcon />
          {formatText(heartCount, "Heart", "Hearts")}
        </>
      );
    } else if (heartCount) {
      return formatText(heartCount, "Heart", "Hearts");
    } else if (replyCount) {
      return formatText(replyCount, "Chain", "Chains");
    }
    return null;
  };

  return (
    <button
      className={`${className}`}
      onClick={(event) => {
        handleHeartClick(event);
        event.stopPropagation();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon / Button */}
      <motion.div
        className={`absolute bg-[#E5E5E6] p-2 flex items-center rounded-full border-[.5px] border-silver  ${
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
            boxShadow:
              "0px 2px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 6px 0px rgba(0, 0, 0, 0.02)",
          },
          initial: { scale: 0.2856, x: 0, y: 0, opacity: 1 },
        }}
        transition={{ type: "tween", ease: "anticipate", duration: 0.5 }}
      >
        <LoveIcon color={color} />
      </motion.div>
      {/* Dot */}
      <div
        className="absolute bottom-0 right-0 w-2 h-2 rounded-full z-0 outline outline-white outline-4"
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

export default HeartButton;
