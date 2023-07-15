import React, { useState } from "react";
import { StarIcon, ReplyIcon } from "../../../../icons";
import { useSession } from "next-auth/react";
import axios from "axios";
import { UserAvatar, LikeButton } from "../../../generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { useThreadcrumb } from "../../../../../context/Threadcrumbs";
import handle from "@/pages/api/album/getReviews";

interface EntryPreviewProps {
  review: ReviewData;
}

export const EntryPreview: React.FC<EntryPreviewProps> = ({ review }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(review.likedByUser);
  const [likeCount, setLikeCount] = useState(review.likes.length);
  const replyCount = review.replies.length;

  const { setPages, bounce } = useCMDK();
  const { setThreadcrumbs } = useThreadcrumb();

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
        console.log("Success:", response.data);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleContentClick = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        name: "entry",
        threadcrumbs: [review.id],
      },
    ]);
    setThreadcrumbs([review.id]);
    bounce();
  };

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
    <div className="flex flex-col gap-2 w-[484px] overflow-visible">
      {/* Review Content  */}
      <div className="flex relative">
        <div
          onClick={handleContentClick}
          className={`w-full text-[13px] leading-normal px-4 py-2 bg-white text-black shadow-entry border border-silver rounded-2xl rounded-bl-[4px] break-words overflow-visible cursor-pointer transition-all duration-300 hover:scale-[102%]`}
        >
          {review.content}
        </div>

        {/* Reply Count & Like Count */}
        <div className="absolute flex  gap-2 -right-3 -bottom-6">
          {/* Reply Count  */}
          <div className="flex mt-1.5 items-center gap-1 px-1 py-[2px] rounded-full max-h-4 bg-white border border-silver">
            <ReplyIcon width={8} height={8} color={"#999"} />
            <div className="text-[10px] text-gray2">{replyCount}</div>
          </div>

          {/* Like Count  */}
          <div className="flex flex-col items-center">
            <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
            <div className=" text-[10px] text-gray2">{likeCount}</div>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="flex items-center">
        {/* Image & Star  */}
        <div className="flex relative">
          <UserAvatar
            imageSrc={review.author?.image}
            altText={`${review.author?.name}'s avatar`}
            width={24}
            height={24}
          />

          {/* Star Rating  */}
          <div className="flex items-center bg-white shadow-low rounded-full max-h-[14px] pl-[2px] pr-[3px] gap-[2px] -translate-x-2 translate-y-4">
            <StarIcon width={10} height={10} color={"#000"} />
            <div className="text-[10px] text-[#000] font-semibold">
              {review.rating}
            </div>
          </div>
        </div>
        {/* Name  */}
        <div
          onClick={handleUserClick}
          className={`font-medium text-[13px] leading-normal text-black cursor-pointer transition-all duration-300 hover:text-[#000]`}
        >
          {review.author?.name}
        </div>
      </div>
    </div>
  );
};
