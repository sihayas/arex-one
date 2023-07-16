import React, { useState } from "react";
import { ReplyIcon } from "../../../../icons";
import { useSession } from "next-auth/react";
import { UserAvatar, LikeButton } from "../../../generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { useThreadcrumb } from "../../../../../context/Threadcrumbs";
import { Stars } from "../../../generics";
import useHandleLikeClick from "@/hooks/useLike";
import { useHandleEntryClick } from "@/hooks/useHandleEntryClick";

interface EntryPreviewProps {
  review: ReviewData;
}

export const EntryPreview: React.FC<EntryPreviewProps> = ({ review }) => {
  const { data: session } = useSession();
  const { setPages, bounce } = useCMDK();
  const { setThreadcrumbs } = useThreadcrumb();

  const replyCount = review.replies.length;

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
    review.likedByUser,
    review.likes,
    "/api/review/postLike",
    "reviewId",
    review.id,
    session
  );

  const handleEntryClick = useHandleEntryClick(review.id);

  const handleUserClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "user",
        user: review.author.id,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-2 w-[484px] overflow-visible">
      {/* Review Content  */}
      <div className="flex relative">
        <div
          onClick={handleEntryClick}
          className={`w-full text-[13px] leading-normal px-4 py-2 bg-white text-black shadow-entry border border-silver rounded-2xl rounded-bl-[4px] break-words overflow-visible cursor-pointer transition-all duration-300 hover:scale-[102%]`}
        >
          {review.content}
        </div>
        <div className="absolute -z-10 -left-5 -top-5">
          <Stars rating={review.rating} />
        </div>

        {/* Reply Count & Like Count */}
        <div className="absolute flex  gap-2 -right-3 -bottom-6">
          {/* Reply Count  */}
          <div className="flex mt-1.5 items-center gap-1 px-1 py-[2px] rounded-full max-h-4 bg-white border border-silver">
            <ReplyIcon width={8} height={8} color={"#999"} />
            <div className="text-[10px] text-gray2">{replyCount}</div>
          </div>

          {/* Like Count  */}
          <div className="flex flex-col items-center">
            <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
            <div className=" text-[10px] text-gray2">{likeCount}</div>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="flex items-center gap-2">
        {/* Image & Star  */}
        <UserAvatar
          imageSrc={review.author?.image}
          altText={`${review.author?.name}'s avatar`}
          width={24}
          height={24}
        />
        {/* Name  */}
        <div
          onClick={handleUserClick}
          className={`font-medium text-[13px] leading-normal text-black cursor-pointer transition-all duration-300 hover:text-[#000]`}
        >
          {review.author?.name}
        </div>
      </div>
    </div>
  );
};
