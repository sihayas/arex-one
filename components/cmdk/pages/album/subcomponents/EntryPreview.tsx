import React from "react";
import { ReplyIcon } from "../../../../icons";
import { useSession } from "next-auth/react";
import { UserAvatar, LikeButton } from "../../../generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { Stars } from "../../../generics";
import useHandleLikeClick from "@/hooks/useLike";
import { useHandleEntryClick } from "@/hooks/useHandleEntryClick";

interface EntryPreviewProps {
  review: ReviewData;
}

export const EntryPreview: React.FC<EntryPreviewProps> = ({ review }) => {
  const { data: session } = useSession();
  const { setPages } = useCMDK();

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
    <div className="flex flex-col gap-1 w-[484px] overflow-visible">
      {/* Review Content  */}
      <div className="flex relative">
        <div
          onClick={handleEntryClick}
          className={`w-full text-[13px] leading-normal px-4 py-2 bg-white text-black border border-silver rounded-2xl rounded-bl-[4px] break-words hoverable-medium`}
        >
          {review.content}
        </div>
        <Stars
          className={
            "absolute -left-3 -top-3 border border-silver rounded-full p-1 bg-white"
          }
          rating={review.rating}
        />

        {/* Reply Count & Like Count */}
        <div className="absolute flex  gap-2 -right-3 -bottom-6">
          {/* Reply Count  */}
          <div className="flex mt-1.5 items-center gap-1 px-1 py-[2px] rounded-full max-h-4 bg-white border border-silver">
            <ReplyIcon width={8} height={8} color={"#999"} />
            <div className="text-[10px] text-gray2">
              {review._count.replies}
            </div>
          </div>

          {/* Like Count  */}
          <div className="flex flex-col items-center">
            <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
            <div className=" text-[10px] text-gray2">{likeCount}</div>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div
        onClick={handleUserClick}
        className="flex items-center gap-2 hoverable-small"
      >
        {/* Image & Star  */}
        <UserAvatar
          imageSrc={review.author?.image}
          altText={`${review.author?.name}'s avatar`}
          width={24}
          height={24}
        />
        {/* Name  */}
        <div
          className={`font-medium text-[13px] leading-normal text-black  transition-all duration-300 hover:text-[#000]`}
        >
          {review.author?.name}
        </div>
      </div>
    </div>
  );
};
