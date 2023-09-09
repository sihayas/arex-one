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

interface EntryAlbumProps {
  review: ReviewData;
}

export const EntryAlbum: React.FC<EntryAlbumProps> = ({ review }) => {
  const { data: session } = useSession();
  const album = review.appleAlbumData;

  const { liked, handleLikeClick } = useHandleLikeClick(
    review.likedByUser!,
    review.likes,
    "/api/review/post/like",
    "reviewId",
    review.id,
    session
  );

  const handleEntryClick = useHandleEntryClick(review.id);

  return (
    <div className="flex flex-col p-8 w-full pt-0">
      {/* Rating & Info */}
      <div className="flex items-start gap-2 w-full bg-[#F4F4F4] p-4 max-w-[416px] rounded-[13px]">
        <div className="flex items-center">
          <Stars
            className="bg-[#767680] bg-opacity-10 p-[6px] rounded-full flex items-center gap-1"
            rating={review.rating}
            color={"rgba(60, 60, 67, 0.6)"}
          />
        </div>

        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-6 w-full text-sm text-gray4`}
        >
          {review.content}
        </div>
      </div>
      <EntryBlobAlbum
        className="mr-auto"
        width={47}
        height={13}
        fill={"#F4F4F4"}
      />
      <div className="flex items-center gap-2">
        <UserAvatar
          className="border-4 border-white ml-2"
          imageSrc={review.author.image}
          altText={`${review.author.name}'s avatar`}
          width={32}
          height={32}
          userId={review.author.id}
        />
        <div className="text-sm text-gray2 font-medium">
          {review.author.name}
        </div>
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

// <EntryBlob width={13} height={47} fill={"#F4F4F4"} />
// <UserAvatar
//   className="border-4 border-white"
//   imageSrc={review.author.image}
//   altText={`${review.author.name}'s avatar`}
//   width={48}
//   height={48}
//   userId={review.author.id}
// />
