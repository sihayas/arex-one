import React, { useState } from "react";
import { LoveIcon, DividerIcon } from "../../../../icons";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Line,
  UserName,
  UserAvatar,
  LikeButton,
  Stars,
} from "../../../generics";
import { ReviewData } from "@/lib/interfaces";

export default function EntryPreview(review: ReviewData) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(review.likedByUser);
  const [likeCount, setLikeCount] = useState(review.likes.length);
  const replyCount = review.replies.length;

  const handleLikeClick = async () => {
    if (!session) return;

    const userId = session.user.id;

    try {
      const action = liked ? "unlike" : "like";
      const response = await axios.post("/api/review/postLike", {
        reviewId: review.id,
        userId,
        action,
      });

      if (response.data.success) {
        setLikeCount(response.data.likes);
        setLiked(!liked);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div className="flex gap-4 p-4 border border-silver rounded-[16px] hover:shadow-defaultLow ease-entryPreview duration-300">
      {/* Left Side  */}
      <div className="flex flex-col gap-2 items-center pr-4 border-r">
        {/* Attribution */}
        <div className="flex items-center gap-2 border border-silver rounded-full pl-1 pr-2 py-1">
          <div className="flex items-center gap-[6px] w-max">
            <UserAvatar
              imageSrc={review.author?.image}
              altText={`${review.author?.name}'s avatar`}
              width={24}
              height={24}
            />
            <UserName color="black" username={review.author.name} />
          </div>
        </div>
        {/* Rating */}
        <div className="-ml-[2px] flex items-center gap-1">
          <Stars color={"#333"} rating={review.rating} />

          <DividerIcon color={"#585858"} width={5} height={5} />

          <LoveIcon width={16} height={16} color={"#333"} />
        </div>
      </div>
      {/* Right Side */}
      {/* Text Body / Also controls thread line (2.5rem to match up to Plus) */}
      <div className="flex flex-col gap-2 w-full justify-between">
        <div className={`text-sm text-black break-words`}>{review.content}</div>
        {/* Thread Count */}
        {replyCount > 0 && (
          <div className="text-xs text-grey">
            {replyCount} {replyCount === 1 ? "thread" : "threads"}
          </div>
        )}
        {/* Likes */}
        {/* <div className="flex items-center">
            <LikeButton
              handleLikeClick={handleLikeClick}
              liked={liked}
              likeCount={likeCount}
            />
          </div> */}
      </div>
    </div>
  );
}
