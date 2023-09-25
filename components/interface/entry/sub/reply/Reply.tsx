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
  const [hideContent, setHideContent] = useState(false);
  const replyCount = reply.replies?.length;

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
    "/api/reply/post/like",
    "replyId",
    reply.id,
    session,
  );

  return (
    <div className="flex flex-col gap-1">
      {/* Content & Like Button  */}
      <div
        onClick={handleLoadReplies}
        className={`w-fit max-w-[416px] text-gray4 text-sm rounded-2xl rounded-bl-[4px] break-words bg-[#F4F4F4] px-3 py-[6px] leading-normal`}
      >
        {reply.content}
      </div>
      <div className="flex items-center gap-2">
        <UserAvatar
          className="w-[32px] h-[32px] border border-[#F4F4F4]"
          imageSrc={reply.author.image || "./public/images/default_image.png"}
          altText={`${reply.author.name}'s avatar`}
          width={32}
          height={32}
          userId={reply.author.id}
        />
        <div className={`font-medium text-sm text-gray2 leading-[75%]`}>
          {reply.author.name}
        </div>
      </div>
    </div>
  );
}
