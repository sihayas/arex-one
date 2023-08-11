import React from "react";
import { useSession } from "next-auth/react";
import { UserAvatar, LikeButton } from "../../../generics";
import { ReviewData } from "@/lib/global/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { Stars } from "../../../generics";
import useHandleLikeClick from "@/hooks/global/useLike";
import { useHandleEntryClick } from "@/hooks/global/useHandleEntryClick";
import { StatLineIcon } from "@/components/icons";
import { useHandleUserClick } from "@/hooks/global/useHandleUserClick";

interface EntryAlbumProps {
  review: ReviewData;
}

export const EntryAlbum: React.FC<EntryAlbumProps> = ({ review }) => {
  const { data: session } = useSession();
  const { setIsVisible } = useCMDK();

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
    review.likedByUser!,
    review.likes,
    "/api/review/postLike",
    "reviewId",
    review.id,
    session
  );

  const handleEntryClick = useHandleEntryClick(review.id);

  const handleUserClick = useHandleUserClick(review.author.id);

  return (
    <div className="flex flex-col gap-1 w-[484px] overflow-visible group">
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
          color={"#333"}
        />

        <div className="absolute flex gap-2 -right-3 -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
        </div>
      </div>

      {/* Username and Avatar */}
      <div
        onClick={() => {
          handleUserClick();
          setIsVisible((prevIsVisible) => !prevIsVisible);
        }}
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
      <div className="flex items-center gap-2 hoverable-small relative">
        {/* Avatar previews */}
        {review.replies && review._count.replies > 0 && (
          <div className="flex items-center ml-[28px] mt-1">
            <StatLineIcon
              color={"#CCC"}
              width={10}
              height={11}
              className={"absolute top-[4px] left-[11px]"}
            />
            {review.replies.slice(0, 3).map((reply, index) => (
              <UserAvatar
                key={index}
                className={`!border-2 border-white shadow-md ${
                  index !== 0 ? "-ml-1" : ""
                }`}
                imageSrc={reply.author.image}
                altText={`${reply.author.name}'s avatar`}
                width={20}
                height={20}
              />
            ))}

            {/* show count + word chain(s) */}
            <div className="text-xs text-gray2 ml-2">
              {`${review._count.replies} chain${
                review._count.replies > 1 ? "s" : ""
              }`}
            </div>
          </div>
        )}
        {/* Reply Count  */}
        {review._count.replies > 0 && review._count.likes > 0 && (
          <div className="text-xs text-gray3 mt-1">+</div>
        )}

        {review.likes && review._count.likes > 0 && (
          <div className="flex items-center text-xs text-gray2 mt-1">
            {review._count.likes} {review._count.likes > 1 ? "hearts" : "heart"}
          </div>
        )}
      </div>
    </div>
  );
};
