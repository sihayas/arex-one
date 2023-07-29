import React from "react";
import { useSession } from "next-auth/react";
import { UserAvatar, LikeButton } from "../cmdk/generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { Stars } from "../cmdk/generics";
import useHandleLikeClick from "@/hooks/useLike";
import { useHandleEntryClick } from "@/hooks/useHandleEntryClick";
import { AlbumHeader } from "./AlbumHeader";

interface FeedAlbumProps {
  review: ReviewData;
}

export const FeedAlbum: React.FC<FeedAlbumProps> = ({ review }) => {
  const { data: session } = useSession();
  const { setPages } = useCMDK();

  // const replyCount = review.replies.length;

  // const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
  //   review.likedByUser,
  //   review.likes,
  //   "/api/review/postLike",
  //   "reviewId",
  //   review.id,
  //   session
  // );

  const handleEntryClick = useHandleEntryClick(review.id);

  const handleUserClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "user",
        user: review.author.id,
      },
    ]);
  };

  return (
    //pb-6 to level with the album header
    <div className="flex flex-col pb-14">
      <div className="translate-x-4 translate-y-4 z-10">
        <AlbumHeader albumId={review.albumId} rating={review.rating} />
      </div>
      <div className="flex gap-1 items-end">
        <UserAvatar
          className="max-w-6 max-h-6"
          imageSrc={review.author.image}
          altText={`${review.author.name}'s avatar`}
          width={24}
          height={24}
        />
        <div className="relative">
          <div
            onClick={handleEntryClick}
            className={`w-full text-[13px] leading-normal px-4 py-2 bg-white text-black border border-silver rounded-2xl rounded-bl-[4px] break-words overflow-visible hoverable-medium`}
          >
            {review.content}
          </div>
          {/* Name  */}
          <div
            onClick={handleUserClick}
            className={`absolute -bottom-6 font-medium text-[13px] text-gray1`}
          >
            {review.author?.name}
          </div>
        </div>
      </div>
    </div>
  );
};

// <div className="flex flex-col gap-2 w-[484px] overflow-visible">
//   {/* Review Content  */}
//   <div className="flex relative">
//     <div
//       onClick={handleEntryClick}
//       className={`w-full text-[13px] leading-normal px-4 py-2 bg-white text-black border border-silver rounded-2xl rounded-bl-[4px] break-words overflow-visible  transition-all duration-300 hover:scale-[102%] hover:shadow-entry hoverable-medium`}
//     >
//       {review.content}
//     </div>
//     <Stars className={"absolute -left-3 -top-3"} rating={review.rating} />

//     {/* Reply Count & Like Count */}
//     <div className="absolute flex  gap-2 -right-3 -bottom-6">
//       {/* Like Count  */}
//       <div className="flex flex-col items-center">
//         <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
//         <div className=" text-[10px] text-gray2">{likeCount}</div>
//       </div>
//     </div>
//   </div>

//   {/* Attribution */}
//   <div className="flex items-center gap-2">
//     {/* Image & Star  */}

//   </div>
// </div>
