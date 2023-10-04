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
    <div className="flex max-w-[398px]">
      <UserAvatar
        className="w-12 h-12 translate-y-[347px] outline outline-4 outline-white z-10"
        imageSrc={review.author.image}
        altText={`${review.author.name}'s avatar`}
        width={48}
        height={48}
        user={review.author}
      />
      <div className="flex flex-col w-full bg-[#F4F4F4] rounded-[13px] relative p-4 -ml-3">
        {/* Artwork */}
        <Artwork album={album} />
        {/* Rating & Names */}
        <Stars
          className="outline-4 outline-white outline w-fit -mt-3"
          rating={review.rating}
          soundName={album.attributes.name}
          artist={album.attributes.artistName}
        />
        <p className="text-[#3C3C43]/90 font-medium text-sm leading-[75%] mt-[13px] pl-2">
          {review.author.name}
        </p>
        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-6 w-full text-sm text-[#3C3C43]/90 leading-normal cursor-pointer mt-[5px] pl-2`}
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

// <div className="flex flex-col max-w-[416px]">
//   {/*FeedEntry Content*/}
//   <div className="flex flex-col w-full bg-[#F4F4F4] rounded-[13px] relative p-4">
//     {/* Artwork */}
//     <Artwork album={album} />
//     {/* Rating & Names */}
//     <div className="flex items-center relative gap-2 pt-8">
//       <p className="text-[#3C3C43]/60 font-medium text-sm leading-[75%] mt-[5px]">
//         {review.author.name}
//       </p>
//       <Stars
//         className="absolute left-[28px] -translate-y-[22px]"
//         rating={review.rating}
//         soundName={album.attributes.name}
//         artist={album.attributes.artistName}
//       />
//     </div>
//     {/* Content*/}
//     <div
//       onClick={handleEntryClick}
//       className={`break-words line-clamp-6 w-full text-sm text-gray4 -mt-[7px] leading-normal pl-12 cursor-pointer`}
//     >
//       {review.content}
//     </div>
//     <LikeButton
//       handleLikeClick={handleLikeClick}
//       liked={liked}
//       className="absolute -bottom-2 -right-2"
//     />
//   </div>
// </div>;
