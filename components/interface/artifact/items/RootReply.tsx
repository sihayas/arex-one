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
    const artifact = activePage.artifact!.data;
    setReplyTarget({ artifact, reply });
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
        },
      }}
      style={{
        willChange: "opacity, scale, transform",
      }}
      className={`relative mt-4 flex h-fit w-full flex-col `}
    >
      {/* Main Reply */}
      <div className={`flex items-end gap-3`}>
        <Avatar
          className="shadow-shadowKitMedium h-10 w-10 rounded-full outline outline-2 outline-white"
          imageSrc={reply.author.image}
          altText={`${reply.author.username}'s avatar`}
          width={40}
          height={40}
          user={reply.author}
        />
        <div
          className={`relative mb-3 w-fit overflow-visible rounded-[18px] bg-white px-3 py-1.5`}
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
              color: replyTarget?.reply === reply ? "#0024cc" : "#000",
              scale: replyTarget?.reply === reply ? 1.01 : 1,
            }}
            transition={{ duration: 0.24 }}
            className={`cursor-pointer break-words text-base`}
          >
            {reply.text}
          </motion.div>

          <div
            className={`text-gray2 absolute -bottom-4 left-3 text-sm font-medium`}
          >
            {reply.author.username}
          </div>

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
            className={`flex min-w-[40px] cursor-pointer flex-col items-center`}
          >
            {!showChildReplies ? (
              //   Expand
              <motion.div
                whileHover={{
                  scale: 1.25,
                  opacity: 1,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`bg-gray3 h-3 w-3 translate-y-2 cursor-pointer rounded-full`}
              />
            ) : (
              //   Collapse
              <motion.button
                whileHover={{
                  width: 6,
                  backgroundColor: "#000",
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
                className={`rounded-max flex-grow translate-y-2 `}
              />
            )}
          </div>

          {/* Replies & Username */}
          <div className={`mt-4 flex w-full flex-col`}>
            {showChildReplies && (
              <Children parentReplyId={reply.id} level={1} isChild={true} />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
