import React, { useState, useCallback } from "react";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyType } from "@/types/dbTypes";

import Children from "@/components/interface/artifact/render/Children";
import { AnimatePresence, motion } from "framer-motion";
import useHandleHeartClick from "@/hooks/useHeart";
import { useUser } from "@supabase/auth-helpers-react";
import Avatar from "@/components/global/Avatar";
import { v4 as uuidv4 } from "uuid";
import Heart from "@/components/global/Heart";
import { useInterfaceContext } from "@/context/InterfaceContext";

interface ReplyProps {
  reply: ReplyType;
  index: number;
}

export default function RootReply({ reply, index }: ReplyProps) {
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
      className={`flex flex-col relative w-full pt-4 h-fit`}
    >
      {/* Main Reply */}
      <div
        className={`flex items-center bg-[#F4F4F4] p-2 pr-2.5 gap-2 rounded-[20px]`}
      >
        <Avatar
          className="w-8 h-8 rounded-full border border-silver"
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
          className={`text-base break-words cursor-pointer`}
        >
          {reply.text}
        </motion.div>
      </div>

      {/* Attribution & Collapse Dot */}
      {replyCount > 0 && (
        <div className={`flex gap-3.5 mt-1.5`}>
          {/* Collapse */}
          <div
            className={`flex flex-col items-center cursor-pointer h-full min-w-[9px]`}
          >
            {!showChildReplies ? (
              <motion.div
                whileHover={{
                  scale: 1.25,
                  opacity: 1,
                }}
                onClick={() => setShowChildReplies((prev) => !prev)}
                className={`w-[9px] h-[9px] rounded-full cursor-pointer bg-black opacity-50`}
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
                className={`flex flex-grow rounded-max h-full bg-gray3 opacity-50`}
              />
            )}
          </div>

          {/* Replies & Username */}
          <div className={`flex flex-col`}>
            <div className={`text-sm leading-[9px] text-gray2 font-medium`}>
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
