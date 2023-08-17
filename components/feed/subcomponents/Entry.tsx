import React from "react";
import { useSession } from "next-auth/react";

import { ReviewData } from "@/lib/global/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import useHandleLikeClick from "@/hooks/handleInteractions/useLike";
import { useHandleEntryClick } from "@/hooks/handlePageChange/useHandleEntryClick";
import { useHandleUserClick } from "@/hooks/handlePageChange/useHandleUserClick";

import { ArtworkHeader } from "./ArtworkHeader";
import { LargeAviCap, SmallAviCap } from "../../icons";
import Line from "@/components/cmdk/pages/entry/sub/icons/Line";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";

interface EntryProps {
  review: ReviewData;
}

export const Entry: React.FC<EntryProps> = ({ review }) => {
  const { data: session } = useSession();
  const { setIsVisible } = useCMDK();

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
        <div className="mb-1 ml-9 z-10">
          <ArtworkHeader
            albumId={review.albumId}
            rating={review.rating}
            album={review.album}
          />
        </div>
        {/* Avatar, Content+Like Button */}
        <div className="flex gap-2 items-end w-full">
          <div className="relative">
            <UserAvatar
              className="max-w-6 max-h-6"
              imageSrc={review.author.image}
              altText={`${review.author.name}'s avatar`}
              width={24}
              height={24}
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

          <div className={`relative w-[484px]`}>
            <div
              onClick={() => {
                handleEntryClick();
                setIsVisible((prevIsVisible) => !prevIsVisible);
              }}
              className={`w-[full] text-[13px] leading-normal px-4 py-2 bg-white text-black border border-silver rounded-2xl rounded-bl-[4px] break-words overflow-visible hoverable-small`}
            >
              {review.content}
              <div
                className={`absolute -right-3 -bottom-3 bg-white ${
                  liked ? "opacity-100" : "opacity-0"
                } group-hover:opacity-100 transition-opacity`}
              >
                <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
              </div>
            </div>
            {/* Name  */}
            <div
              onClick={() => {
                handleUserClick();
                setIsVisible((prevIsVisible) => !prevIsVisible);
              }}
              className={`absolute left-2 -bottom-6 font-medium text-[13px] text-black hoverable-small`}
            >
              {review.author.name}
            </div>
          </div>
        </div>
      </div>
      <hr
        className={`border-silver w-[100%] ${
          review._count.replies > 0 && review._count.likes > 0
            ? "mt-[5.75rem]"
            : review._count.replies > 0 && review._count.likes === 0
            ? "mt-[5.75rem]"
            : review._count.likes > 0 && review._count.replies === 0
            ? "mt-[4.25rem]"
            : "mt-[2.5rem]"
        }`}
      />
    </>
  );
};
