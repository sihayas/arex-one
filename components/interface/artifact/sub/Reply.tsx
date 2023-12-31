import React, { useState, useCallback } from "react";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyType } from "@/types/dbTypes";
import Dash from "@/components/global/Dash";

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
  level: number;
  isChild: boolean;
  index: number;
}

export default function Reply({ reply, level, isChild, index }: ReplyProps) {
  const user = useUser();
  const { setReplyTarget, replyTarget } = useThreadcrumb();
  const { pages } = useInterfaceContext();
  const [showChildReplies, setShowChildReplies] = useState<boolean>(false);

  const replyCount = reply._count ? reply._count.replies : 0;
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

  // Styles
  const isEvenLevel = level % 2 === 0;
  const flexDirection = isEvenLevel ? "flex-row" : "flex-row-reverse";
  const reverseAlignment = isEvenLevel ? "items-start" : "items-end";
  const bubblePosition = isEvenLevel
    ? "-bottom-1 -left-1"
    : "-bottom-1 -right-1 transform scale-x-[-1]";

  console.log("rendered child");

  // Layout prop is what dictates animating the container to expand/contract when
  // replies are loaded or unloaded. The parent/root is in RenderReplies.tsx
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
        originX: !isEvenLevel ? 1 : 0,
        willChange: "opacity, scale, transform",
      }}
      className={`flex flex-col w-full pt-4 h-fit relative`}
    >
      {/* Main Reply */}
      <div className={`flex gap-3 items-end ${flexDirection}`}>
        <Avatar
          className="w-8 h-8 rounded-full border border-gray3"
          imageSrc={reply.author.image}
          altText={`${reply.author.username}'s avatar`}
          width={32}
          height={32}
          user={reply.author}
        />

        {/* Attribution & Content */}
        <div className={`flex flex-col gap-[3px] w-full ${reverseAlignment}`}>
          <div
            className={`relative bg-[#F4F4F4] px-3 py-1.5 w-fit rounded-2xl overflow-visible`}
          >
            {/* Content  */}
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

          <div
            className={`font-medium text-sm text-gray2 leading-[9px] translate-y-[3px]`}
          >
            {reply.author.username}
          </div>
        </div>

        {/* Fill Line | */}
        {!isChild && (
          <Line
            color={"#CCC"}
            className={`!w-[2px] rounded h-full absolute -right-[30px]
           `}
          />
        )}
      </div>

      {replyCount > 0 && (
        <div className={`flex gap-3.5 mt-1.5 ${flexDirection}`}>
          <div
            className={`flex flex-col items-center cursor-pointer h-full w-8`}
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

            {showChildReplies && <Dash color={"#CCC"} dotSize={"8"} />}
          </div>

          <div className={`flex flex-col w-full`}>
            {showChildReplies && (
              <RenderChildren
                key={uuidv4()}
                parentReplyId={reply.id}
                level={level + 1}
                isChild={false}
              />
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
}> = ({
  width = "1px",
  height = "100%",
  color = "rgba(0, 0, 0, 0.1)",
  className = "",
  horizontal = false,
}) => (
  <div
    style={{
      ...(horizontal ? { width, height } : { height, width }),
      backgroundColor: color,
    }}
    className={className}
  />
);

// {replyCount > 0 && (
//     <div
//         className={`min-h-[16px] flex flex-col relative w-full ${reverseAlignment}`}
//     >
//       {/* Create chain baseline for children fetched / Button to expand
//        & collapse */}
//       {showChildReplies ? (
//           <div
//               className={`absolute flex flex-col cursor-pointer h-full w-8 pt-1 items-center`}
//           >
//             <motion.div
//                 whileHover={{ scale: 1.25, backgroundColor: "rgb(255,94,0)" }}
//                 onClick={() => {
//                   setShowChildReplies(false);
//                 }}
//                 className="min-w-[8px] min-h-[8px] rounded-full bg-[#e5e5e6] cursor-pointer z-30"
//             />
//             <Dash
//                 className={"flex flex-grow ml-auto mr-auto mb-8"}
//                 color={"#e5e5e6"}
//             />
//           </div>
//       ) : (
//           // Show curved stat-line if replies exist
//           <div
//               onClick={handleLoadReplies}
//               className={`flex items-end w-fit cursor-pointer group gap-1 ${flexDirection}`}
//           >
//             <StatLineIcon color={"#CCC"} className={`${reverseStatLine}`} />
//             {reply.replies?.map((childReply, index) => (
//                 <Image
//                     key={index}
//                     className={`outline outline-2 outline-white rounded-full transition-all ${
//                         index !== 0 && "-ml-2"
//                     }`}
//                     src={
//                         childReply.author.image ||
//                         "/public/images/default-avatar.png"
//                     }
//                     alt={`${childReply.author.username}'s avatar`}
//                     width={16}
//                     height={16}
//                 />
//             ))}
//             <div className={`pl-2 text-xs text-gray2 leading-[16px]`}>
//               {replyCount}
//             </div>
//           </div>
//       )}
//
//       {showChildReplies && (
//           <RenderChildren
//               key={uuidv4()}
//               parentReplyId={reply.id}
//               level={level + 1}
//           />
//       )}
//     </div>
// )}

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
