import React, { useState, useCallback } from "react";
import Image from "next/image";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { Reply } from "@/types/dbTypes";
import Line from "@/components/interface/entry/sub/icons/Line";
import { StatLineIcon } from "@/components/icons";
import DashedLine from "@/components/interface/entry/sub/icons/DashedLine";

import RenderChildren from "@/components/interface/entry/sub/reply/RenderChildren";
import { motion } from "framer-motion";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";
import { useUser } from "@supabase/auth-helpers-react";
import UserAvatar from "@/components/global/UserAvatar";
import { v4 as uuidv4 } from "uuid";

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
  const replyChild = reply.replies?.[0];

  const handleReplyParent = useCallback(() => {
    setReplyParent(reply);
  }, [reply, setReplyParent]);

  const handleLoadReplies = useCallback(() => {
    setShowChildReplies(true);
  }, []);

  const { liked, handleLikeClick, likeCount } = useHandleLikeClick(
    reply.likedByUser,
    reply._count.likes,
    "/api/reply/post/like",
    "replyId",
    reply.id,
    user?.id
  );

  // Styles
  const isEvenLevel = level % 2 === 0;
  const flexDirection = isEvenLevel ? "flex-row" : "flex-row-reverse";
  const reverseAlignment = isEvenLevel ? "items-start" : "items-end";
  const borderRadius = isEvenLevel ? "rounded-bl-[4px]" : "rounded-br-[4px]";
  const reverseStatLine = isEvenLevel ? "" : "transform scale-x-[-1]";
  const maxWidth = isChild ? "max-w-[336px]" : "max-w-[376px]";
  const width = isChild ? "w-[336px]" : "w-[376px]";

  // Layout prop is what dictates animating the container to expand/contract when replies are loaded or unloaded. The parent/root is in Renderreplies.tsx
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      // exit={{ opacity: 0, scale: 0.8 }}
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
      className={`flex flex-col relative w-full pt-4`}
    >
      {/* Main Reply */}
      <div className={`flex gap-2 items-end ${flexDirection}`}>
        <UserAvatar
          className="w-8 h-8 rounded-full outline outline-1 outline-[#E5E5E6]"
          imageSrc={reply.author.image}
          altText={`${reply.author.username}'s avatar`}
          width={32}
          height={32}
          user={reply.author}
        />

        {/* Attribution & Content */}
        <div className={`flex flex-col gap-[6px] ${reverseAlignment} ${width}`}>
          <div className={`font-medium text-xs text-gray2 leading-[75%] px-3`}>
            {reply.author.username}
          </div>
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
            className={`${maxWidth} ${borderRadius} w-fit text-sm rounded-[20px] break-all bg-[#F4F4F4] px-3 py-[7px] leading-normal cursor-pointer`}
          >
            {reply.content}
          </motion.div>
        </div>

        {/* Fill Parent Dashed Line */}
        {isChild && (
          <motion.div className="flex flex-col justify-center h-full mr-auto w-8">
            <Line
              color={"#e5e5e6"}
              className={`flex flex-grow ml-auto mr-auto !w-[1.5px] ${
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
          {/* Create left side trace / baseline of children fetched or Button to load children / Collapse children */}
          {showChildReplies ? (
            <div
              className={`absolute flex flex-col cursor-pointer h-full w-8 pt-1 items-center`}
            >
              <motion.div
                whileHover={{ scale: 1.25, backgroundColor: "#FF0000" }}
                onClick={() => {
                  setShowChildReplies(false);
                }}
                className="w-2 h-2 rounded-full bg-[#e5e5e6] cursor-pointer z-30"
              />
              <DashedLine
                className={"flex flex-grow ml-auto mr-auto mb-8"}
                color={"#e5e5e6"}
              />
            </div>
          ) : (
            // Show curved stat-line if replies exist
            <div
              onClick={handleLoadReplies}
              className={`flex items-end w-fit cursor-pointer group ${flexDirection}`}
            >
              <StatLineIcon color={"#CCC"} className={`${reverseStatLine}`} />
              <Image
                className="outline outline-2 rounded-full group-hover:scale-125 transition"
                src={
                  replyChild?.author.image ||
                  "/public/images/default-avatar.png"
                }
                alt={`${reply.author.username}'s avatar`}
                width={16}
                height={16}
              />
              <div
                className={`px-2 text-xs text-gray2 leading-[16px] font-bold`}
              >
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
