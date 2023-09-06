import React from "react";
import { useSession } from "next-auth/react";

import { ReviewData } from "@/lib/global/interfaces";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";
import {
  useHandleEntryClick,
  useHandleUserClick,
} from "@/hooks/useInteractions/useHandlePageChange";
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
import { StatLineIcon, EntryBlob } from "@/components/icons";

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
    <div className="flex items-end">
      {/* Attribution */}
      <div className="flex flex-row-reverse items-center gap-2 pb-2">
        <EntryBlob width={13} height={47} fill={"#F4F4F4"} />
        <UserAvatar
          className="border-4 border-white"
          imageSrc={review.author.image}
          altText={`${review.author.name}'s avatar`}
          width={48}
          height={48}
          userId={review.author.id}
        />
        {/* <div
          onClick={handleUserClick}
          className="font-medium text-sm text-gray2"
        >
          {review.author.name}
        </div> */}
      </div>
      <div className="flex flex-col w-full bg-[#F4F4F4] p-4 max-w-[416px] rounded-[13px] relative">
        {/* Artwork & Entry  */}
        {isAlbum ? (
          <Artwork
            albumId={review.albumId}
            album={review.album}
            type="albumId"
          />
        ) : (
          <Artwork songId={review.trackId} album={review.album} type="songId" />
        )}
        {/* Rating & Info */}
        <div className="flex items-center pt-4 gap-2">
          <Stars
            className="bg-[#767680] bg-opacity-10 p-[6px] rounded-full flex items-center gap-1"
            rating={review.rating}
            color={"rgba(60, 60, 67, 0.6)"}
          />
          <div className="flex flex-col  text-xs text-gray4">
            <p className="font-medium">{review.album?.name}</p>
            <p>{review.album?.artist}</p>
          </div>
        </div>

        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`pl-[38px] break-words line-clamp-6 w-full text-sm text-gray4 pt-2`}
        >
          {review.content}
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

// <LikeButton
//   className="absolute left-[10px] -top-[38px] bg-white p-[6px] pt-[7px]  rounded-full"
//   handleLikeClick={handleLikeClick}
//   liked={liked}
//   width={12}
//   height={11}
// />;

{
  /* Attribution */
}
// <div className="flex items-center gap-2">

// </div>;

{
  /* Replies and Likes  */
}
// <div className="flex items-center gap-2 hoverable-small relative">
//   {/* Avatar previews */}
//   {review.replies && review._count.replies > 0 && (
//     <div className="flex items-center ml-[28px] mt-1">
//       <StatLineIcon
//         color={"#CCC"}
//         width={10}
//         height={11}
//         className={"absolute top-[4px] left-[11px]"}
//       />
//       {review.replies.slice(0, 3).map((reply, index) => (
//         <UserAvatar
//           key={index}
//           className={`!border-2 border-white ${
//             index !== 0 ? "-ml-1" : ""
//           }`}
//           imageSrc={reply.author.image}
//           altText={`${reply.author.name}'s avatar`}
//           width={24}
//           height={24}
//           userId={reply.author.id}
//         />
//       ))}

//       {/* show count + word chain(s) */}
//       <div className="text-xs text-gray2 ml-2">
//         {`${review._count.replies} CHAIN${
//           review._count.replies > 1 ? "S" : ""
//         }`}
//       </div>
//     </div>
//   )}
//   {/* Reply Count  */}
//   {review._count.replies > 0 && review._count.likes > 0 && (
//     <div className="text-xs text-gray3 mt-1">+</div>
//   )}

//   {review.likes && review._count.likes > 0 && (
//     <div className="flex items-center text-xs text-gray2 mt-1">
//       {review._count.likes}{" "}
//       {review._count.likes > 1 ? "HEARTS" : "HEART"}
//     </div>
//   )}
// </div>;
