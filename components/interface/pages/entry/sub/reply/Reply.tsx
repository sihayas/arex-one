import React, { useState } from "react";
import { useSession } from "next-auth/react";

import { useThreadcrumb } from "@/context/Threadcrumbs";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";

import { ReplyData } from "@/lib/global/interfaces";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Line from "@/components/interface/pages/entry/sub/icons/Line";

interface ReplyProps {
  reply: ReplyData;
  setSelectedReply: (reply: ReplyData | null) => void;
}

export default function Reply({ reply, setSelectedReply }: ReplyProps) {
  const [hideContent, setHideContent] = useState(false);
  const replyCount = reply.replies?.length;
  const isChild = reply.replyTo ? true : false;

  const { data: session } = useSession();
  const { addToThreadcrumbs, removeUpToId, setReplyParent, threadcrumbs } =
    useThreadcrumb();

  // Handle loading of replies
  const handleLoadReplies = () => {
    if (threadcrumbs && !threadcrumbs.includes(reply.id)) {
      // setHideContent(true);
      // setSelectedReply(reply);
      // addToThreadcrumbs(reply.id);
      setReplyParent(reply);
    } else {
      handleGoBack();
    }
  };

  // Handle "Go Back" button click
  const handleGoBack = () => {
    removeUpToId(reply.id);
    setHideContent(false);
    setSelectedReply(null);
    setReplyParent(reply);
  };

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
    reply.likedByUser,
    reply.likes,
    "/api/reply/post/like",
    "replyId",
    reply.id,
    session
  );

  return (
    <div>
      {isChild && reply.replyTo && (
        <div className="flex w-8 flex-col items-center">
          {reply.rootReply && (
            <UserAvatar
              className="-mb-2"
              imageSrc={
                reply.rootReply.author.image ||
                "./public/images/default_image.png"
              }
              altText={`${reply.author?.name}'s avatar`}
              width={16}
              height={16}
              userId={reply.replyTo.author.id}
            />
          )}
          <UserAvatar
            imageSrc={
              reply.replyTo.author.image || "./public/images/default_image.png"
            }
            altText={`${reply.author?.name}'s avatar`}
            width={16}
            height={16}
            userId={reply.replyTo.author.id}
          />
          <Line height="33px" />
        </div>
      )}
      <div className="flex gap-2">
        <div className="flex flex-col items-center">
          <UserAvatar
            className="w-[32px] h-[32px]"
            imageSrc={
              reply.author?.image || "./public/images/default_image.png"
            }
            altText={`${reply.author?.name}'s avatar`}
            width={32}
            height={32}
            userId={reply.author.id}
          />
          <Line height="33px" className="flex-grow" />
          <div className="h-2 w-2 rounded-full bg-gray3"></div>
        </div>

        <div className="flex flex-col">
          <div className={`font-medium text-sm text-black`}>
            {reply.author.name}
          </div>
          {/* Content & Like Button  */}
          <div
            onClick={handleLoadReplies}
            className={`w-[470px] text-black text-sm rounded-2xl rounded-bl-[4px] break-words `}
          >
            {reply.content}
          </div>
        </div>
      </div>
    </div>
  );
}

// {
//   /* Reply root ? */
// }
// {
//   reply.rootReply ? (
//     <>
//       {/* Chain Line Top  */}
//       <Line className="-mt-1 -mb-1 flex h-6 flex-grow flex-col ml-[11px]" />

//       {/* Root Reply  */}
//       <div className="flex items-end gap-2 pb-1 h-[25px]">
//         {/* Avatar & Chain  */}
//         <div className="relative translate-x-1 min-w-[24px]">
//           {/* Chain Cap  */}
//           {reply.rootReply ? (
//             <ChainEndIcon
//               className={"absolute right-0 rotate-180 -bottom-[5px]"}
//               width={32}
//               height={32}
//               color={"#CCC"}
//             />
//           ) : null}
//           <UserAvatar
//             imageSrc={
//               reply.rootReply.author.image ||
//               "./public/images/default_image.png"
//             }
//             altText={`${reply.author?.name}'s avatar`}
//             width={16}
//             height={16}
//           />
//           {/* Divider  */}
//           <svg
//             className="absolute top-[20px] left-[6px]"
//             width="4"
//             height="4"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <circle cx="2" cy="2" r="2" fill="#E5E5E5" />
//           </svg>
//         </div>
//         <div className="text-[10px] text-gray2">
//           {reply.rootReply.content}
//         </div>
//       </div>
//     </>
//   ) : null;
// }

// {
//   /* Reply Parent ??  */
// }
// {
//   isChild && reply.replyTo ? (
//     <>
//       {/* Chain Line Top  */}
//       {!reply.rootReply ? (
//         <Line className="-mt-1 -mb-1 flex h-6 flex-grow flex-col ml-[11px]" />
//       ) : null}

//       {/* Parent Reply  */}
//       <div
//         className={`w-full flex gap-2 items-end ${
//           !reply.rootReply ? "h-[21px]" : ""
//         }`}
//       >
//         <div className="relative translate-x-1 min-w-[24px]">
//           <Line className="flex-grow -translate-y-1" />
//           <UserAvatar
//             imageSrc={
//               reply.replyTo.author.image ||
//               "./public/images/default_image.png"
//             }
//             altText={`${reply.author?.name}'s avatar`}
//             width={16}
//             height={16}
//           />
//           {!reply.rootReply ? (
//             <ChainEndIcon
//               className="absolute right-0 rotate-180 -bottom-[5px]"
//               width={32}
//               height={32}
//               color={"#CCC"}
//             />
//           ) : null}
//         </div>
//         <div className="text-[10px] text-gray2">
//           {reply.replyTo.content}
//         </div>
//       </div>
//     </>
//   ) : null;
// }

// {
//   /* Like Count  */
// }
// <div className="absolute -bottom-2 flex flex-col items-center right-[18px]">
//   <LikeButton handleLikeClick={handleLikeClick} liked={liked} />

//   {/* Name  */}
//   <div className="flex gap-2">
//     <div className="flex flex-col w-[24px] translate-x-[11px]">
//       <Line className={`flex-grow ${!isChild ? "" : "mt-1"}`} />
//     </div>

//   </div>
// </div>;
