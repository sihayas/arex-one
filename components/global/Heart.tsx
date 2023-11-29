import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { LoveIcon, Curve } from "../icons";

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

const Heart: React.FC<HeartButtonProps> = ({
  handleHeartClick,
  hearted,
  className,
  heartCount,
  replyCount,
  isReply = false,
  isEvenLevel = true,
}) => {
  const [iconColor, setIconColor] = useState(hearted ? "#FF3319" : "#CCC");
  const [curveColor, setCurveColor] = useState(hearted ? "#FF3319" : "#E5E5E5");
  const controls = useAnimation();

  useEffect(() => {
    setIconColor(hearted ? "#FF3319" : "#CCC");
  }, [hearted]);

  // Change curve color
  const handleMouseEnter = () => {
    controls.start("hover");
    setCurveColor(hearted ? "#E5E5E5" : "#E5E5E5");
    setIconColor(hearted ? "#FF3319" : "#CCC");
  };

  // Change curve color
  const handleMouseLeave = () => {
    controls.start("initial");
    setCurveColor(hearted ? "#FF3319" : "#E5E5E5");
    setIconColor(hearted ? "#FF3319" : "#CCC");
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
        className={`absolute bg-white/80 backdrop-blur p-2 flex items-center rounded-full border-1 border-silver origin-bottom-right bottom-0 right-0`}
        animate={controls}
        initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
        variants={{
          hover: {
            scale: 1,
            opacity: 1,
            x: -8,
            y: -8,
          },
          initial: { scale: 0, x: -4, y: -4, opacity: 0 },
        }}
        transition={{ type: "tween", ease: "anticipate", duration: 0.45 }}
      >
        <LoveIcon color={iconColor} />
      </motion.div>
      <Curve
        color={curveColor}
        className={`absolute bottom-0 right-0 rotate-[6deg] transition-colors duration-500`}
      />
      {/*<div*/}
      {/*  className={`text-xs text-gray2 absolute -bottom-3 right-[8px] leading-[75%] flex`}*/}
      {/*>*/}
      {/*  {renderCounts()}*/}
      {/*</div>*/}
    </button>
  );
};

export default Heart;

// const renderCounts = () => {
//   if (isReply) {
//     return formatText(heartCount, "Heart", "Hearts");
//   } else if (heartCount && replyCount) {
//     return (
//         <>
//           {formatText(replyCount, "Chain", "Chains")}
//           &middot;
//           {formatText(heartCount, "Heart", "Hearts")}
//         </>
//     );
//   } else if (heartCount) {
//     return formatText(heartCount, "Heart", "Hearts");
//   } else if (replyCount) {
//     return formatText(replyCount, "Chain", "Chains");
//   }
//   return null;
// };
