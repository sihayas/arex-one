import React from "react";
import { useSession } from "next-auth/react";
import { UserAvatar, LikeButton } from "../cmdk/generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import useHandleLikeClick from "@/hooks/useLike";
import { useHandleEntryClick } from "@/hooks/useHandleEntryClick";
import { Footer } from "./Footer";

interface FeedAlbumProps {
  review: ReviewData;
}

export const FeedAlbum: React.FC<FeedAlbumProps> = ({ review }) => {
  const { data: session } = useSession();
  const { setPages, setIsVisible } = useCMDK();

  // const replyCount = review.replies.length;

  const { liked, handleLikeClick } = useHandleLikeClick(
    review.likedByUser,
    review.likes,
    "/api/review/postLike",
    "reviewId",
    review.id,
    session
  );

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

  console.log(review);

  return (
    //PB-6 to level with the footer
    <div className="flex flex-col">
      <div className="translate-x-4 translate-y-4 z-10">
        <Footer
          albumId={review.albumId}
          rating={review.rating}
          album={review.album}
        />
      </div>
      <div className="flex gap-1 items-end w-full">
        <UserAvatar
          className="max-w-6 max-h-6"
          imageSrc={review.author.image}
          altText={`${review.author.name}'s avatar`}
          width={24}
          height={24}
        />
        <div className="relative w-[484px]">
          <div
            onClick={() => {
              handleEntryClick();
              setIsVisible((prevIsVisible) => !prevIsVisible);
            }}
            className={`w-[full] text-[13px] leading-normal px-4 py-2 bg-white text-black border border-silver rounded-2xl rounded-bl-[4px] break-words overflow-visible hoverable-medium`}
          >
            {review.content}
            <div className="absolute -right-3 -bottom-3">
              <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
            </div>
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
      <div className="flex items-center gap-2 mt-8 ml-7 ">
        {review.replies && review._count.replies > 0 && (
          <div className="flex items-center px-2 py-1 border border-silver rounded-lg rounded-bl-[2px]">
            <UserAvatar
              className={"!border-2 border-white"}
              imageSrc={review.replies[0].author.image}
              altText={`${review.replies[0].author.name}'s avatar`}
              width={16}
              height={16}
            />
            <UserAvatar
              className={"-ml-1 !border-2 border-white"}
              imageSrc={review.replies[1].author.image}
              altText={`${review.replies[1].author.name}'s avatar`}
              width={16}
              height={16}
            />

            <div className="text-xs text-gray2 ml-1">
              {review._count.replies}
            </div>
          </div>
        )}

        {review._count.replies > 0 && review._count.likes > 0 && (
          <svg height="4" width="4">
            <circle cx="2" cy="2" r="2" fill="#CCC" />
          </svg>
        )}
        {review.likes && review._count.likes > 0 && (
          <div className="flex items-center text-xs text-gray2">
            {review._count.likes} {review._count.likes > 1 ? "likes" : "like"}
          </div>
        )}
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

//     </div>
//   </div>

//   {/* Attribution */}
//   <div className="flex items-center gap-2">
//     {/* Image & Star  */}

//   </div>
// </div>
