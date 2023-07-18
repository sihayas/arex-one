// Importing required modules
import React, { useState } from "react";
import { UserAvatar, LikeButton } from "../../../generics";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { ReplyData } from "@/lib/interfaces";
import { useSession } from "next-auth/react";
import useHandleLikeClick from "@/hooks/useLike";
import { Line, LineBottom } from "../../../generics";
import { ChainEndIcon } from "@/components/icons";

interface ReplyProps {
  reply: ReplyData;
  setSelectedReply: (reply: ReplyData | null) => void;
}

export default function Reply({ reply, setSelectedReply }: ReplyProps) {
  const [hideContent, setHideContent] = useState(false);
  const replyCount = reply.replies?.length;
  const isChild = reply.replyTo ? true : false;

  const { data: session } = useSession();
  const { addToThreadcrumbs, removeUpToId, setReplyParent, threadcrumbs } =
    useThreadcrumb();

  // Handle loading of replies
  const handleLoadReplies = () => {
    if (threadcrumbs && !threadcrumbs.includes(reply.id)) {
      // setHideContent(true);
      // setSelectedReply(reply);
      // addToThreadcrumbs(reply.id);
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
    <div className={`flex flex-col gap-2 w-[482px] ${isChild ? "pt-4" : ""}`}>
      {/* Parent Reply ?  */}
      {isChild && reply.replyTo ? (
        <div className="w-full flex gap-2">
          <div className="min-w-[24px] ml-1 relative">
            <UserAvatar
              imageSrc={
                reply.replyTo.author.image ||
                "./public/images/default_image.png"
              }
              altText={`${reply.author?.name}'s avatar`}
              width={16}
              height={16}
            />
            <div className="absolute right-0 rotate-180 -bottom-[5px]">
              <ChainEndIcon width={32} height={32} color={"#E5E5E5"} />
            </div>
          </div>
          <div className="text-[10px] text-gray2">{reply.replyTo.content}</div>
        </div>
      ) : null}

      {/* Reply */}
      <div className="flex items-end gap-2">
        {/* Avatar & Chain */}
        <div className="min-w-[24px] h-full flex flex-col items-center relative">
          {isChild ? <Line /> : <div className="h-full" />}
          <div onClick={handleLoadReplies} className="relative cursor-pointer">
            <UserAvatar
              imageSrc={
                reply.author?.image || "./public/images/default_image.png"
              }
              altText={`${reply.author?.name}'s avatar`}
              width={24}
              height={24}
            />
            {/* Chain Bottom (Reply)? */}
            {isChild ? (
              <div className="absolute -top-[5px] -right-[9px]">
                <ChainEndIcon width={42} height={42} color={"#E5E5E5"} />
              </div>
            ) : null}
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
      <div className="flex gap-2">
        <div className={`flex flex-col w-[24px] items-center -mb-2`}>
          <LineBottom />
        </div>
        <div className={`font-medium text-xs text-black pb-8`}>
          {reply.author.name}
        </div>
      </div>

      {/* Reply Count 
      {replyCount && !hideContent ? (
        <div
          onClick={handleLoadReplies}
          className={`flex items-center translate-x-8 text-xs relative text-gray2 cursor-pointer transition-all`}
        >
          <div className="text-[10px]">{replyCount} chains</div>
        </div>
      ) : null} */}
    </div>
  );
}
