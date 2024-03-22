import React, { useState, useCallback } from "react";

import { ReplyType } from "@/types/dbTypes";

import Children from "@/components/interface/artifact/render/Children";
import { AnimatePresence, motion } from "framer-motion";
import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";

interface ReplyProps {
  reply: ReplyType;
  index: number;
}

export default function RootReply({ reply, index }: ReplyProps) {
  const { user } = useInterfaceContext();
  const { setReplyTarget, replyTarget } = useNavContext();
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
        scale: { type: "spring", stiffness: 260, damping: 20 },
      }}
      className={`relative mt-8 flex h-fit w-full flex-col`}
    >
      {/* Main Reply */}
      <div
        className={`flex bg-white items-center gap-3 px-3 py-[9px] rounded-[20px] relative`}
      >
        <Avatar
          className="shadow-shadowKitMedium rounded-full outline outline-2 outline-silver flex-shrink-0"
          imageSrc={reply.author.image}
          altText={`${reply.author.username}'s avatar`}
          width={40}
          height={40}
          user={reply.author}
        />

        {/* Collapse Dot */}
        <div className={`absolute -bottom-2 left-0 w-16`}>
          {!showChildReplies && replyCount > 0 && (
            <motion.div
              whileHover={{ scale: 1.5, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowChildReplies((prev) => !prev)}
              className={`absolute center-x center-y bg-gray2 w-2 h-2 rounded-full`}
            />
          )}
        </div>

        <div className={`flex flex-col`}>
          <div className={`text-black text-sm font-medium`}>
            {reply.author.username}
          </div>
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
        </div>
      </div>

      {/* Sub Replies & Collapse Line */}
      {replyCount > 0 && (
        <div className={`flex w-full`}>
          <div className={`flex min-w-[40px] flex-col items-center`}>
            {showChildReplies && (
              <motion.div
                whileHover={{ width: 6, backgroundColor: "#999999" }}
                initial={{ width: 4, backgroundColor: "#E9E9E9" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`rounded-max flex-grow translate-y-2 translate-x-[12px]`}
              />
            )}
          </div>

          {/* Replies & Username */}
          <AnimatePresence>
            {showChildReplies && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`mt-2 flex w-full flex-col`}
              >
                <Children parentReplyId={reply.id} level={1} isChild={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
