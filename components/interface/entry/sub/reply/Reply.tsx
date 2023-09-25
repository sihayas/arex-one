import React, { useState } from "react";
import { useSession } from "next-auth/react";

import { useThreadcrumb } from "@/context/Threadcrumbs";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";

import { ReplyData } from "@/lib/global/interfaces";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Line from "@/components/interface/entry/sub/icons/Line";

interface ReplyProps {
  reply: ReplyData;
  setSelectedReply: (reply: ReplyData | null) => void;
}

export default function Reply({ reply, setSelectedReply }: ReplyProps) {
  const replyCount = reply._count ? reply._count.replies : 0;
  const replyChild = reply.replies?.[0];

  const { data: session } = useSession();
  const { addToThreadcrumbs, removeUpToId, setReplyParent, threadcrumbs } =
    useThreadcrumb();

  // Handle loading of replies
  const handleLoadReplies = () => {
    if (threadcrumbs) {
      setSelectedReply(reply);
      addToThreadcrumbs(reply.id);
      setReplyParent(reply);
      console.log("Added to threadcrumbs");
    } else {
      handleGoBack();
      console.log("No threadcrumbs context");
    }
  };

  // Handle "Go Back" button click
  const handleGoBack = () => {
    removeUpToId(reply.id);
    setSelectedReply(null);
    setReplyParent(reply);
  };

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
    reply.likedByUser,
    reply.likes,
    "/api/reply/post/like",
    "replyId",
    reply.id,
    session,
  );

  return (
    <div className="flex flex-col gap-1">
      {/* Content  */}
      <div
        onClick={handleLoadReplies}
        className={`w-fit max-w-[416px] text-gray4 text-sm rounded-2xl rounded-bl-[4px] break-words bg-[#F4F4F4] px-3 py-[6px] leading-normal`}
      >
        {reply.content}
      </div>

      {/* Attribution */}
      <div className="flex items-center gap-2">
        <UserAvatar
          className="w-[32px] h-[32px] border border-[#F4F4F4]"
          imageSrc={reply.author.image}
          altText={`${reply.author.name}'s avatar`}
          width={32}
          height={32}
          userId={reply.author.id}
        />
        <div className={`font-medium text-sm text-gray2 leading-[75%]`}>
          {reply.author.name}
        </div>
      </div>

      {replyCount > 0 && (
        <div
          onClick={handleLoadReplies}
          className="w-8 flex flex-col gap-1 items-center"
        >
          <Line height={"16px"} className={"ml-auto mr-auto"} />
          <div className="flex items-center ml-1">
            <UserAvatar
              className="w-6 h-6 border border-[#F4F4F4]"
              imageSrc={replyChild?.author.image}
              altText={`${reply.author.name}'s avatar`}
              width={24}
              height={24}
              userId={reply.author.id}
            />
            <div className="text-sm text-gray2 leading-[75%] ml-3">
              {replyCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
