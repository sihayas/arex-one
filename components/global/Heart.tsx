import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { LoveIcon, ReplyIcon } from "../icons";
import { EntryExtended } from "@/types/global";
import { useInterfaceContext } from "@/context/Interface";

interface HeartButtonProps {
  entry: EntryExtended;
  className?: string;
  isMirrored?: boolean; // For use with sub-replies
}

const Heart: React.FC<HeartButtonProps> = ({
  entry,
  className,
  isMirrored,
}) => {
  const [hearted, setHearted] = useState(entry.heartedByUser);
  const [heartCount, setHeartCount] = useState(entry.actions_count);
  const [heartColor, setHeartColor] = useState(hearted ? "#FFF" : "#999");
  const [bubbleColor, setBubbleColor] = useState(
    hearted ? "#FF4DC9" : "#E5E5E5",
  );
  const controls = useAnimation();

  const { user } = useInterfaceContext();
  const heart = async () => {
    if (!user) return;
    const apiUrl = entry.heartedByUser
      ? "/api/action/delete/"
      : "/api/action/post/";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "heart",
          target: "entry",
          targetId: entry.id,
          authorId: entry.author.id,
          userId: user.id,
        }),
      });
      if (response.ok) {
        setHearted(!hearted);
        setHeartCount(hearted ? heartCount - 1 : heartCount + 1);
        setBubbleColor(hearted ? "#E5E5E5" : "#FF4DC9");
        setHeartColor(hearted ? "#999" : "#FFF");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMouseEnter = () => {
    controls.start("hover").catch((error) => {});
  };
  const handleMouseLeave = () => {
    controls.start("initial").catch((error) => {});
  };

  return (
    <motion.button
      className={`${className} -m-2 flex gap-1 p-2 cursor-default`}
      onClick={(event) => {
        heart();
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
              hover: { scale: 1, opacity: 1 },
              initial: { scale: 0, opacity: 0 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ transformOrigin: "bottom left" }}
          >
            <BubbleIcon color={bubbleColor} />
          </motion.div>

          <motion.div
            initial={{ scale: 0, x: "50%", y: "50%" }}
            variants={{ hover: { scale: 1 }, initial: { scale: 0.0 } }}
            className={`absolute left-0 top-0 origin-bottom-left`}
          >
            <LoveIcon color={heartColor} />
          </motion.div>
        </div>

        {/* Tiny / Interaction Bubble*/}
        <motion.div
          initial={{ scale: 1 }}
          style={{
            backgroundColor: bubbleColor,
            x: 8,
            width: 4,
            height: 4,
            borderRadius: 4,
          }}
          variants={{ hover: { scale: 1 }, initial: { scale: 1 } }}
        />
      </div>

      <motion.div
        initial={{ translateX: isMirrored ? 12 : -12 }}
        variants={{
          hover: { translateX: 0 },
          initial: { translateX: isMirrored ? 12 : -12 },
        }}
        className={`text-gray2 flex items-center rounded-full bg-[#E5E5E5] px-2 py-1 ${
          isMirrored ? "-scale-x-[1]" : ""
        }`}
      >
        <p className={`text-sm font-medium leading-[9px]`}>{heartCount}</p>
        <div className={`bg-gray2 mx-1 h-0.5 w-0.5 rounded-full`} />
        <ReplyIcon color={"#999"} className={`scale-75`} />
        <p className={`ml-1 text-sm font-medium leading-[9px]`}>
          {entry.chains_count}
        </p>
      </motion.div>
    </motion.button>
  );
};

export default Heart;

function BubbleIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      fill="none"
      {...props}
    >
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M14 28c7.732 0 14-6.268 14-14S21.732 0 14 0 0 6.268 0 14c0 2.434.621 4.723 1.714 6.717a4 4 0 1 0 5.569 5.569A13.937 13.937 0 0 0 14 28Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
