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
      className={`${className} -m-2 flex gap-1 p-2`}
      onClick={(event) => {
        handleHeartClick(event);
        event.stopPropagation();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={controls}
    >
      <div className={`flex h-8 w-7 flex-col will-change-transform`}>
        <div className={`relative h-7 w-7`}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            variants={{
              hover: {
                scale: 1,
                opacity: 1,
              },
              initial: { scale: 0, opacity: 0 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ transformOrigin: "bottom left" }}
          >
            <BubbleIcon color={bubbleColor} />
          </motion.div>

          <motion.div
            initial={{ scale: 0, x: "50%", y: "50%" }}
            variants={{
              hover: { scale: 1 },
              initial: { scale: 0.5 },
            }}
            className={`absolute left-0 top-0 origin-bottom-left`}
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
        className={`text-gray2 flex items-center rounded-full bg-[#F4F4F4] px-2 py-1`}
      >
        <p className={`text-sm font-medium leading-[9px]`}>{heartCount}</p>
        <div className={`bg-gray3 mx-1 h-0.5 w-0.5 rounded-full`} />
        <ChainIcon />
        <p className={`ml-2 text-sm font-medium leading-[9px]`}>{replyCount}</p>
      </div>
    </motion.button>
  );
};

export default Heart;
