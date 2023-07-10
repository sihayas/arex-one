import React, { useState } from "react";
import {
  DividerIcon,
  AsteriskIcon,
  StarIcon,
  ReplyIcon,
} from "../../../../icons";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  UserName,
  UserAvatar,
  LikeButton,
  Stars,
  UserAttribution,
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
    <div className="flex flex-col gap-2 w-[484px] overflow-visible">
      {/* Review Content  */}
      <div className="flex relative">
        <div
          className={`w-full text-sm px-4 py-2 bg-white text-black shadow-medium rounded-2xl rounded-bl-[4px] break-words overflow-visible cursor-pointer transition-all duration-300 hover:scale-[102%]`}
        >
          {review.content}
        </div>

        {/* Reply Count & Like Count */}
        <div className="absolute flex items-center gap-2 -right-3 -bottom-3">
          {/* Reply Count  */}
          <div className="flex items-center gap-1 px-1 py-[2px] rounded-full max-h-4 bg-white shadow-low">
            <ReplyIcon width={8} height={8} color={"#999"} />
            <div className="text-[10px] text-gray2">{replyCount}</div>
          </div>

          {/* Like Count  */}

          <LikeButton
            handleLikeClick={handleLikeClick}
            liked={liked}
            likeCount={likeCount}
          />
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
        <UserName username={review.author?.name} />
      </div>
    </div>
  );
}

{
  /* Likes */
}
{
  /*  */
}

// return (
//   <div className="flex gap-4 p-4 border border-silver rounded-[16px] hover:shadow-defaultLow ease-entryPreview duration-300">
//     {/* Left Side  */}
//     <div className="flex flex-col gap-2 items-center pr-4 border-r">
//       {/* Attribution */}
//       <UserAttribution
//         id={review.author?.id}
//         name={review.author?.name}
//         image={review.author?.image}
//       />

//       {/* Rating */}
//       <div className="-ml-[2px] flex items-center gap-1">
//         <Stars color={"#333"} rating={review.rating} />
//         {review.loved && (
//           <>
//             <DividerIcon color={"#585858"} width={5} height={5} />
//             <AsteriskIcon width={16} height={16} color={"#333"} />
//           </>
//         )}
//       </div>
//     </div>
//     {/* Right Side */}
//     <div className="flex flex-col gap-2 w-full justify-between">
//       <div className={`text-sm text-black break-words`}>
//         {review.content}
//       </div>
//       {/* Thread Count */}
//       {replyCount > 0 && (
//         <div className="text-xs text-grey">
//           {replyCount} {replyCount === 1 ? "thread" : "threads"}
//         </div>
//       )}
//     </div>
//   </div>
// );
