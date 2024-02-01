import React, { useState, useCallback } from "react";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyType } from "@/types/dbTypes";

import Children from "@/components/interface/artifact/render/Children";
import { AnimatePresence, motion } from "framer-motion";
import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";
import { v4 as uuidv4 } from "uuid";
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
    const artifact = activePage.artifact;
    if (artifact) {
      setReplyTarget({ artifact, reply });
    }
  }, [reply, setReplyTarget, activePage.artifact]);

  const handleLoadReplies = useCallback(() => {
    setShowChildReplies(true);
  }, []);

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
      className={`relative flex h-fit w-full flex-col pt-4`}
    >
      {/* Main Reply */}
      <div
        className={`flex items-center gap-2 rounded-[20px] bg-[#E5E5E5] p-2 pr-2.5`}
      >
        <Avatar
          className="border-silver h-8 w-8 rounded-full border"
          imageSrc={reply.author.image}
          altText={`${reply.author.username}'s avatar`}
          width={32}
          height={32}
          user={reply.author}
        />

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
          className={`cursor-pointer break-words text-base`}
        >
          {reply.text}
        </motion.div>
      </div>

      {/* Attribution & Collapse Dot */}
      {replyCount > 0 && (
        <div className={`mt-1.5 flex gap-3.5`}>
          {/* Collapse */}
          <div
            className={`flex h-full min-w-[9px] cursor-pointer flex-col items-center`}
          >
            {!showChildReplies ? (
              <motion.div
                whileHover={{
                  scale: 1.25,
                  opacity: 1,
                }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`h-[9px] w-[9px] cursor-pointer rounded-full bg-black opacity-50`}
              />
            ) : (
              <motion.button
                whileHover={{
                  width: 4.5,
                  opacity: 1,
                }}
                initial={{
                  width: 2.5,
                }}
                exit={{
                  height: 0,
                }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`rounded-max bg-gray3 flex h-full flex-grow opacity-50`}
              />
            )}
          </div>

          {/* Replies & Username */}
          <div className={`flex flex-col`}>
            <div className={`text-gray2 text-sm font-medium leading-[9px]`}>
              {reply.author.username}
            </div>
            {showChildReplies && (
              <Children parentReplyId={reply.id} level={1} isChild={true} />
            )}
          </div>
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
  onClick?: () => void;
}> = ({
  height = "1px",
  width = "100%",
  color = "rgba(0, 0, 0, 0.1)",
  className = "",
  horizontal = false,
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      ...(horizontal ? { width: height, height: width } : { height, width }),
      backgroundColor: color,
    }}
    className={className}
  />
);
