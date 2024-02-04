import React, { useState, useCallback } from "react";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyType } from "@/types/dbTypes";
import Children from "@/components/interface/artifact/render/Children";
import { motion } from "framer-motion";
import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/InterfaceContext";

interface ReplyProps {
  reply: ReplyType;
  level: number;
  isChild: boolean;
  index: number;
}

export default function Reply({ reply, level, isChild, index }: ReplyProps) {
  const { user } = useInterfaceContext();
  const { setReplyTarget, replyTarget } = useThreadcrumb();
  const { pages } = useInterfaceContext();
  const [showChildReplies, setShowChildReplies] = useState<boolean>(false);

  const activePage = pages[pages.length - 1];
  const replyCount = reply._count ? reply._count.replies : 0;

  const handleReplyParent = useCallback(() => {
    const artifact = activePage.artifact;
    if (artifact) {
      setReplyTarget({ artifact, reply });
    }
  }, [reply, setReplyTarget, activePage.artifact]);

  const url = reply.heartedByUser
    ? "/api/heart/delete/reply"
    : "/api/heart/post/reply";

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    reply.heartedByUser,
    reply._count.hearts,
    url,
    "replyId",
    reply.id,
    reply.author.id,
    user?.id,
  );

  // Styles
  const isEvenLevel = level % 2 === 0;
  const flexDirection = isEvenLevel ? "flex-row" : "flex-row-reverse";
  const reverseAlignment = isEvenLevel ? "items-start" : "items-end";
  const bubblePosition = isEvenLevel
    ? "-bottom-1 -left-1"
    : "-bottom-1 -right-1 transform scale-x-[-1]";
  const fillLinePosition = isEvenLevel ? "right-[14px]" : "left-[15px]";
  const dashLinePosition = isEvenLevel ? "left-0" : "right-0";

  // Layout prop is what dictates animating the container to expand/contract when
  // replies are loaded or unloaded. The parent/root is in Replies.tsx
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.2 + index * index * 0.05, ease: "easeInOut" },
        scale: {
          type: "spring",
          stiffness: 260,
          damping: 20,
          restSpeed: 0.01,
          restDelta: 0.01,
        },

        layout: {
          type: "spring",
          stiffness: 280,
          damping: 34,
          restSpeed: 0.01,
          restDelta: 0.01,
        },
      }}
      style={{
        originX: !isEvenLevel ? 1 : 0,
        willChange: "opacity, scale, transform",
      }}
      className={`relative flex h-fit w-full flex-col pt-4`}
    >
      {/* Main Reply */}
      <div className={`flex w-full items-end gap-3 ${flexDirection}`}>
        {/* Avatar & Collapse*/}
        <div className={`relative min-h-[32px] min-w-[32px] `}>
          <Avatar
            className="border-gray3 rounded-full border"
            imageSrc={reply.author.image}
            altText={`${reply.author.username}'s avatar`}
            width={32}
            height={32}
            user={reply.author}
          />
          {/* Collapse Dot */}
          {replyCount > 0 && (
            <div className={`center-x absolute -bottom-3 z-10 cursor-pointer`}>
              <motion.div
                animate={{
                  backgroundColor: showChildReplies
                    ? "#E9E9E9"
                    : "rgba(0,0,0,0)",
                  border: showChildReplies ? "none" : "1.5px solid #CCC",
                }}
                whileHover={{
                  scale: 1.5,
                  backgroundColor: showChildReplies ? "#CCC" : "#000",
                }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`h-[9px] w-[9px] rounded-full`}
              />
            </div>
          )}
        </div>

        {/* Attribution & Content */}
        <div
          className={`flex w-full flex-col gap-[3px] ${reverseAlignment} relative`}
        >
          <div
            className={`relative w-fit overflow-visible rounded-2xl bg-white outline outline-1 outline-[#E9E9E9] px-3 py-1.5 ${
              !isChild && "max-w-[332px]"
            }`}
          >
            {/* Content  */}
            <motion.div
              whileHover={{ color: "rgba(0,0,0,1)" }}
              onClick={handleReplyParent}
              animate={{
                color: replyTarget?.reply === reply ? "#FFF" : "#000",
                scale: replyTarget?.reply === reply ? 1.01 : 1,
              }}
              transition={{ duration: 0.24 }}
              className={`cursor-pointer break-words text-base`}
            >
              {reply.text}
            </motion.div>

            {/* Bubbles */}
            <div className={`absolute h-3 w-3 -z-10 ${bubblePosition}`}>
              <div
                className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white outline outline-1 outline-[#E9E9E9]`}
              />
              <div
                className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-white outline outline-1 outline-[#E9E9E9]`}
              />
            </div>
          </div>

          <div
            className={`text-gray2 translate-y-[3px] text-sm font-medium leading-[9px]`}
          >
            {reply.author.username}
          </div>

          {/* Fill Line | */}
          {!isChild && (
            <Line
              color={"#E9E9E9"}
              className={`absolute h-[calc(100%+24px)] -translate-y-[12px] !w-[3px] rounded ${fillLinePosition}
           `}
            />
          )}
        </div>
      </div>

      {/* Render Dash & Child Replies */}
      <div className={`mt-1.5 flex w-full flex-col ${flexDirection} relative`}>
        {showChildReplies && (
          <div
            className={`absolute flex h-full w-8 items-center justify-center ${dashLinePosition}`}
          >
            <svg
              style={{ width: 3, height: "100%" }}
              preserveAspectRatio="none"
            >
              <motion.line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke={"#E9E9E9"}
                strokeWidth={2}
                strokeDasharray={`${1}, ${8}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {showChildReplies && (
          <Children
            parentReplyId={reply.id}
            level={level + 1}
            isChild={false}
          />
        )}
      </div>
    </motion.div>
  );
}

const Line: React.FC<{
  height?: string;
  width?: string;
  color?: string;
  className?: string;
}> = ({
  width = "1px",
  height,
  color = "rgba(0, 0, 0, 0.1)",
  className = "",
}) => (
  <div
    style={{
      height,
      width,
      backgroundColor: color,
    }}
    className={className}
  />
);

// <Heart
//     handleHeartClick={handleHeartClick}
//     hearted={hearted}
//     className={`absolute -top-7 z-20 ${
//         isEvenLevel
//             ? "-right-[7px] transform scale-x-[-1]"
//             : "-left-1.5"
//     }`}
//     heartCount={heartCount}
//     replyCount={reply._count.replies}
//     isReply={true}
//     isEvenLevel={isEvenLevel}
// />
