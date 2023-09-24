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
    review.likes,
    "/api/review/post/like",
    "reviewId",
    review.id,
    session,
  );

  const handleEntryClick = useHandleEntryClick(review.id);

  return (
    <div className="flex flex-col w-[416px]">
      {/*Entry Content*/}
      <div className="flex flex-col w-full bg-[#F4F4F4] rounded-[13px] relative p-4">
        {/* Rating & Names */}
        <div className="flex items-center relative gap-2 ">
          <UserAvatar
            className="!border-none outline outline-1 outline-silver"
            imageSrc={review.author.image}
            altText={`${review.author.name}'s avatar`}
            width={32}
            height={32}
            userId={review.author.id}
          />
          <p className="text-[#3C3C43]/60 font-medium text-sm leading-none">
            {review.author.name}
          </p>
          <div className="w-2 h-2 bg-[#E5E5E6] border border-silver rounded-full absolute left-7 -translate-y-5" />
          <Stars
            className="absolute left-[2.25rem] -translate-y-[2.25rem]"
            rating={review.rating}
          />
        </div>
        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-6 w-full text-sm text-gray4 -mt-[4px] leading-normal pl-10`}
        >
          {review.content}
        </div>
        <LikeButton
          handleLikeClick={handleLikeClick}
          liked={liked}
          className="absolute -bottom-2 -right-2"
          likeCount={likeCount}
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
