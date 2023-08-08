import React from "react";
import { useSession } from "next-auth/react";
import { UserAvatar, LikeButton } from "../../../generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { Stars } from "../../../generics";
import useHandleLikeClick from "@/hooks/useLike";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";

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
    <div className="flex flex-col gap-2 w-[452px] overflow-visible relative group">
      {/* Review Content */}
      <div
        className={`w-full text-[13px] text-black break-words hoverable-medium`}
      >
        {review.content}
      </div>

      {/* Attribution and stats */}
      <div className="flex items-center justify-between">
        {/* Username and Avatar */}
        <div
          onClick={handleUserClick}
          className="flex items-center gap-2 hoverable-small"
        >
          <UserAvatar
            imageSrc={review.author?.image}
            altText={`${review.author?.name}'s avatar`}
            width={24}
            height={24}
          />
          {/* Name  */}
          <div
            className={`font-medium text-[13px] leading-normal text-black  transition-all duration-300`}
          >
            {review.author?.name}
          </div>
        </div>

        {/* Replies and Likes  */}
        <div className="flex items-center gap-1 hoverable-small relative">
          <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
          {/* Avatar previews */}
          {review.replies && review._count.replies > 0 && (
            <div className="flex items-center">
              {review.replies.slice(0, 3).map((reply, index) => (
                <UserAvatar
                  key={index}
                  className={`!border-2 border-white shadow-md ${
                    index !== 0 ? "-ml-1" : ""
                  }`}
                  imageSrc={reply.author.image}
                  altText={`${reply.author.name}'s avatar`}
                  width={20}
                  height={20}
                />
              ))}

              {review.replies && review._count.replies > 3 && (
                <div className="text-[10px] ml-1 text-gray2">
                  {" "}
                  + {review._count.replies - 3}
                </div>
              )}
              <div className="text-gray3 ml-2 mr-1">&middot;</div>
            </div>
          )}
          {/* Date  */}
          <div className="text-gray2 text-[10px]">
            {formatDateShort(new Date(review.createdAt))}
          </div>
        </div>
      </div>
    </div>
  );
};

function formatDateShort(date: Date): string {
  const now = new Date();
  const yearsDifference = differenceInYears(now, date);
  if (yearsDifference > 0) return `${yearsDifference}y`;

  const monthsDifference = differenceInMonths(now, date);
  if (monthsDifference > 0) return `${monthsDifference}mo`;

  const daysDifference = differenceInDays(now, date);
  if (daysDifference > 0) return `${daysDifference}d`;

  const hoursDifference = differenceInHours(now, date);
  if (hoursDifference > 0) return `${hoursDifference}h`;

  const minutesDifference = differenceInMinutes(now, date);
  if (minutesDifference > 0) return `${minutesDifference}m`;

  return `${differenceInSeconds(now, date)}s`;
}
