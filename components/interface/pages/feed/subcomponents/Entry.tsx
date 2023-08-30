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
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";
import { StatLineIcon } from "@/components/icons";

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
          <div className="ml-auto mb-2 relative">
            <ArtworkHeader albumId={review.albumId} album={review.album} />
          </div>
        ) : (
          <div className="ml-auto mb-2 relative">
            <ArtworkHeader songId={review.trackId} album={review.album} />
          </div>
        )}

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
            <div
              onClick={handleEntryClick}
              className={`break-words hoverable-small line-clamp-6`}
            >
              {review.content}
            </div>
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
          <div
            onClick={handleUserClick}
            className={`font-medium text-sm text-black hoverable-small w-full`}
          >
            {review.author.name}
          </div>
        </div>

        {/* Replies and Likes  */}
        <div className="flex items-center gap-2 hoverable-small relative">
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
              {review._count.likes}{" "}
              {review._count.likes > 1 ? "HEARTS" : "HEART"}
            </div>
          )}
        </div>
      </div>
      <hr className={`border-silver w-[100%] border-[.5px] mt-6`} />
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

// <div className="text-gray2 text-xs">
//   {formatDateShort(new Date(review.createdAt))}
// </div>;

// {
//   /* Reply Avatars + Stats */
// }
// <div className="flex items-center">
//   <div className="w-10">
//     {review._count.replies > 0 && (
//       <UserAvatar
//         className="translate-x-2 border border-silver"
//         imageSrc={review.replies[0].author.image}
//         altText={`${review.replies[0].author.name}'s avatar`}
//         width={16}
//         height={16}
//         userId={review.replies[0].author.id}
//       />
//     )}
//   </div>
//   <div className="flex gap-2 text-xs text-gray2 w-[470px]">
//     {(review._count.likes > 0 || review._count.replies > 0) && (
//       <div className="flex gap-1">
//         {review._count.replies > 0 && (
//           <div>{review._count.replies} CHAINS</div>
//         )}
//         {review._count.replies > 0 && review._count.likes > 0 && (
//           <div>&middot;&middot;&middot;</div>
//         )}
//         {review._count.likes > 0 && (
//           <div>{review._count.likes} HEART</div>
//         )}
//       </div>
//     )}

//     {(review._count.likes > 0 || review._count.replies > 0) && (
//       <div>&#8211;</div>
//     )}
//   </div>
// </div>;

// <div className="absolute right-0 -bottom-5">
// </div>;
