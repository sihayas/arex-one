import React, { useState, useCallback } from "react";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyType } from "@/types/dbTypes";

import RenderChildren from "@/components/interface/artifact/sub/RenderChildren";
import { motion } from "framer-motion";
import useHandleHeartClick from "@/hooks/useHeart";
import { useUser } from "@supabase/auth-helpers-react";
import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import { useInterfaceContext } from "@/context/InterfaceContext";

interface ReplyProps {
  reply: ReplyType;
  level: number;
  isChild: boolean;
  index: number;
}

export default function Reply({ reply, level, isChild, index }: ReplyProps) {
  const user = useUser();
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
  const fillLinePosition = isEvenLevel ? "right-[15px]" : "left-[15px]";
  const dashLinePosition = isEvenLevel ? "left-0" : "right-0";

  // Layout prop is what dictates animating the container to expand/contract when
  // replies are loaded or unloaded. The parent/root is in RenderReplies.tsx
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
      className={`flex flex-col w-full pt-4 h-fit relative`}
    >
      {/* Main Reply */}
      <div className={`flex gap-3 w-full items-end ${flexDirection}`}>
        {/* Avatar & Collapse*/}
        <div className={`relative min-w-[32px] min-h-[32px] `}>
          <Avatar
            className="rounded-full border border-gray3"
            imageSrc={reply.author.image}
            altText={`${reply.author.username}'s avatar`}
            width={32}
            height={32}
            user={reply.author}
          />
          {/* Collapse Dot */}
          {replyCount > 0 && (
            <div className={`absolute cursor-pointer center-x -bottom-3 z-10`}>
              <motion.div
                animate={{
                  backgroundColor: showChildReplies ? "#CCC" : "transparent",
                  border: showChildReplies ? "none" : "1.5px solid #CCC",
                }}
                whileHover={{
                  scale: 1.25,
                  backgroundColor: showChildReplies ? "transparent" : "#000",
                  border: showChildReplies ? "1.5px solid black" : "none",
                }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`w-[9px] h-[9px] rounded-full`}
              />
            </div>
          )}
        </div>

        {/* Attribution & Content */}
        <div
          className={`flex flex-col gap-[3px] w-full ${reverseAlignment} relative`}
        >
          <div
            className={`relative bg-[#F4F4F4] px-3 py-1.5 w-fit rounded-2xl overflow-visible ${
              !isChild && "max-w-[380px]"
            }`}
          >
            {/* Content  */}
            <motion.div
              whileHover={{ color: "rgba(0,0,0,1)" }}
              onClick={handleReplyParent}
              animate={{
                color:
                  replyTarget?.reply === reply
                    ? "rgba(60, 60, 67, 0.9)"
                    : "rgba(60, 60, 67, 0.6)",
                scale: replyTarget?.reply === reply ? 1.01 : 1,
              }}
              transition={{ duration: 0.24 }}
              className={`text-base break-words cursor-pointer`}
            >
              {reply.text}
            </motion.div>

            {/* Bubbles */}
            <div className={`w-3 h-3 absolute ${bubblePosition}`}>
              <div
                className={`bg-[#F4F4F4] w-2 h-2 absolute top-0 right-0 rounded-full`}
              />
              <div
                className={`bg-[#F4F4F4] w-1 h-1 absolute bottom-0 left -0 rounded-full`}
              />
            </div>
          </div>

          <div
            className={`font-medium text-sm text-gray2 leading-[9px] translate-y-[3px]`}
          >
            {reply.author.username}
          </div>

          {/* Fill Line | */}
          {!isChild && (
            <Line
              color={"#CCC"}
              className={`!w-[2px] rounded h-full absolute ${fillLinePosition}
           `}
            />
          )}
        </div>
      </div>

      {/* Render Dash & Child Replies */}
      <div className={`flex flex-col mt-1.5 w-full ${flexDirection} relative`}>
        {showChildReplies && (
          <div
            className={`absolute w-8 flex items-center justify-center h-full ${dashLinePosition}`}
          >
            <svg
              style={{ width: 2, height: "100%" }}
              preserveAspectRatio="none"
            >
              <motion.line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke={"rgba(0,0,0,0.1)"}
                strokeWidth={2}
                strokeDasharray={`${1}, ${8}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {showChildReplies && (
          <RenderChildren
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
  horizontal?: boolean;
}> = ({
  width = "1px",
  height = "100%",
  color = "rgba(0, 0, 0, 0.1)",
  className = "",
  horizontal = false,
}) => (
  <div
    style={{
      ...(horizontal ? { width, height } : { height, width }),
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
