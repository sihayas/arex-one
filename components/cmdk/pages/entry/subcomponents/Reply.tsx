// Importing required modules
import React, { useState } from "react";
import { Line, UserName, UserAvatar, LikeButton } from "../../../generics";
import { ReplyIcon, ThreadIcon } from "../../../../icons";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { ReplyData } from "@/lib/interfaces";
import { useSession } from "next-auth/react";
import axios from "axios";

interface ReplyProps {
  reply: ReplyData;
  setSelectedReplyId: (id: string | null) => void;
}
export default function Reply({ reply, setSelectedReplyId }: ReplyProps) {
  const { addToThreadcrumbs, removeUpToId, setReplyParent } = useThreadcrumb();
  const [hideContent, setHideContent] = useState(false);
  const { data: session } = useSession();

  const [liked, setLiked] = useState(reply.likedByUser);
  const [likeCount, setLikeCount] = useState(reply.likes.length);
  const replyCount = reply.replies?.length;

  // Handle loading of replies
  const handleLoadReplies = () => {
    setHideContent(true);
    setSelectedReplyId(reply.id);
    addToThreadcrumbs(reply.id);
    setReplyParent(reply);
  };

  // Handle "Go Back" button click
  const handleGoBack = () => {
    removeUpToId(reply.id);
    setHideContent(false);
    setSelectedReplyId(null);
  };

  const handleLikeClick = async () => {
    if (!session) return;

    const userId = session.user.id;

    try {
      const action = liked ? "unlike" : "like";
      const response = await axios.post("/api/reply/postLike", {
        replyId: reply.id,
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

  return (
    <div
      className={`flex flex-col gap-1 w-[482px] ${
        hideContent ? "cursor-pointer" : ""
      }`}
    >
      {/* Avatar & Content Outer */}
      <div className="flex items-end gap-2">
        {/* Avatar */}
        <div className="min-w-[24px]">
          <UserAvatar
            imageSrc={
              reply.author?.image || "./public/images/default_image.png"
            }
            altText={`${reply.author?.name}'s avatar`}
            width={24}
            height={24}
          />
        </div>

        {/* Content  */}
        <div className="flex relative">
          <div
            onClick={hideContent ? handleGoBack : undefined}
            className={`text-sm px-4 py-2 w-[450px] bg-white text-gray shadow-reply border border-silver rounded-2xl rounded-bl-[4px] break-words cursor-pointer transition-all duration-300 hover:scale-[102%]`}
          >
            {reply.content}
          </div>

          {/* Reply Count & Like Count */}
          <div className="absolute flex gap-2 -right-3 -bottom-6">
            {/* Reply Count  */}
            <div
              onClick={() =>
                reply.replies?.length
                  ? handleLoadReplies()
                  : setReplyParent(reply)
              }
              className="flex mt-1.5 items-center gap-1 px-1 py-[2px] rounded-full max-h-4 bg-white shadow-low cursor-pointer"
            >
              <ReplyIcon width={8} height={8} color={"#999"} />
              <div className="text-[10px] text-gray2">
                {reply.replies?.length}
              </div>
            </div>

            {/* Like Count  */}
            <div className="flex flex-col items-center">
              <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
              <div className=" text-[10px] text-gray2">{likeCount}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Name  */}
      <div className={`pl-8 font-medium text-xs text-black`}>
        {reply.author.name}
      </div>
    </div>
  );
}

//   return (
//     <div
//       className={`flex gap-2 duration-700 max-w-[484px] ${
//         hideContent ? "cursor-pointer" : ""
//       }`}
//     >
//       {/* Left Side  */}
//       <div
//         className="flex flex-col"
//         onClick={hideContent ? handleGoBack : undefined}
//       >
//         {/* User Avatar & Username */}
//         <div className="flex items-center gap-4">
//           <UserAvatar
//             imageSrc={
//               reply.author?.image || "./public/images/default_image.png"
//             }
//             altText={`${reply.author?.name || "Unknown Author"}'s avatar`}
//           />
//           <UserName
//             color="black"
//             username={reply.author.username || "stranger"}
//           />
//         </div>

//         {/* Reply Content & Thread Line  */}
//         <div className="flex gap-4 pb-1">
//           {/* Reply Content  */}
//           <div className={`text-sm text-black break-words`}>
//             {reply.content}
//           </div>
//         </div>

//         {/*Interactions  */}
//         {!hideContent && (
//           <div className="flex  translate-x-[.28em] gap-[1.225em]">
//             <ThreadIcon width={24} height={24} color={"#CCC"} />
//             {/* Threader  */}
//             <button
//               className="flex items-center gap-1 text-grey text-xs text-start hover:text-black duration-300 relative"
//               onClick={handleLoadReplies}
//             >
//               <div className="flex text-xs text-grey w-64">
//                 {reply.replies.length} threads
//               </div>
//             </button>
//             <button
//               className="text-xs text-grey"
//               onClick={() => setReplyParent(reply)}
//             >
//               [set reply parent id]
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
