import React, { useState, useCallback } from "react";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyType } from "@/types/dbTypes";

import RenderChildren from "@/components/interface/artifact/sub/RenderChildren";
import { motion } from "framer-motion";
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

  console.log("rendered root");

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
      <div className={`flex gap-3.5 mt-1.5`}>
        <div
          className={`flex flex-col items-center cursor-pointer h-full w-[9px]`}
        >
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
            className={`w-[9px] h-[9px] rounded-full cursor-pointer`}
          />

          {showChildReplies && (
            <Line color={"#CCC"} className={`flex flex-grow !w-[1.5px]`} />
          )}
        </div>

        <div className={`flex flex-col`}>
          <div className={`text-sm leading-[9px] text-gray2 font-medium`}>
            {reply.author.username}
          </div>
          {showChildReplies && (
            <RenderChildren
              key={uuidv4()}
              parentReplyId={reply.id}
              level={1}
              isChild={true}
            />
          )}
        </div>
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
