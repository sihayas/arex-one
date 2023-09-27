import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyData } from "@/lib/global/interfaces";
import UserAvatar from "@/components/global/UserAvatar";
import Line from "@/components/interface/entry/sub/icons/Line";

interface ReplyProps {
  reply: ReplyData;
}

export default function Reply({ reply }: ReplyProps) {
  const replyCount = reply._count ? reply._count.replies : 0;
  const replyChild = reply.replies?.[0];

  const { addToThreadcrumbs, removeUpToId, setReplyParent, threadcrumbs } =
    useThreadcrumb();

  // Handle loading of replies
  const handleLoadReplies = () => {
    if (threadcrumbs && !threadcrumbs.includes(reply.id)) {
      addToThreadcrumbs(reply.id);
      setReplyParent(reply);
      console.log("added reply to thre", threadcrumbs);
    } else {
      handleGoBack();
      console.log("went back using load replies:", threadcrumbs);
    }
  };

  // Handle "Go Back" button click
  const handleGoBack = () => {
    removeUpToId(reply.id);
    setReplyParent(reply);
  };

  const handleReplyParent = (reply: ReplyData) => {
    setReplyParent(reply);
  };

  // const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
  //   reply.likedByUser,
  //   reply.likes,
  //   "/api/reply/post/like",
  //   "replyId",
  //   reply.id,
  //   session,
  // );

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 items-end">
        <Image
          className="w-[32px] h-[32px] outline outline-1 outline-[#F4F4F4] rounded-full"
          src={reply.author.image}
          alt={`${reply.author.name}'s avatar`}
          width={32}
          height={32}
          onClick={() => handleReplyParent(reply)}
        />

        {/* Attribution */}
        <div className="flex flex-col gap-1">
          <div className={`font-medium text-sm text-gray2 leading-[75%] pl-2`}>
            {reply.author.name}
          </div>
          {/* Content  */}
          <div
            onClick={handleLoadReplies}
            className={`w-fit max-w-[416px] text-gray4 text-sm rounded-2xl rounded-bl-[4px] break-words bg-[#F4F4F4] px-2 py-[6px] leading-normal`}
          >
            {reply.content}
          </div>
        </div>
      </div>

      {replyCount > 0 && (
        <div className="w-8 flex flex-col items-center">
          <Line height={"16px"} className={"ml-auto mr-auto"} />
          <div className="flex items-center ml-1">
            <UserAvatar
              className="w-6 h-6 outline outline-1 outline-[#F4F4F4]"
              imageSrc={replyChild?.author.image}
              altText={`${reply.author.name}'s avatar`}
              width={24}
              height={24}
              userId={reply.author.id}
            />
            <div
              onClick={handleLoadReplies}
              className="text-xs text-gray2 leading-[75%] ml-3 cursor-pointer"
            >
              {replyCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
