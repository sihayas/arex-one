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
}

const Heart: React.FC<HeartButtonProps> = ({
  handleHeartClick,
  hearted,
  className,
  heartCount,
  replyCount,
}) => {
  const [heartColor, setHeartColor] = useState(hearted ? "#FFF" : "#FFF");
  const [bubbleColor, setBubbleColor] = useState(hearted ? "#FF4DC9" : "#CCC");
  const controls = useAnimation();

  useEffect(() => {
    setHeartColor(hearted ? "#FFF" : "#FFF");
  }, [hearted]);

  const handleMouseEnter = () => {
    controls.start("hover").catch((error) => {
      // console.error("Hover animation failed", error);
    });
  };

  const handleMouseLeave = () => {
    controls.start("initial").catch((error) => {
      // console.error("Hover animation failed", error);
    });
  };

  return (
    <motion.button
      className={`${className} flex gap-1 p-2 -m-2`}
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

        {/* Tiny / Interaction Bubble*/}
        <motion.div
          initial={{
            scale: 2,
          }}
          style={{
            backgroundColor: bubbleColor,
            x: 8,
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
        className={`bg-[#F4F4F4] flex items-center text-gray2 rounded-full px-2 py-1`}
      >
        <p className={`font-medium text-sm leading-[9px]`}>{heartCount}</p>
        <div className={`w-0.5 h-0.5 bg-gray3 mx-1 rounded-full`} />
        <ChainIcon />
        <p className={`font-medium text-sm ml-2 leading-[9px]`}>{replyCount}</p>
      </div>
    </motion.button>
  );
};

export default Heart;
