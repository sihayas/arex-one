import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { UserAvatar, LikeButton } from "../../../generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { Stars } from "../../../generics";
import useHandleLikeClick from "@/hooks/useLike";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";
import Image from "next/image";
import { useCMDKAlbum } from "@/context/CMDKAlbum";

interface EntryFullProps {
  review: ReviewData;
  artworkUrl: string;
}

export const EntryFull: React.FC<EntryFullProps> = ({ review, artworkUrl }) => {
  const { data: session } = useSession();
  const { setPages } = useCMDK();
  const { selectedAlbum } = useCMDKAlbum();

  const boxShadow = useMemo(() => {
    if (selectedAlbum?.colors[0]) {
      return `0px 0px 0px 0px ${selectedAlbum.colors[0]}, 0.11),
        9px 11px 32px 0px ${selectedAlbum.colors[0]}, 0.11),
        37px 45px 58px 0px ${selectedAlbum.colors[0]}, 0.09),
        83px 100px 78px 0px ${selectedAlbum.colors[0]}, 0.05),
        148px 178px 93px 0px ${selectedAlbum.colors[0]}, 0.02),
        231px 279px 101px 0px ${selectedAlbum.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedAlbum?.colors]);

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
    review.likedByUser,
    review.likes,
    "/api/review/postLike",
    "reviewId",
    review.id,
    session
  );

  // const handleUserClick = () => {
  //   setPages((prevPages) => [
  //     ...prevPages,
  //     {
  //       name: "user",
  //       user: review.author.id,
  //     },
  //   ]);
  // };
  //

  return (
    <>
      <Image
        className="absolute rounded-[20px]"
        style={{
          boxShadow: boxShadow,
        }}
        src={artworkUrl || "/public/images/default.png"}
        alt={`${selectedAlbum?.attributes.name} artwork`}
        width={516}
        height={516}
        onDragStart={(e) => e.preventDefault()}
        draggable="false"
      />
      <div className="flex flex-col gap-4 w-full overflow-visible absolute top-[516px] p-8 bg-white bg-opacity-0 rounded-[20px] pb-9 z-10">
        {/* Review Content */}
        <div
          className={`w-full text-[13px] text-black break-words hoverable-medium`}
        >
          {review.content}
        </div>

        {/* Attribution and stats */}
        <div className="flex items-center justify-between">
          {/* Username and Avatar */}
          <div
            // onClick={handleUserClick}
            className="flex items-center gap-2 hoverable-small"
          >
            <UserAvatar
              imageSrc={review.author?.image}
              altText={`${review.author?.name}'s avatar`}
              width={24}
              height={24}
            />
            {/* Name  */}
            <div
              className={`font-medium text-[13px] leading-normal text-black  transition-all duration-300`}
            >
              {review.author?.name}
            </div>
          </div>

          {/* Replies and Likes  */}
          <div className="flex items-center gap-1 hoverable-small">
            <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
            {/* Like Avatar previews */}
            {review.replies && review._count.replies > 0 && (
              <div className="flex items-center">
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

                {review.likes && review._count.likes > 3 && (
                  <div className="text-[10px] ml-1 text-gray2">
                    + {review._count.likes - 3}
                  </div>
                )}
                <div className="text-gray3 ml-2 mr-1">&middot;</div>
              </div>
            )}
            {/* Date  */}
            <div className="text-gray2 text-[10px]">
              {formatDateShort(new Date(review.createdAt))}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray2 border-b-8 border-gray2 absolute -bottom-[4px] left-1/2 rounded-b">
          {review._count.replies}
        </div>
      </div>
    </>
  );
};

function formatDateShort(date: Date): string {
  const now = new Date();
  const yearsDifference = differenceInYears(now, date);
  if (yearsDifference > 0) return `${yearsDifference}y`;

  const monthsDifference = differenceInMonths(now, date);
  if (monthsDifference > 0) return `${monthsDifference}mo`;

  const daysDifference = differenceInDays(now, date);
  if (daysDifference > 0) return `${daysDifference}d`;

  const hoursDifference = differenceInHours(now, date);
  if (hoursDifference > 0) return `${hoursDifference}h`;

  const minutesDifference = differenceInMinutes(now, date);
  if (minutesDifference > 0) return `${minutesDifference}m`;

  return `${differenceInSeconds(now, date)}s`;
}
