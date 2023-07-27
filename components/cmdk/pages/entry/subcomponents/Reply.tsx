// Importing required modules
import React, { useState } from "react";
import { UserAvatar, LikeButton } from "../../../generics";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { ReplyData } from "@/lib/interfaces";
import { useSession } from "next-auth/react";
import useHandleLikeClick from "@/hooks/useLike";
import { Line, LineBottom } from "../../../generics";
import { ChainEndIcon } from "@/components/icons";

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
    "/api/reply/postLike",
    "replyId",
    reply.id,
    session
  );

  return (
    <div className={`flex flex-col gap-2 w-[482px]`}>
      {/* Reply root ? */}
      {reply.rootReply ? (
        <>
          {/* Chain Line Top  */}
          <Line className="flex flex-col flex-grow -mt-1 h-6 ml-[11px] -mb-1" />

          {/* Root Reply  */}
          <div className="flex gap-2 items-end h-[25px] pb-1">
            {/* Avatar & Chain  */}
            <div className="min-w-[24px] translate-x-1 relative">
              {/* Chain Cap  */}
              {reply.rootReply ? (
                <ChainEndIcon
                  className={"absolute right-0 rotate-180 -bottom-[5px]"}
                  width={32}
                  height={32}
                  color={"#CCC"}
                />
              ) : null}
              <UserAvatar
                imageSrc={
                  reply.rootReply.author.image ||
                  "./public/images/default_image.png"
                }
                altText={`${reply.author?.name}'s avatar`}
                width={16}
                height={16}
              />
              {/* Divider  */}
              <svg
                className="absolute top-[20px] left-[6px]"
                width="4"
                height="4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="2" cy="2" r="2" fill="#E5E5E5" />
              </svg>
            </div>
            <div className="text-[10px] text-gray2">
              {reply.rootReply.content}
            </div>
          </div>
        </>
      ) : null}

      {/* Reply Parent ??  */}
      {isChild && reply.replyTo ? (
        <>
          {/* Chain Line Top  */}
          {!reply.rootReply ? (
            <Line className="flex flex-grow flex-col h-6 ml-[11px] -mb-1 -mt-1" />
          ) : null}

          {/* Parent Reply  */}
          <div
            className={`w-full flex gap-2 items-end ${
              !reply.rootReply ? "h-[21px]" : ""
            }`}
          >
            <div className="min-w-[24px] translate-x-1 relative">
              <Line className="flex-grow -translate-y-1" />
              <UserAvatar
                imageSrc={
                  reply.replyTo.author.image ||
                  "./public/images/default_image.png"
                }
                altText={`${reply.author?.name}'s avatar`}
                width={16}
                height={16}
              />
              {!reply.rootReply ? (
                <ChainEndIcon
                  className="absolute right-0 rotate-180 -bottom-[5px]"
                  width={32}
                  height={32}
                  color={"#CCC"}
                />
              ) : null}
            </div>
            <div className="text-[10px] text-gray2">
              {reply.replyTo.content}
            </div>
          </div>
        </>
      ) : null}

      {/* Main Reply */}
      <div className="flex flex-col gap-1">
        {/* Avatar/Chain & Content */}
        <div className="flex items-end gap-2 relative">
          <div className=" flex flex-col min-w-[24px] h-full items-center relative">
            <Line className="flex-grow -translate-y-1" />
            <UserAvatar
              imageSrc={
                reply.author?.image || "./public/images/default_image.png"
              }
              altText={`${reply.author?.name}'s avatar`}
              width={24}
              height={24}
            />
            {/* Chain Bottom (Reply)? */}
            {isChild ? (
              <ChainEndIcon
                className={"absolute top-2 -right-[9px] z-0"}
                width={42}
                height={42}
                color={"#CCC"}
              />
            ) : null}
          </div>
          {/* Content & Like Button  */}
          <div
            onClick={handleLoadReplies}
            className={`px-4 py-2 w-[450px] bg-white text-black text-[13px] leading-normal border border-silver rounded-2xl rounded-bl-[4px] break-words  ${
              !isChild ? "mt-6" : ""
            } `}
          >
            {reply.content}
          </div>
          {/* Like Count  */}
          <div className="absolute flex flex-col items-center -right-2.5 -bottom-6">
            <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
            <div className="text-[10px] text-gray2">{likeCount}</div>
          </div>
        </div>
        {/* Name  */}
        <div className="flex gap-2">
          <div className="w-[24px] flex flex-col translate-x-[11px]">
            <Line className={`flex-grow ${!isChild ? "" : "mt-1"}`} />
          </div>
          <div className={`font-medium text-xs text-black`}>
            {reply.author.name}
          </div>
        </div>
      </div>
    </div>
  );
}
