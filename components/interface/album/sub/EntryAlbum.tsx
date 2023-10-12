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
import { motion } from "framer-motion";
import { EntryBlob, EntryBlobAlbum } from "@/components/icons";
import { Artwork } from "@/components/feed/subcomponents/Artwork";

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

  if (!selectedSound?.sound) {
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      <div className="flex items-center gap-2 ml-5 mb-2">
        <UserAvatar
          className="w-10 h-10 outline outline-[.5px] outline-silver"
          imageSrc={review.author.image}
          altText={`${review.author.name}'s avatar`}
          width={40}
          height={40}
          user={review.author}
        />
        <p className="text-gray2 font-medium text-sm leading-[75%]">
          {review.author.name}
        </p>
      </div>

      <EntryBlobAlbum className={" ml-4"} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col w-[404px] bg-[#F4F4F4] rounded-[13px] relative p-4 gap-2">
          {/* Content*/}
          <div
            onClick={handleEntryClick}
            className={`break-words line-clamp-4 w-full text-sm text-[#3C3C43]/60 leading-normal cursor-pointer`}
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
    </motion.div>
  );
};

{
  /* Rating & Sound Names */
}
// <Stars
//     className={`shadow-stars outline outline-silver outline-[.5px] w-fit`}
//     rating={review.rating}
// />
