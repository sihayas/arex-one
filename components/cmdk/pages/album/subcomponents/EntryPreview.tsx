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

export default function EntryPreview(props) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(props.likedByUser);
  const [likeCount, setLikeCount] = useState(props.likes.length);
  const replyCount = props.replies.length;

  const handleLikeClick = async () => {
    if (!session) return;

    const userId = session.user.id;

    try {
      const action = liked ? "unlike" : "like";
      const response = await axios.post("/api/review/likeReview", {
        reviewId: props.id,
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
            imageSrc={props.author?.image}
            altText={`${props.author?.name}'s avatar`}
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
        <UserName username={props.author.name} />

        {/* Rating */}
        <div className="-ml-[2px] flex items-center gap-1">
          <Stars rating={props.rating} />

          <DividerIcon width={5} height={5} />

          <LoveIcon width={16} height={16} color={"#585858"} />
        </div>
        {/* Text Body / Also controls thread line (2.5rem to match up to Plus) */}
        <div className="flex flex-col gap-2 mt-1 w-[482px]">
          <TextBody content={props.content} />
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
