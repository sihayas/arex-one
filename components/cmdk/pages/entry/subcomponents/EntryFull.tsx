import React from "react";
import { useSession } from "next-auth/react";
import { UserAvatar, LikeButton } from "../../../generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { Stars } from "../../../generics";
import useHandleLikeClick from "@/hooks/useLike";

interface EntryFullProps {
  review: ReviewData;
}

export const EntryFull: React.FC<EntryFullProps> = ({ review }) => {
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
    <div className="flex flex-col gap-2 w-[484px] overflow-visible relative group">
      {/* Review Content, Like Button  */}
      <div className="flex relative">
        <div
          className={`w-full text-[13px] text-black break-words hoverable-medium`}
        >
          {review.content}
        </div>

        <div className="absolute gap-2 -right-3 -bottom-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
        </div>
      </div>

      {/* Username and Avatar */}
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

      {/* Replies and Likes  */}
      <div className="flex items-center gap-2 mt-2 ml-[4px] hoverable-small absolute -bottom-6">
        {review._count.replies > 0 && (
          <div className="flex items-center justify-center h-4 w-4 bg-gray3 rounded-full">
            <div className="text-[10px] text-white">
              {`${review._count.replies}`}
            </div>
          </div>
        )}

        {review._count.replies > 0 && review._count.likes > 0 && (
          <svg height="4" width="4">
            <circle cx="2" cy="2" r="2" fill="#CCC" />
          </svg>
        )}

        {review.likes && review._count.likes > 0 && (
          <div className="flex items-center text-xs text-gray2">
            {review._count.likes} {review._count.likes > 1 ? "likes" : "like"}
          </div>
        )}
      </div>
    </div>
  );
};
