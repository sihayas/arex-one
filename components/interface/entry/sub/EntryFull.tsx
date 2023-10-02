import React from "react";
import { useSession } from "next-auth/react";

import { ReviewData } from "@/lib/global/interfaces";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";

import { Artwork } from "@/components/index/feed/subcomponents/Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";

interface EntryFullProps {
  review: ReviewData;
}

export const EntryFull: React.FC<EntryFullProps> = ({ review }) => {
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

  return (
    <div className="flex flex-col max-w-[480px]">
      {/*Entry Content*/}
      <div className="flex flex-col w-full bg-[#F4F4F4] rounded-[13px] rounded-b-none relative p-4">
        {/* Artwork */}
        <Artwork width={448} height={448} album={album} />
        {/* Rating & Names */}
        <div className="flex items-center relative gap-2 pt-8">
          <UserAvatar
            className="outline outline-2 outline-[#E5E5E6] z-10"
            imageSrc={review.author.image}
            altText={`${review.author.name}'s avatar`}
            width={40}
            height={40}
            userId={review.author.id}
          />
          <p className="text-[#3C3C43]/60 font-medium text-sm leading-[75%] mt-[5px]">
            {review.author.name}
          </p>
          <Stars
            className="absolute left-[28px] -translate-y-[22px]"
            rating={review.rating}
            soundName={album.attributes.name}
            artist={album.attributes.artistName}
          />
        </div>
        {/* Content*/}
        <div
          className={`break-words line-clamp-6 w-full text-sm text-gray4 -mt-[7px] leading-normal pl-12`}
        >
          {review.content}
        </div>
        <LikeButton
          handleLikeClick={handleLikeClick}
          liked={liked}
          className="absolute -bottom-2 right-6"
        />
      </div>
    </div>
  );
};
