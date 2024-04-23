import React, { useState, useCallback } from "react";

import Children from "@/components/interface/entry/render/Children";
import { AnimatePresence, motion } from "framer-motion";

import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/Interface";
import { LoopIcon, TinyCurveIcon } from "@/components/icons";
import Image from "next/image";
import Heart from "@/components/global/Heart";
import { useNavContext } from "@/context/Nav";
import { EntryExtended } from "@/types/global";

interface ReplyProps {
  // @ts-ignore
  reply: ReplyType;
  level: number;
  isChild: boolean;
  index: number;
}

export default function Reply({ reply, level, isChild, index }: ReplyProps) {
  const { setReplyTarget, replyTarget } = useNavContext();
  const { pages } = useInterfaceContext();
  const [showChildReplies, setShowChildReplies] = useState<boolean>(false);

  const activePage = pages[pages.length - 1];
  const replyCount = reply._count ? reply._count.replies : 0;

  const handleReplyParent = useCallback(() => {
    const entry = activePage.data;

    if (entry) {
      if (replyTarget?.reply === reply) {
        setReplyTarget({ entry, reply: null });
      } else {
        setReplyTarget({ entry, reply });
      }
    }
  }, [reply, setReplyTarget, activePage.data, replyTarget?.reply]);

  // Styles
  const isEven = level % 2 === 0;
  const flexDirection = isEven ? "flex-row" : "flex-row-reverse";
  const reverseAlignment = isEven ? "ml-2" : "mr-2";
  const bubblePosition = isEven
    ? "-bottom-1 -left-1"
    : "-bottom-1 -right-1 transform scale-x-[-1]";
  const dashLinePosition = isEven ? "right-0" : "left-0";

  // Layout prop is what dictates animating the container to expand/contract
  // when replies are loaded or unloaded. The parent/root is in Replies.tsx
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        paddingTop: showChildReplies ? 48 : 32,
      }}
      animate={{ opacity: 1, scale: 1, paddingTop: showChildReplies ? 64 : 48 }}
      transition={{
        opacity: { duration: 0.2 + index * index * 0.05, ease: "easeInOut" },
        scale: { type: "spring", stiffness: 260, damping: 24 },
        paddingTop: { type: "spring", stiffness: 180, damping: 16 },
      }}
      style={{ originX: !isEven ? 1 : 0 }}
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
            <div className="z-10 -mt-12 h-full w-1 rounded-tl-lg rounded-tr-lg bg-[#CCC]" />
          )}

          <Avatar
            className="mt-auto min-h-[40px] min-w-[40px] rounded-full outline outline-2 outline-white"
            imageSrc={reply.author.image}
            altText={`${reply.author.username}'s avatar`}
            width={40}
            height={40}
            user={reply.author}
          />
        </div>

        {/* Content, Text, and Expand/Collapse + Spacer for Children */}
        <div
          className={`relative mb-2 flex w-full items-end justify-between ${reverseAlignment} ${flexDirection} `}
        >
          <motion.div
            className={`relative w-fit max-w-[304px] overflow-visible rounded-[18px] bg-white px-3 py-1.5`}
          >
            {/* Content  */}
            <motion.div
              whileHover={
                replyTarget?.reply === reply
                  ? { color: "#CCC" }
                  : { color: "#CCC" }
              }
              onClick={handleReplyParent}
              animate={{
                color: replyTarget?.reply === reply ? "#0024CC" : "#000",
                scale: replyTarget?.reply === reply ? 1.01 : 1,
              }}
              transition={{ duration: 0.24 }}
              className={`text-gray cursor-pointer break-words text-base`}
            >
              {reply.text}
            </motion.div>

            {/* Username */}
            <p
              className={`text-gray2 absolute -top-[18px] text-sm font-semibold ${
                !isEven && "right-3"
              }`}
            >
              {reply.author.username}
            </p>

            {/* Heart */}
            <Heart entry={activePage.data as EntryExtended} />

            <AnimatePresence>
              {/* Expand Dot */}
              {!showChildReplies && replyCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{
                    scale: 1.5,
                    backgroundColor: showChildReplies ? "#CCC" : "#999",
                  }}
                  onClick={() => setShowChildReplies((prev) => !prev)}
                  className={`center-y bg-gray3 absolute h-2 w-2 rounded-full ${
                    isEven ? "-right-5" : "-left-5"
                  }`}
                />
              )}
            </AnimatePresence>

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

          {/* Curve / Collapse */}
          <AnimatePresence>
            {showChildReplies && (
              <motion.div
                whileHover={{
                  opacity: 0.5,
                  scale: 1.1,
                }}
                initial={{
                  opacity: 0,
                  scaleX: 0,
                  scaleY: 0,
                  filter: "blur(4px)",
                }}
                animate={{
                  opacity: 1,
                  scaleX: isEven ? -1 : 1,
                  scaleY: 1,
                  filter: "blur(0px)",
                }}
                exit={{ opacity: 0, scaleX: 0, scaleY: 0, filter: "blur(4px)" }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`absolute top-1/2 ${
                  isEven ? "right-[18px]" : "left-[18px]"
                }`}
              >
                <TinyCurveIcon
                  color={"#CCC"}
                  className={`-scale-x-[1] -scale-y-[1]`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Render Dash & Sub-replies */}
      <div className={`relative flex w-full flex-col ${flexDirection}`}>
        {showChildReplies && (
          <div
            className={`absolute -z-10 flex h-full w-10 items-center justify-center ${dashLinePosition}`}
          >
            <div className="z-10 h-full w-1 rounded bg-[#E9E9E9]" />
          </div>
        )}

        {showChildReplies && (
          // mb-8 creates space between the children and the parent
          <div
            className={`flex w-full flex-col ${showChildReplies && "mb-12"}`}
          >
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
              isEven ? "justify-start pl-[18px]" : "flex-row-reverse pr-[18px]"
            }`}
          >
            <div className="absolute z-10 h-full w-1 translate-y-9 rounded bg-[#CCC]" />
            <LoopIcon className={`${!isEven && "-scale-x-[1]"}`} />
            <Image
              className="rounded-full outline outline-2 outline-white"
              src={reply.replyTo!.author.image}
              alt={`${reply.replyTo!.author.username}'s avatar`}
              width={24}
              height={24}
            />
            <p
              className={`text-gray2 line-clamp-2 max-w-[278px] text-xs ${
                !isEven ? "text-end" : ""
              }`}
            >
              {reply.replyTo?.text}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
