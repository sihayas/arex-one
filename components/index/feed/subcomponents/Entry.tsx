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

  const handleEntryClick = useHandleEntryClick(review);

  return (
    <div className="flex max-w-[398px]">
      <UserAvatar
        className="z-10 w-12 h-12 translate-y-[347px] outline outline-4 outline-white"
        imageSrc={review.author.image}
        altText={`${review.author.name}'s avatar`}
        width={48}
        height={48}
        userId={review.author.id}
      />
      <div className="flex flex-col w-full bg-[#F4F4F4] rounded-[13px] relative p-4 -ml-2">
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
          className={`break-words line-clamp-6 w-full text-sm text-gray4 leading-normal cursor-pointer mt-[5px] pl-2`}
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

// <div className="flex flex-col max-w-[416px]">
//   {/*Entry Content*/}
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
