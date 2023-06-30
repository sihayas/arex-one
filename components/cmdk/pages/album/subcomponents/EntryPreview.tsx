import React, { useState } from "react";
import { LoveIcon, DividerIcon } from "../../../../icons";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  TextBody,
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
    <div className="flex gap-2 p-4 border border-silver rounded-[7px] hover:shadow-defaultLow ease-entryPreview duration-300">
      {/* Left Side  */}
      <div className="flex flex-col items-center relative">
        {/* AVI */}
        <div className="flex items-center w-[3rem]">
          <UserAvatar
            imageSrc={review.author?.image}
            altText={`${review.author?.name}'s avatar`}
            width={64}
            height={64}
          />
        </div>

        {/* Thread Count */}
        {replyCount > 0 && (
          <>
            {/* Thread Line */}
            <div className="flex flex-col flex-grow items-center mt-4">
              <Line />
            </div>
            <div className="text-xs text-grey text-center pt-1 min-w-[40px]">
              {replyCount} {replyCount === 1 ? "thread" : "threads"}
            </div>
          </>
        )}
      </div>
      {/* Right Side */}
      <div
        className={`flex flex-col mt-1 gap-1 ${
          replyCount > 0 ? "pb-[36px]" : ""
        }`}
      >
        <UserName username={review.author.name} />

        {/* Rating */}
        <div className="-ml-[2px] flex items-center gap-1">
          <Stars rating={review.rating} />

          <DividerIcon width={5} height={5} />

          <LoveIcon width={16} height={16} color={"#585858"} />
        </div>
        {/* Text Body / Also controls thread line (2.5rem to match up to Plus) */}
        <div className="flex flex-col gap-2 mt-1 w-[482px]">
          <TextBody content={review.content} />
          {/* Likes */}
          <div className="flex items-center">
            <LikeButton
              handleLikeClick={handleLikeClick}
              liked={liked}
              likeCount={likeCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
