import React, { useState, useCallback } from "react";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyType } from "@/types/dbTypes";
import Children from "@/components/interface/artifact/render/Children";
import { motion } from "framer-motion";
import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { CurveIcon, LoopIcon } from "@/components/icons";
import Image from "next/image";

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
    const artifact = activePage.artifact?.data;

    if (artifact) {
      if (replyTarget?.reply === reply) {
        setReplyTarget({ artifact, reply: null });
      } else {
        setReplyTarget({ artifact, reply });
      }
    }
  }, [reply, setReplyTarget, activePage.artifact, replyTarget?.reply]);

  const url = reply.heartedByUser
    ? "/api/reply/delete/heart"
    : "/api/reply/post/heart";

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
  const isEven = level % 2 === 0;
  const flexDirection = isEven ? "flex-row" : "flex-row-reverse";
  const reverseAlignment = isEven ? "ml-3" : "mr-3";
  const bubblePosition = isEven
    ? "-bottom-1 -left-1"
    : "-bottom-1 -right-1 transform scale-x-[-1]";

  const dashLinePosition = isEven ? "right-0" : "left-0";

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
        originX: !isEven ? 1 : 0,
        willChange: "opacity, scale, transform",
      }}
      className={`relative flex h-fit w-full flex-col`}
    >
      {/* Main Reply */}
      <div className={`flex w-full items-end ${flexDirection}`}>
        {/* Avatar & Collapse*/}
        <div
          className={`relative flex h-full flex-col items-center justify-end`}
        >
          {/* Fill Line | */}
          {!isChild && (
            <div className="z-10 h-full w-1 rounded-tl-lg rounded-tr-lg bg-[#CCC]" />
          )}

          <Avatar
            className="border-silver mt-auto min-h-[32px] min-w-[32px] rounded-full border"
            imageSrc={reply.author.image}
            altText={`${reply.author.username}'s avatar`}
            width={32}
            height={32}
            user={reply.author}
          />
        </div>

        {/* Text Bubble */}
        <div
          className={`relative mb-3 flex w-full items-end justify-between ${reverseAlignment} ${flexDirection}  ${
            showChildReplies ? "mt-8" : ""
          }`}
        >
          <motion.div
            className={`relative w-fit max-w-[322px] overflow-visible rounded-[18px] bg-white px-3 py-1.5`}
          >
            {/* Content  */}
            <motion.div
              whileHover={
                replyTarget?.reply === reply
                  ? { color: "#CCC" }
                  : { color: "#7AFF00" }
              }
              onClick={handleReplyParent}
              animate={{
                color: replyTarget?.reply === reply ? "#7AFF00" : "#000",
                scale: replyTarget?.reply === reply ? 1.01 : 1,
              }}
              transition={{ duration: 0.24 }}
              className={`text-gray cursor-pointer break-words text-base`}
            >
              {reply.text}
            </motion.div>

            {/* Bubbles */}
            <div className={`absolute -z-10 h-3 w-3 ${bubblePosition}`}>
              <div
                className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white`}
              />
              <div
                className={`absolute bottom-0 left-0 h-1 w-1 rounded-full bg-white`}
              />
            </div>
          </motion.div>

          {/* Collapse Dot / Curve */}
          {replyCount > 0 && (
            <>
              {!showChildReplies && (
                <motion.div
                  whileHover={{
                    scale: 1.5,
                    backgroundColor: showChildReplies ? "#CCC" : "#000",
                  }}
                  onClick={() => setShowChildReplies((prev) => !prev)}
                  className={`center-y bg-gray3 absolute h-3 w-3 cursor-pointer rounded-full ${
                    isEven ? "right-12" : "left-12"
                  }`}
                />
              )}

              {showChildReplies && (
                <div
                  onClick={() => setShowChildReplies((prev) => !prev)}
                  className={`absolute cursor-pointer ${
                    isEven ? "right-[14px] -scale-x-[1]" : "left-[14px] top-1/2"
                  }`}
                >
                  <CurveIcon />
                  <div className="absolute -z-10 h-4 w-1 -translate-y-1 rounded-tl-lg rounded-tr-lg bg-[#F6F6F6]" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Render Dash & Child Replies */}
      <div className={`relative flex w-full flex-col ${flexDirection}`}>
        {showChildReplies && (
          <div
            className={`absolute -z-10 flex h-full w-8 items-center justify-center ${dashLinePosition}`}
          >
            <div className="z-10 h-full w-1 rounded bg-[#E9E9E9]" />
          </div>
        )}

        {showChildReplies && (
          <div className={`flex w-full flex-col ${showChildReplies && "mb-8"}`}>
            <Children
              parentReplyId={reply.id}
              level={level + 1}
              isChild={false}
            />
          </div>
        )}

        {/* If this reply's level is 2 or greater, add a loop with the Avatar of the parent at the end of the chain of children */}
        {level > 1 && showChildReplies && (
          <div
            className={`relative flex w-full items-center gap-2 pb-8
            ${
              isEven ? "justify-start pl-[14px]" : "flex-row-reverse pr-[14px]"
            }`}
          >
            <div className="absolute z-10 h-full w-1 translate-y-9 rounded bg-[#CCC]" />
            <LoopIcon className={`${!isEven && "-scale-x-[1]"}`} />
            <Image
              className="border-silver rounded-full border"
              src={reply.replyTo!.author.image}
              alt={`${reply.replyTo!.author.username}'s avatar`}
              width={24}
              height={24}
            />
            <p className="text-gray2 line-clamp-2 max-w-[302px] text-xs">
              {reply.replyTo?.text}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

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
