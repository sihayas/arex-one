import React from "react";
import { useSession } from "next-auth/react";
import { UserAvatar, LikeButton } from "../../../generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { Stars } from "../../../generics";
import useHandleLikeClick from "@/hooks/useLike";
import { useHandleEntryClick } from "@/hooks/useHandleEntryClick";

interface EntryAlbumProps {
  review: ReviewData;
}

export const EntryAlbum: React.FC<EntryAlbumProps> = ({ review }) => {
  const { data: session } = useSession();
  const { setPages } = useCMDK();

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
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

  return (
    <div className="flex flex-col gap-1 w-[484px] overflow-visible">
      {/* Review Content, Like Button  */}
      <div className="flex relative">
        <div
          onClick={handleEntryClick}
          className={`w-full text-[13px] leading-normal px-4 py-2 bg-white text-black border border-silver rounded-2xl rounded-bl-[4px] break-words hoverable-medium`}
        >
          {review.content}
        </div>
        <Stars
          className={
            "absolute -left-3 -top-3 border border-silver rounded-full p-1 bg-white"
          }
          rating={review.rating}
        />

        <div className="absolute flex gap-2 -right-3 -bottom-2">
          <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
        </div>
      </div>

      {/* Username and Avatar */}
      <div
        onClick={handleUserClick}
        className="flex items-center gap-2 hoverable-small"
      >
        {/* Image & Star  */}
        <UserAvatar
          imageSrc={review.author?.image}
          altText={`${review.author?.name}'s avatar`}
          width={24}
          height={24}
        />
        {/* Name  */}
        <div
          className={`font-medium text-[13px] leading-normal text-black  transition-all duration-300 hover:text-[#000]`}
        >
          {review.author?.name}
        </div>
      </div>

      {/* Replies and Likes  */}
      <div className="flex items-center gap-2 mt-2 hoverable-small">
        {review.replies && review._count.replies > 0 && (
          <div className="flex items-center px-2 py-1 border border-silver rounded-lg rounded-bl-[2px]">
            {review.replies.slice(0, 2).map((reply, index) => (
              <UserAvatar
                key={index}
                className={`!border-2 border-white ${
                  index !== 0 ? "-ml-1" : ""
                }`}
                imageSrc={reply.author.image}
                altText={`${reply.author.name}'s avatar`}
                width={16}
                height={16}
              />
            ))}

            {review._count.replies > 2 && (
              <div className="text-xs text-gray2 ml-1">
                {`+ ${review._count.replies - 2}`}
              </div>
            )}
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
