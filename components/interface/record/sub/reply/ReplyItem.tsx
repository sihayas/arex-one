import React, { useState, useCallback } from "react";
import Image from "next/image";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { Reply } from "@/types/dbTypes";
import { StatLineIcon } from "@/components/icons";
import Dash from "@/components/global/Dash";

import RenderChildren from "@/components/interface/record/sub/reply/RenderChildren";
import { motion } from "framer-motion";
import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { useUser } from "@supabase/auth-helpers-react";
import Avatar from "@/components/global/Avatar";
import { v4 as uuidv4 } from "uuid";
import Heart from "@/components/global/Heart";

interface ReplyProps {
  reply: Reply;
  level: number;
  isChild: boolean;
  index: number;
}

export default function ReplyItem({
  reply,
  level,
  isChild,
  index,
}: ReplyProps) {
  const user = useUser();
  const { setReplyParent, replyParent } = useThreadcrumb();
  const [showChildReplies, setShowChildReplies] = useState<boolean>(false);

  const replyCount = reply._count ? reply._count.replies : 0;

  const handleReplyParent = useCallback(() => {
    setReplyParent(reply);
  }, [reply, setReplyParent]);

  const handleLoadReplies = useCallback(() => {
    setShowChildReplies(true);
  }, []);

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    reply.heartedByUser,
    reply._count.hearts,
    "/api/reply/post/",
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
  const reverseStatLine = isEvenLevel ? "" : "transform scale-x-[-1]";
  const maxWidth = isChild ? "max-w-[336px]" : "max-w-[376px]";
  const width = isChild ? "w-[336px]" : "w-[376px]";

  // Layout prop is what dictates animating the container to expand/contract when replies are loaded or unloaded. The parent/root is in Renderreplies.tsx
  return (
    <motion.div
      layout="position"
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
      className={`flex flex-col relative w-full pt-4 h-fit`}
    >
      {/* Main Reply */}
      <div className={`flex gap-2 items-end ${flexDirection}`}>
        <Avatar
          className="w-8 h-8 rounded-full border border-gray3"
          imageSrc={reply.author.image}
          altText={`${reply.author.username}'s avatar`}
          width={32}
          height={32}
          user={reply.author}
        />

        {/* Attribution & Content */}
        <div className={`flex flex-col gap-[6px] ${reverseAlignment} ${width}`}>
          <div className={`font-medium text-xs text-gray2 leading-[9px] px-3`}>
            {reply.author.username}
          </div>

          <div
            className={`relative bg-[#F4F4F4] px-[10px] pt-[6px] pb-[7px] w-fit rounded-[18px] overflow-visible mb-2`}
          >
            {/* Content  */}
            <motion.div
              whileHover={{ color: "rgba(0,0,0,1)" }}
              onClick={handleReplyParent}
              animate={{
                color:
                  replyParent === reply
                    ? "rgba(60, 60, 67, 0.9)"
                    : "rgba(60, 60, 67, 0.6)",
                scale: replyParent === reply ? 1.01 : 1,
              }}
              transition={{ duration: 0.24 }}
              className={`${maxWidth} text-sm break-words cursor-pointer`}
            >
              {reply.content}
            </motion.div>
            <Heart
              handleHeartClick={handleHeartClick}
              hearted={hearted}
              className={`absolute -bottom-1 z-20 ${
                isEvenLevel ? "-right-1" : "-left-1 transform scale-x-[-1]"
              }`}
              heartCount={heartCount}
              replyCount={reply._count.replies}
              isReply={true}
              isEvenLevel={isEvenLevel}
            />

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
        </div>

        {/* Fill Line */}
        {isChild && (
          <motion.div className="flex flex-col justify-center h-full mr-auto min-w-[32px]">
            <Line
              color={"#e5e5e6"}
              className={`flex flex-grow ml-auto mr-auto !w-[2px] rounded ${
                index === 0 && "-mt-3"
              }`}
            />
          </motion.div>
        )}
      </div>

      {/* Stats / More Replies */}
      {replyCount > 0 && (
        <div
          className={`min-h-[16px] flex flex-col relative w-full ${reverseAlignment}`}
        >
          {/* Create chain baseline for children fetched / Button to expand
           & collapse */}
          {showChildReplies ? (
            <div
              className={`absolute flex flex-col cursor-pointer h-full w-8 pt-1 items-center`}
            >
              <motion.div
                whileHover={{ scale: 1.25, backgroundColor: "rgb(255,94,0)" }}
                onClick={() => {
                  setShowChildReplies(false);
                }}
                className="min-w-[8px] min-h-[8px] rounded-full bg-[#e5e5e6] cursor-pointer z-30"
              />
              <Dash
                className={"flex flex-grow ml-auto mr-auto mb-8"}
                color={"#e5e5e6"}
              />
            </div>
          ) : (
            // Show curved stat-line if replies exist
            <div
              onClick={handleLoadReplies}
              className={`flex items-end w-fit cursor-pointer group gap-1 ${flexDirection}`}
            >
              <StatLineIcon color={"#CCC"} className={`${reverseStatLine}`} />
              {reply.replies?.map((childReply, index) => (
                <Image
                  key={index}
                  className={`outline outline-2 outline-white rounded-full transition-all ${
                    index !== 0 && "-ml-2"
                  }`}
                  src={
                    childReply.author.image ||
                    "/public/images/default-avatar.png"
                  }
                  alt={`${childReply.author.username}'s avatar`}
                  width={16}
                  height={16}
                />
              ))}
              <div className={`pl-2 text-xs text-gray2 leading-[16px]`}>
                {replyCount}
              </div>
            </div>
          )}

          {showChildReplies && (
            <RenderChildren
              key={uuidv4()}
              parentReplyId={reply.id}
              level={level + 1}
            />
          )}
        </div>
      )}
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
  height = "1px",
  width = "100%",
  color = "rgba(0, 0, 0, 0.1)",
  className = "",
  horizontal = false,
}) => (
  <div
    style={{
      ...(horizontal ? { width: height, height: width } : { height, width }),
      backgroundColor: color,
    }}
    className={className}
  />
);
