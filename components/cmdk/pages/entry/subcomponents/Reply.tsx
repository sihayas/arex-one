// Importing required modules
import React, { useState } from "react";
import { UserAvatar, LikeButton } from "../../../generics";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { ReplyData } from "@/lib/interfaces";
import { useSession } from "next-auth/react";
import useHandleLikeClick from "@/hooks/useLike";

interface ReplyProps {
  reply: ReplyData;
  setSelectedReply: (reply: ReplyData | null) => void;
}
export default function Reply({ reply, setSelectedReply }: ReplyProps) {
  const [hideContent, setHideContent] = useState(false);
  const replyCount = reply.replies?.length;

  const { data: session } = useSession();
  const { addToThreadcrumbs, removeUpToId, setReplyParent, threadcrumbs } =
    useThreadcrumb();

  // Handle loading of replies
  const handleLoadReplies = () => {
    if (threadcrumbs && !threadcrumbs.includes(reply.id)) {
      setHideContent(true);
      setSelectedReply(reply);
      addToThreadcrumbs(reply.id);
      setReplyParent(reply);
    } else {
      handleGoBack();
    }
  };

  // Handle "Go Back" button click
  const handleGoBack = () => {
    removeUpToId(reply.id);
    setHideContent(false);
    setSelectedReply(null);
    setReplyParent(reply);
  };

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
    reply.likedByUser,
    reply.likes,
    "/api/reply/postLike",
    "replyId",
    reply.id,
    session
  );

  return (
    <div
      className={`flex flex-col gap-1 w-[482px] ${
        hideContent ? "cursor-pointer" : ""
      }`}
    >
      {/* Avatar & Content Outer */}
      <div className="flex items-end gap-2">
        {/* Avatar & Line */}
        <div className="min-w-[24px] relative">
          <UserAvatar
            imageSrc={
              reply.author?.image || "./public/images/default_image.png"
            }
            altText={`${reply.author?.name}'s avatar`}
            width={24}
            height={24}
          />
          {/* Animate a line to indicate threading upon clicking */}
          <div className={`thread-line ${hideContent ? "show" : ""}`}></div>
          <div
            onClick={() =>
              replyCount ? handleLoadReplies() : setReplyParent(reply)
            }
            className={`absolute left-[7px] -bottom-[38px] cursor-pointer transition-all duration-300 hover:scale-150 overflow-visible ${
              hideContent ? "scale-125" : ""
            }`}
          >
            <svg height="10" width="10">
              <circle cx="5" cy="5" r="5" fill="#E5E5E5" />
            </svg>
          </div>
        </div>

        {/* Content & Like Button  */}
        <div className="flex relative">
          <div
            className={`px-4 py-2 w-[450px] bg-white text-black text-[13px] leading-normal shadow-reply border border-silver rounded-2xl rounded-bl-[4px] break-words cursor-pointer`}
          >
            {reply.content}
          </div>

          {/* Like Count  */}
          <div className="absolute flex flex-col items-center -right-2.5 -bottom-6">
            <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
            <div className="text-[10px] text-gray2">{likeCount}</div>
          </div>
        </div>
      </div>
      {/* Name  */}
      <div className={`pl-8 font-medium text-xs text-black`}>
        {reply.author.name}
      </div>
      {/* Reply Count  */}
      {replyCount && !hideContent ? (
        <div
          onClick={() =>
            replyCount > 0 ? handleLoadReplies() : setReplyParent(reply)
          }
          className={`flex items-center translate-x-8 text-xs relative text-gray2 cursor-pointer transition-all`}
        >
          <div className="text-[10px]">{replyCount} replies</div>
        </div>
      ) : null}
    </div>
  );
}
