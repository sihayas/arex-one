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

import { Artwork } from "./Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";
import { EntryBlob } from "@/components/icons";
import Line from "@/components/interface/entry/sub/icons/Line";

interface EntryProps {
  review: ReviewData;
}

export const Entry: React.FC<EntryProps> = ({ review }) => {
  const { data: session } = useSession();
  const album = review.appleAlbumData;

  const { liked, handleLikeClick } = useHandleLikeClick(
    review.likedByUser!,
    review.likes,
    "/api/review/post/like",
    "reviewId",
    review.id,
    session,
  );

  const handleEntryClick = useHandleEntryClick(review.id);

  return (
    <div className="flex items-end">
      {/* Attribution / Left Side */}
      <div className="flex flex-row-reverse items-center gap-2 pb-10">
        <EntryBlob width={13} height={47} fill={"#F4F4F4"} />
        <UserAvatar
          className="outline outline-white !border-none"
          imageSrc={review.author.image}
          altText={`${review.author.name}'s avatar`}
          width={48}
          height={48}
          userId={review.author.id}
        />
      </div>
      {/* Entry / Right Side */}
      <div className="flex flex-col max-w-[340px]">
        {/*Entry Content*/}
        <div className="flex flex-col w-full bg-[#F4F4F4] rounded-[13px] relative p-4">
          {/* Artwork */}
          <Artwork album={album} />
          {/* Rating & Names */}
          <div className="flex items-center relative gap-2 mt-4">
            <Stars
              className="bg-[#E5E5E6] p-2 rounded-full"
              rating={review.rating}
              color={"#808084"}
            />
            <div className="flex flex-col justify-center gap-[6px]">
              <div className="text-xs text-gray4 leading-none">
                {album.attributes.artistName}
              </div>
              <div className="font-medium text-sm text-gray4 leading-none">
                {album.attributes.name}
              </div>
            </div>
          </div>

          {/* Line */}
          <Line
            className="ml-auto mt-[14px] -mr-4 rounded-full"
            width={"288px"}
            height={"1px"}
            color={"rgba(0, 0, 0, 0.05)"}
          />

          {/* Content*/}
          <div
            onClick={handleEntryClick}
            className={`break-words line-clamp-6 w-full text-sm text-gray4 mt-[3px] leading-normal pl-9`}
          >
            {review.content}
          </div>
        </div>
        {/* Attribution */}
        <div className="flex justify-between items-center p-4 pt-[6px]">
          <p className="text-gray2 text-sm leading-none">
            {review.author.name}
          </p>
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
