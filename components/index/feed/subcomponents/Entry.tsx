import React from "react";
import { useSession } from "next-auth/react";

import { ReviewData } from "@/lib/global/interfaces";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";
import { useHandleEntryClick } from "@/hooks/useInteractions/useHandlePageChange";

import { Artwork } from "./Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";

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
    <div className="flex flex-col max-w-[340px]">
      {/*Entry Content*/}
      <div className="flex flex-col w-full bg-[#F4F4F4] rounded-[13px] relative p-4">
        {/* Artwork */}
        <Artwork album={album} />
        {/* Rating & Names */}
        <div className="flex items-center relative gap-2 mt-4">
          <UserAvatar
            className="!border-none outline outline-1 outline-silver"
            imageSrc={review.author.image}
            altText={`${review.author.name}'s avatar`}
            width={32}
            height={32}
            userId={review.author.id}
          />
          <p className="text-[#3C3C43]/60 font-medium text-sm leading-none">
            {review.author.name}
          </p>
          <div className="w-2 h-2 bg-[#E5E5E6] border border-silver rounded-full absolute left-7 -translate-y-4" />
          <Stars
            className="absolute left-8 -translate-y-8"
            rating={review.rating}
            soundName={album.attributes.name}
            artist={album.attributes.artistName}
          />
        </div>
        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-6 w-full text-sm text-gray4 -mt-[4px] leading-normal pl-10`}
        >
          {review.content}
        </div>
        <LikeButton
          handleLikeClick={handleLikeClick}
          liked={liked}
          className="absolute -bottom-2 -right-2"
        />
      </div>
    </div>
  );
};
