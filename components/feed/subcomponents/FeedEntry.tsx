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

export const FeedEntry: React.FC<EntryProps> = ({ review }) => {
  const { data: session } = useSession();
  const album = review.appleAlbumData;

  const { liked, handleLikeClick, likeCount } = useHandleLikeClick(
    review.likedByUser,
    review._count.likes,
    "/api/review/post/like",
    "reviewId",
    review.id,
    session,
  );

  const handleEntryClick = useHandleEntryClick(review);

  return (
    <div className="flex">
      <p className="text-[#3C3C43]/90 font-medium text-sm leading-[75%] translate-y-[384px] mr-2 text-end min-w-[126px]">
        {review.author.name}
      </p>
      <UserAvatar
        className="w-10 h-10 translate-y-[369px] outline outline-[.5px] outline-silver mr-2"
        imageSrc={review.author.image}
        altText={`${review.author.name}'s avatar`}
        width={40}
        height={40}
        user={review.author}
      />
      {/*<EntryBlob className={`translate-y-[339.5px]`} />*/}
      <div className="flex flex-col max-w-[384px] bg-[#F4F4F4] rounded-[13px] relative p-4">
        {/* Artwork */}
        <Artwork album={album} />
        {/* Rating & Sound Names */}
        <Stars
          className={`absolute top-[335px] -left-[13px] shadow-stars outline outline-silver outline-[.5px] pr-2 rounded-br-lg rounded-tr-lg rounded-bl-2xl rounded-tl-2xl`}
          rating={review.rating}
          soundName={album.attributes.name}
          artist={album.attributes.artistName}
        />

        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-4 w-full text-sm text-[#3C3C43]/60 leading-normal cursor-pointer mt-[11px]`}
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
  );
};
