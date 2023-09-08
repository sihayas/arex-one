import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useInterfaceContext } from "@/context/InterfaceContext";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";
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
import { useSound } from "@/context/Sound";
import { StatLineIcon } from "@/components/icons";

interface EntryFullProps {
  review: ReviewData;
  artworkUrl: string;
}

export const EntryFull: React.FC<EntryFullProps> = ({ review, artworkUrl }) => {
  const { data: session } = useSession();
  const { entryContainerRef } = useInterfaceContext();

  const { selectedSound } = useSound();

  const boxShadow = useMemo(() => {
    if (selectedSound?.colors[0]) {
      return `0px 0px 0px 0px ${selectedSound.colors[0]}, 0.15),
        2px 2px 7px 0px ${selectedSound.colors[0]}, 0.15),
        9px 9px 13px 0px ${selectedSound.colors[0]}, 0.13),
        20px 20px 17px 0px ${selectedSound.colors[0]}, 0.08),
        35px 36px 20px 0px ${selectedSound.colors[0]}, 0.02),
        55px 57px 22px 0px ${selectedSound.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedSound?.colors]);

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
      <Image
        className="rounded-[12px] -z-10 ml-auto mb-[70px]"
        style={{
          boxShadow: boxShadow,
        }}
        src={artworkUrl || "/public/images/default.png"}
        alt={`artwork`}
        width={363}
        height={363}
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
      />
      {/* Rating + Content*/}
      <div className="flex items-center w-full relative">
        <div className="absolute w-1 h-1 bg-white shadow-entry -top-1 -left-1 rounded-full" />
        <div className="absolute w-3 h-3 bg-white shadow-entry -top-4 rounded-full" />
        <LikeButton
          className="absolute left-[10px] -top-[38px] bg-white p-[6px] pt-[7px] shadow-entry rounded-full"
          handleLikeClick={handleLikeClick}
          liked={liked}
          width={12}
          height={11}
        />
        <Stars
          className="absolute bg-white shadow-entry p-1 rounded-full -top-[38px] left-[42px] flex items-center gap-1 text-xs pr-2"
          rating={review.rating}
          color={"#000"}
          soundName={review.album?.name || review.track?.name}
          artist={review.album?.artist || review.track?.album.artist}
        />
        <div className="w-full px-4 py-3 shadow-entry rounded-2xl rounded-bl-[4px] text-sm text-black">
          <div className={`break-words  line-clamp-6`}>{review.content}</div>
        </div>
      </div>

      {/* Attribution */}
      <div className="flex items-center gap-2 pt-2">
        <UserAvatar
          className="border border-silver"
          imageSrc={review.author.image}
          altText={`${review.author.name}'s avatar`}
          width={32}
          height={32}
          userId={review.author.id}
        />
        <div className={`font-medium text-sm text-black  w-full`}>
          {review.author.name}
        </div>
      </div>

      {/* Replies and Likes  */}
      <div className="flex items-center gap-2  relative">
        {/* Avatar previews */}
        {review.replies && review._count.replies > 0 && (
          <div className="flex items-center ml-[28px] mt-1">
            <StatLineIcon
              color={"#CCC"}
              width={10}
              height={11}
              className={"absolute top-[4px] left-[11px]"}
            />
            {review.replies.slice(0, 3).map((reply, index) => (
              <UserAvatar
                key={index}
                className={`!border-2 border-white ${
                  index !== 0 ? "-ml-1" : ""
                }`}
                imageSrc={reply.author.image}
                altText={`${reply.author.name}'s avatar`}
                width={24}
                height={24}
                userId={reply.author.id}
              />
            ))}

            {/* show count + word chain(s) */}
            <div className="text-xs text-gray2 ml-2">
              {`${review._count.replies} CHAIN${
                review._count.replies > 1 ? "S" : ""
              }`}
            </div>
          </div>
        )}
        {/* Reply Count  */}
        {review._count.replies > 0 && review._count.likes > 0 && (
          <div className="text-xs text-gray3 mt-1">+</div>
        )}

        {review.likes && review._count.likes > 0 && (
          <div className="flex items-center text-xs text-gray2 mt-1">
            {review._count.likes} {review._count.likes > 1 ? "HEARTS" : "HEART"}
          </div>
        )}
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

  return `${differenceInSeconds(now, date)}S`;
}
{
  /* Like & Avatar previews */
}

// <Stars
//   className="fixed top-4 left-1/2 transform -translate-x-1/2  bg-stars p-1 rounded-full shadow-stars flex items-center gap-1 text-xs pr-2 border border-silver "
//   rating={review.rating}
//   color={"#000"}
//   soundName={review.album?.name || review.track?.name}
//   artist={review.album?.artist || review.track?.album.artist}
// />
//   {/* Date  */}
//   <div className="text-gray2 text-xs ml-auto">
//     {formatDateShort(new Date(review.createdAt))}
//   </div>
