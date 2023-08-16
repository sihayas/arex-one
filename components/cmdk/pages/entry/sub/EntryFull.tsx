import React from "react";
import { useSession } from "next-auth/react";

import { useCMDK } from "@/context/CMDKContext";
import useHandleLikeClick from "@/hooks/handleInteractions/useLike";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";

import { ReviewData } from "@/lib/global/interfaces";
import { RenderReplies } from "./reply/RenderReplies";
import ReplyInput from "./reply/ReplyInput";
import Stars from "@/components/global/Stars";
import LikeButton from "@/components/global/LikeButton";
import UserAvatar from "@/components/global/UserAvatar";

interface EntryFullProps {
  review: ReviewData;
}

export const EntryFull: React.FC<EntryFullProps> = ({ review }) => {
  const { data: session } = useSession();
  const { setPages } = useCMDK();
  const { threadcrumbs } = useThreadcrumb();

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
    review.likedByUser!,
    review.likes,
    "/api/review/post/like",
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
        dimensions: {
          width: 50,
          height: 50,
        },
      },
    ]);
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full absolute top-[516px] p-8 z-10 bg-white rounded-[20px]">
        {/* Review Content */}
        <div
          className={`w-full text-[13px] text-black break-words hoverable-medium`}
        >
          {review.content}
        </div>

        {/* Attribution and stats */}
        <div className="grid grid-cols-3 relative">
          {/* Username and Avatar */}
          <div
            onClick={handleUserClick}
            className="self-center flex items-center gap-2 hoverable-small"
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

          <Stars
            className="self-center justify-self-center border border-silver rounded-full p-1"
            rating={review.rating}
            color={"#000"}
          />

          {/* Replies and Likes  */}
          <div className="self-center justify-self-end flex items-center gap-2 hoverable-small">
            <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
            {review.replies && review._count.replies > 0 && (
              // Like & Avatar previews
              <div className="flex items-center -ml-1">
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
                    + {review._count.replies - 3}
                  </div>
                )}
              </div>
            )}
            {/* Date  */}
            <div className="text-gray2 text-[10px]">
              {formatDateShort(new Date(review.createdAt))}
            </div>
          </div>

          <div className="text-xs text-gray2 font-medium absolute -bottom-8">
            {review._count.replies} chains
          </div>
        </div>

        <RenderReplies threadcrumbs={threadcrumbs} />

        {/* Reply Input  */}
        <div className="w-[452px] absolute bottom-8 left-8 flex items-center gap-2 bg-blurEntry backdrop-blur-sm p-1 rounded-full z-20 border border-silver">
          <UserAvatar
            className="border-2 border-white rounded-full"
            imageSrc={review.author?.image}
            altText={`${review.author?.name}'s avatar`}
            width={28}
            height={28}
          />
          <ReplyInput />
        </div>
      </div>
    </>
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
