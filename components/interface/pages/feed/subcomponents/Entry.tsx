import React from "react";
import { useSession } from "next-auth/react";

import { ReviewData } from "@/lib/global/interfaces";
import useHandleLikeClick from "@/hooks/handleInteractions/useHandleLike";
import { useHandleEntryClick } from "@/hooks/handlePageChange/useHandleEntryClick";
import { useHandleUserClick } from "@/hooks/handlePageChange/useHandleUserClick";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";

import { ArtworkHeader } from "./ArtworkHeader";
import Line from "@/components/interface/pages/entry/sub/icons/Line";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";

interface EntryProps {
  review: ReviewData;
}

export const Entry: React.FC<EntryProps> = ({ review }) => {
  const { data: session } = useSession();
  const isAlbum = review.albumId ? true : false;

  const { liked, handleLikeClick } = useHandleLikeClick(
    review.likedByUser!,
    review.likes,
    "/api/review/post/like",
    "reviewId",
    review.id,
    session
  );

  const handleEntryClick = useHandleEntryClick(review.id);
  const handleUserClick = useHandleUserClick(review.author.id);
  return (
    <>
      <div className="flex flex-col">
        {/* Artwork  */}
        {isAlbum ? (
          <div className="ml-auto -mb-2">
            <ArtworkHeader
              albumId={review.albumId}
              rating={review.rating}
              album={review.album}
            />
          </div>
        ) : (
          <div className="ml-auto">
            <ArtworkHeader
              songId={review.trackId}
              rating={review.rating}
              album={review.album}
            />
          </div>
        )}

        {/* Rating + User + Username */}
        <div className="flex gap-2 items-center w-full relative">
          <div className="absolute w-2 h-2 bg-white shadow-stars -top-2 left-7 rounded-full" />
          <Stars
            className="absolute bg-white p-1 rounded-full shadow-stars -top-8 left-8 flex items-center gap-1 text-[10px] pr-2"
            rating={review.rating}
            color={"#000"}
            soundName={review.album?.name || review.track?.name}
            artist={review.album?.artist || review.track?.album.artist}
          />
          <UserAvatar
            className="border border-silver"
            imageSrc={review.author.image}
            altText={`${review.author.name}'s avatar`}
            width={32}
            height={32}
            userId={review.author.id}
          />
          <div
            onClick={handleUserClick}
            className={`font-medium text-sm text-black hoverable-small w-full`}
          >
            {review.author.name}
          </div>
        </div>

        {/* Line + Content */}
        <div className="flex relative">
          <div className="flex flex-col w-10">
            {review._count.replies > 0 && (
              <Line className="flex-grow translate-x-4" />
            )}
          </div>
          <div
            onClick={handleEntryClick}
            className={`w-[470px] text-sm text-black break-words hoverable-small line-clamp-3 pb-[4px]`}
          >
            {review.content}
          </div>
          <div className="absolute right-0 -bottom-5">
            <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
          </div>
        </div>

        {/* Reply Avatars + Stats */}
        <div className="flex items-center">
          <div className="w-10">
            {review._count.replies > 0 && (
              <UserAvatar
                className="translate-x-2 border border-silver"
                imageSrc={review.replies[0].author.image}
                altText={`${review.replies[0].author.name}'s avatar`}
                width={16}
                height={16}
                userId={review.replies[0].author.id}
              />
            )}
          </div>
          <div className="flex gap-2 text-xs text-gray2 w-[470px]">
            {(review._count.likes > 0 || review._count.replies > 0) && (
              <div className="flex gap-1">
                {review._count.replies > 0 && (
                  <div>{review._count.replies} CHAINS</div>
                )}
                {review._count.replies > 0 && review._count.likes > 0 && (
                  <div>&middot;&middot;&middot;</div>
                )}
                {review._count.likes > 0 && (
                  <div>{review._count.likes} HEART</div>
                )}
              </div>
            )}

            {(review._count.likes > 0 || review._count.replies > 0) && (
              <div>&#8211;</div>
            )}
            <div className="text-gray2 text-xs">
              {formatDateShort(new Date(review.createdAt))}
            </div>
          </div>
        </div>

        {/* More than one reply*/}
        {review._count.replies > 1 && (
          <div className="flex flex-col">
            <Line className="h-4 translate-x-4" />

            <UserAvatar
              className="translate-x-2 border border-silver"
              imageSrc={review.replies[1].author.image}
              altText={`${review.replies[1].author.name}'s avatar`}
              width={16}
              height={16}
              userId={review.replies[1].author.id}
            />
          </div>
        )}
      </div>
      <hr className={`border-silver w-[100%] border-dashed mt-6`} />
    </>
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
