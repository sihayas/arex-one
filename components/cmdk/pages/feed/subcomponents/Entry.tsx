import React from "react";
import { useSession } from "next-auth/react";

import { ReviewData } from "@/lib/global/interfaces";
import useHandleLikeClick from "@/hooks/handleInteractions/useLike";
import { useHandleEntryClick } from "@/hooks/handlePageChange/useHandleEntryClick";
import { useHandleUserClick } from "@/hooks/handlePageChange/useHandleUserClick";

import { ArtworkHeader } from "./ArtworkHeader";
import Line from "@/components/cmdk/pages/entry/sub/icons/Line";
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

        {/* User */}
        <div className="flex gap-2 items-center w-full relative">
          <div className="absolute w-2 h-2 bg-white shadow-stars -top-2 left-7 rounded-full" />
          <Stars
            className="absolute bg-white p-1 rounded-full shadow-stars -top-8 left-8 flex items-center gap-1 text-[10px] pr-2 font-semibold"
            rating={review.rating}
            color={"#000"}
            names={review.album?.name}
          />
          <UserAvatar
            imageSrc={review.author.image}
            altText={`${review.author.name}'s avatar`}
            width={32}
            height={32}
          />
          <div
            onClick={handleUserClick}
            className={`font-medium text-[13px] text-black hoverable-small w-full`}
          >
            {review.author.name}
          </div>
        </div>

        <div
          onClick={handleEntryClick}
          className={`pl-[40px] w-[full] text-sm text-black break-words hoverable-small line-clamp-3`}
        >
          {review.content}
        </div>
      </div>
      <hr
        className={`border-silver w-[100%] border-dashed ${
          review._count.replies > 0 && review._count.likes > 0
            ? "mt-[6.75rem]"
            : review._count.replies > 0 && review._count.likes === 0
            ? "mt-[6.75rem]"
            : review._count.likes > 0 && review._count.replies === 0
            ? "mt-[5.25rem]"
            : "mt-[3.5rem]"
        }`}
      />
    </>
  );
};
