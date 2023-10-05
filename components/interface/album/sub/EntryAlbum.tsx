import React from "react";
import { useSession } from "next-auth/react";

import { ReviewData } from "@/lib/global/interfaces";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";
import { useHandleEntryClick } from "@/hooks/useInteractions/useHandlePageChange";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";

import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";
import { useSound } from "@/context/Sound";

interface EntryAlbumProps {
  review: ReviewData;
}

export const EntryAlbum: React.FC<EntryAlbumProps> = ({ review }) => {
  const { data: session } = useSession();
  const { selectedSound } = useSound();

  // Since it's rendered within an album page, assume the selected
  // sound/album is the same as the review
  let mergedReview: ReviewData = review;

  if (selectedSound) {
    mergedReview = {
      ...review,
      appleAlbumData: {
        ...selectedSound.sound,
      },
    };
  }

  const { liked, handleLikeClick, likeCount } = useHandleLikeClick(
    review.likedByUser,
    review._count.likes,
    "/api/review/post/like",
    "reviewId",
    review.id,
    session,
  );

  const handleEntryClick = useHandleEntryClick(mergedReview);

  return (
    <div className="flex w-[416px]">
      <UserAvatar
        className="z-10 w-12 h-12 translate-y-[6px] outline outline-4 outline-white"
        imageSrc={review.author.image}
        altText={`${review.author.name}'s avatar`}
        width={48}
        height={48}
        user={review.author}
      />
      <div className="flex flex-col w-full bg-[#F4F4F4] rounded-[13px] relative p-4 -ml-3">
        {/* Rating & Names */}
        <Stars
          className="outline-4 outline-white outline w-fit -mt-7"
          rating={review.rating}
        />
        <p className="text-[#3C3C43]/90 font-medium text-sm leading-[75%] mt-[13px] pl-2">
          {review.author.name}
        </p>
        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-6 w-full text-sm text-[#3C3C43]/90 leading-normal cursor-pointer mt-[5px] pl-2`}
        >
          {review.content}
        </div>
        <LikeButton
          handleLikeClick={handleLikeClick}
          liked={liked}
          className="absolute -bottom-2 -right-2"
          likeCount={likeCount}
          replyCount={review._count.replies}
        />
      </div>
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

  return `${differenceInSeconds(now, date)}s`;
}
