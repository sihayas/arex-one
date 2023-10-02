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
import { EntryBlobAlbum } from "@/components/icons";
import { Artwork } from "@/components/index/feed/subcomponents/Artwork";

interface EntryAlbumProps {
  review: ReviewData;
}

export const EntryAlbum: React.FC<EntryAlbumProps> = ({ review }) => {
  const { data: session } = useSession();

  const { liked, handleLikeClick, likeCount } = useHandleLikeClick(
    review.likedByUser,
    review._count.likes,
    "/api/review/post/like",
    "reviewId",
    review.id,
    session,
  );

  const handleEntryClick = useHandleEntryClick(review);

  return (
    <div className="flex flex-col w-[416px]">
      {/*Entry Content*/}
      <div className="flex flex-col w-full bg-[#F4F4F4] rounded-[13px] relative p-4 pt-8">
        {/* Rating & Names */}
        <div className="flex items-center relative gap-2">
          <UserAvatar
            className="outline outline-2 outline-[#E5E5E6] z-0"
            imageSrc={review.author.image}
            altText={`${review.author.name}'s avatar`}
            width={40}
            height={40}
            userId={review.author.id}
          />
          <p className="text-[#3C3C43]/60 font-medium text-sm leading-none mt-[5px]">
            {review.author.name}
          </p>
          <Stars
            className="absolute left-[28px] -translate-y-[22px]"
            rating={review.rating}
          />
        </div>
        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-6 w-full text-sm text-gray4 -mt-[7px] leading-normal pl-12`}
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
