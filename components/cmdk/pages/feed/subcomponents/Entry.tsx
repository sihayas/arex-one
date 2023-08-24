import React from "react";
import { useSession } from "next-auth/react";

import { ReviewData } from "@/lib/global/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import useHandleLikeClick from "@/hooks/handleInteractions/useLike";
import { useHandleEntryClick } from "@/hooks/handlePageChange/useHandleEntryClick";
import { useHandleUserClick } from "@/hooks/handlePageChange/useHandleUserClick";

import { ArtworkHeader } from "./ArtworkHeader";
import { LargeAviCap, SmallAviCap } from "../../../../icons";
import Line from "@/components/cmdk/pages/entry/sub/icons/Line";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";

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
      <div className="flex flex-col group">
        {/* Artwork  */}
        {isAlbum ? (
          <div className="mb-1 ml-[2.75rem] z-10">
            <ArtworkHeader
              albumId={review.albumId}
              rating={review.rating}
              album={review.album}
            />
          </div>
        ) : (
          <div className="mb-1 ml-[2.75rem] z-10">
            <ArtworkHeader
              songId={review.trackId}
              rating={review.rating}
              album={review.album}
            />
          </div>
        )}

        {/* Avatar, Content+Like Button */}
        <div className="flex gap-2 items-end w-full">
          <div className="relative">
            <UserAvatar
              imageSrc={review.author.image}
              altText={`${review.author.name}'s avatar`}
              width={32}
              height={32}
            />

            {review._count.replies === 1 && (
              <>
                <Line className="absolute h-[46px] ml-[11px] translate-y-1" />
                <UserAvatar
                  className="absolute ml-1 mt-[3.25rem]"
                  imageSrc={review.replies[0].author.image}
                  altText={`${review.replies[0].author.name}'s avatar`}
                  width={16}
                  height={16}
                />
                <div className="absolute top-14 left-10 flex text-xs text-gray2 w-max">
                  {review._count.likes > 0 && (
                    <div>{review._count.likes} Heart</div>
                  )}
                </div>
                <SmallAviCap
                  className="absolute -left-1 top-[71px]"
                  width={32}
                  height={32}
                />
              </>
            )}

            {review._count.replies > 1 && (
              <>
                <Line className="absolute h-2 ml-[11px] translate-y-1" />
                <UserAvatar
                  className="absolute ml-[6px] mt-[1rem]"
                  imageSrc={review.replies[0].author.image}
                  altText={`${review.replies[0].author.name}'s avatar`}
                  width={12}
                  height={12}
                />

                <Line className="absolute h-[18px] ml-[11px] translate-y-8" />

                <UserAvatar
                  className="absolute ml-1 mt-[3.25rem]"
                  imageSrc={review.replies[1].author.image}
                  altText={`${review.replies[1].author.name}'s avatar`}
                  width={16}
                  height={16}
                />
                <div className="absolute top-14 left-10 flex gap-2 text-xs text-gray3 w-max">
                  <div>{review._count.replies} Chains</div>
                  <div>&middot;</div>
                  {review._count.likes > 0 && (
                    <div>{review._count.likes} Heart</div>
                  )}
                </div>
                <SmallAviCap
                  className="absolute -left-1 top-[71px]"
                  width={32}
                  height={32}
                />
              </>
            )}

            {review._count.replies === 0 && review._count.likes > 0 && (
              <div className="absolute -bottom-[50px] left-10 text-xs text-gray3 w-max">
                {review._count.likes} Heart
              </div>
            )}
          </div>

          <div className={`relative w-fit`}>
            <div
              onClick={handleEntryClick}
              className={`w-[full] text-[13px] px-[8px] py-1 bg-white text-black border-b border-silver break-words hoverable-small line-clamp-3`}
            >
              {review.content}
              <div
                className={`absolute -right-2 -bottom-2 bg-white ${
                  liked ? "opacity-100" : "opacity-0"
                } group-hover:opacity-100 transition-opacity`}
              >
                <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
              </div>
            </div>
            {/* Name  */}
            <div
              onClick={handleUserClick}
              className={`absolute left-2 -bottom-6 font-medium text-[13px] text-black hoverable-small w-max`}
            >
              {review.author.name}
            </div>
          </div>
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
