import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { LoveIcon, BubbleIcon, ChainIcon } from "../icons";

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
  const [heartColor, setHeartColor] = useState(hearted ? "#FFF" : "#CCC");
  const [bubbleColor, setBubbleColor] = useState(hearted ? "#FF4DC9" : "#FFF");
  const controls = useAnimation();

  useEffect(() => {
    setHeartColor(hearted ? "#FFF" : "#CCC");
  }, [hearted]);

  // Change curve color
  const handleMouseEnter = () => {
    controls.start("hover");
  };

  // Change curve color
  const handleMouseLeave = () => {
    controls.start("initial");
  };

  return (
    <motion.button
      className={`${className} flex gap-1`}
      onClick={(event) => {
        handleHeartClick(event);
        event.stopPropagation();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={controls}
    >
      <div className={`flex flex-col w-7 h-8 will-change-transform`}>
        <div className={`relative w-7 h-7`}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            variants={{
              hover: {
                scale: 1,
                opacity: 1,
              },
              initial: { scale: 0, opacity: 0 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ transformOrigin: "bottom left" }}
          >
            <BubbleIcon color={bubbleColor} />
          </motion.div>

          <motion.div
            initial={{ scale: 0, x: "50%", y: "50%" }}
            variants={{
              hover: { scale: 1 },
              initial: { scale: 0 },
            }}
            className={`absolute top-0 left-0 origin-bottom-left`}
          >
            <LoveIcon color={heartColor} />
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 2 }}
          style={{
            backgroundColor: bubbleColor,
            x: 7,
            width: 4,
            height: 4,
            borderRadius: 4,
          }}
          variants={{
            hover: { scale: 1 },
            initial: { scale: 2 },
          }}
        />
      </div>

      <div
        className={`bg-[#F4F4F4] flex items-center text-gray2 rounded-full px-1.5 py-[3px] mt-1`}
      >
        <p className={`font-medium text-xs leading-[9px]`}>{heartCount}</p>
        <div className={`w-0.5 h-0.5 bg-gray3 mx-1 rounded-full`} />
        <ChainIcon />
        <p className={`font-medium text-xs leading-[9px] ml-2`}>{replyCount}</p>
      </div>
    </motion.button>
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
