import React, { useLayoutEffect } from "react";
import { useSession } from "next-auth/react";

import { useInterface } from "@/context/Interface";
import useHandleLikeClick from "@/hooks/handleInteractions/useHandleLike";
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
import Stars from "@/components/global/Stars";
import LikeButton from "@/components/global/LikeButton";
import UserAvatar from "@/components/global/UserAvatar";

interface EntryFullProps {
  review: ReviewData;
}

export const EntryFull: React.FC<EntryFullProps> = ({ review }) => {
  const { data: session } = useSession();
  const { entryContainerRef } = useInterface();

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
    review.likedByUser!,
    review.likes,
    "/api/review/post/like",
    "reviewId",
    review.id,
    session
  );

  return (
    <div
      ref={entryContainerRef}
      className="flex flex-col w-full p-8 z-10 bg-white rounded-[20px] overflow-scroll relative max-h-[724px] "
    >
      <div className="flex items-center gap-2 hoverable-small">
        <UserAvatar
          imageSrc={review.author.image}
          altText={`${review.author?.name}'s avatar`}
          width={32}
          height={32}
          userId={review.author.id}
        />
        {/* Name  */}
        <div
          className={`font-medium text-sm leading-normal text-black  transition-all duration-300`}
        >
          {review.author.name}
        </div>
      </div>
      {/* Review Content */}
      <div
        className={`w-full text-sm text-black break-words hoverable-medium pl-10`}
      >
        {review.content}
      </div>
      {/* Like & Avatar previews */}
      <div className="flex items-center gap-2 hoverable-small pl-10 pt-4">
        <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
        {review.replies && review._count.replies > 0 && (
          // Like & Avatar previews
          <div className="flex items-center -ml-1">
            {review.replies.slice(0, 3).map((reply, index) => (
              <UserAvatar
                key={index}
                className={`!border-2 border-white ${
                  index !== 0 ? "-ml-1" : ""
                }`}
                imageSrc={reply.author.image}
                altText={`${reply.author.name}'s avatar`}
                width={20}
                height={20}
                userId={reply.author.id}
              />
            ))}

            {review.replies && review._count.replies > 3 && (
              <div className="text-xs ml-1 text-gray2">
                + {review._count.replies - 3}
              </div>
            )}
          </div>
        )}
        {/* Date  */}
        <div className="text-gray2 text-xs ml-auto">
          {formatDateShort(new Date(review.createdAt))}
        </div>
      </div>

      <Stars
        className="fixed top-4 left-1/2 transform -translate-x-1/2  bg-stars p-1 rounded-full shadow-stars flex items-center gap-1 text-xs pr-2 border border-silver "
        rating={review.rating}
        color={"#000"}
        soundName={review.album?.name || review.track?.name}
        artist={review.album?.artist || review.track?.album.artist}
      />
    </div>
  );
};

function formatDateShort(date: Date): string {
  const now = new Date();
  const yearsDifference = differenceInYears(now, date);
  if (yearsDifference > 0) return `${yearsDifference}Y`;

  const monthsDifference = differenceInMonths(now, date);
  if (monthsDifference > 0) return `${monthsDifference}MO`;

  const daysDifference = differenceInDays(now, date);
  if (daysDifference > 0) return `${daysDifference}D`;

  const hoursDifference = differenceInHours(now, date);
  if (hoursDifference > 0) return `${hoursDifference}H`;

  const minutesDifference = differenceInMinutes(now, date);
  if (minutesDifference > 0) return `${minutesDifference}M`;

  return `${differenceInSeconds(now, date)}S`;
}

{
  /* Reply Input  */
}
{
}
