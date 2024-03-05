import React, { useState, useCallback } from "react";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyType } from "@/types/dbTypes";

import Children from "@/components/interface/artifact/render/Children";
import { motion } from "framer-motion";
import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import { useInterfaceContext } from "@/context/InterfaceContext";

interface ReplyProps {
  reply: ReplyType;
  index: number;
}

export default function RootReply({ reply, index }: ReplyProps) {
  const { user } = useInterfaceContext();
  const { setReplyTarget, replyTarget } = useThreadcrumb();
  const { pages } = useInterfaceContext();
  const [showChildReplies, setShowChildReplies] = useState<boolean>(false);

  const activePage = pages[pages.length - 1];
  const replyCount = reply._count ? reply._count.replies : 0;

  const handleReplyParent = useCallback(() => {
    const artifact = activePage.artifact?.data;
    if (artifact) {
      setReplyTarget({ artifact, reply });
    }
  }, [reply, setReplyTarget, activePage.artifact]);

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
        willChange: "opacity, scale, transform",
      }}
      className={`relative mt-4 flex h-fit w-full flex-col`}
    >
      {/* Main Reply */}
      <div className={`flex items-end gap-2`}>
        <Avatar
          className="border-silver h-8 w-8 rounded-full border"
          imageSrc={reply.author.image}
          altText={`${reply.author.username}'s avatar`}
          width={32}
          height={32}
          user={reply.author}
        />
        <div
          className={`relative mb-2 w-fit overflow-visible rounded-[18px] bg-white px-3 py-1.5`}
        >
          {/* Content  */}
          <motion.div
            whileHover={{ color: "rgba(0,0,0,1)" }}
            onClick={handleReplyParent}
            animate={{
              color:
                replyTarget?.reply === reply ? "#FFF" : "rgb(119 119 119 / 1)",
              scale: replyTarget?.reply === reply ? 1.01 : 1,
            }}
            transition={{ duration: 0.24 }}
            className={`cursor-pointer break-words text-base`}
          >
            {reply.text}
          </motion.div>

          {/* Bubbles */}
          <div className={`absolute -bottom-1 -left-1 -z-10 h-3 w-3`}>
            <div
              className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white`}
            />
            <div
              className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-white`}
            />
          </div>
        </div>
      </div>

      {/* Sub Replies & Collapse Dot */}
      {replyCount > 0 && (
        <div className={`flex w-full`}>
          <div
            className={`flex min-w-[32px] cursor-pointer flex-col items-center`}
          >
            {!showChildReplies ? (
              //   Expand
              <motion.div
                whileHover={{
                  scale: 1.25,
                  opacity: 1,
                }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`h-[9px] w-[9px] cursor-pointer rounded-full bg-black opacity-50`}
              />
            ) : (
              //   Collapse
              <motion.button
                whileHover={{
                  width: 6,
                  backgroundColor: "#999",
                }}
                initial={{
                  width: 4,
                  backgroundColor: "#E9E9E9",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`rounded-max flex-grow `}
              />
            )}
          </div>

          {/* Replies & Username */}
          <div className={`flex w-full flex-col`}>
            {showChildReplies && (
              <Children parentReplyId={reply.id} level={1} isChild={true} />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
