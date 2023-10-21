import React, { useState, useCallback } from "react";
import Image from "next/image";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { Reply } from "@/types/dbTypes";
import Line from "@/components/interface/entry/sub/icons/Line";
import { StatLineIcon } from "@/components/icons";
import DashedLine from "@/components/interface/entry/sub/icons/DashedLine";

import RenderChildren from "@/components/interface/entry/sub/reply/RenderChildren";

interface ReplyProps {
  reply: Reply;
  level: number;
  isChild: boolean;
  index?: number;
}

export default function ReplyItem({
  reply,
  level,
  isChild,
  index,
}: ReplyProps) {
  const { setReplyParent } = useThreadcrumb();
  const [showChildReplies, setShowChildReplies] = useState<boolean>(false);

  const replyCount = reply._count ? reply._count.replies : 0;
  const replyChild = reply.replies?.[0];

  const handleReplyParent = useCallback(() => {
    setReplyParent(reply);
  }, [reply, setReplyParent]);

  const handleLoadReplies = useCallback(() => {
    setShowChildReplies(true);
  }, []);

  // Styles
  const isEvenLevel = level % 2 === 0;
  const flexDirection = isEvenLevel ? "flex-row" : "flex-row-reverse";
  const reverseAlignment = isEvenLevel ? "items-start" : "items-end";
  const borderRadius = isEvenLevel ? "rounded-bl-[4px]" : "rounded-br-[4px]";
  const reverseStatLine = isEvenLevel ? "" : "transform scale-x-[-1]";
  const maxWidth = isChild ? "max-w-[336px]" : "max-w-[376px]";
  const width = isChild ? "w-[336px]" : "w-[376px]";

  return (
    <div className={`flex flex-col relative w-full pt-4`}>
      {/* Main Reply */}
      <div className={`flex gap-2 items-end ${flexDirection}`}>
        <Image
          className="w-8 h-8 rounded-full outline outline-1 outline-[#E5E5E6]"
          src={reply.author.image}
          alt={`${reply.author.username}'s avatar`}
          width={32}
          height={32}
          onClick={handleReplyParent}
        />

        {/* Attribution & Content */}
        <div className={`flex flex-col gap-[6px] ${reverseAlignment} ${width}`}>
          <div className={`font-medium text-xs text-gray2 leading-[75%] px-3`}>
            {reply.author.username}
          </div>
          {/* Content  */}
          <div
            onClick={handleLoadReplies}
            className={`w-fit ${maxWidth} ${borderRadius} text-gray4 text-sm rounded-[20px] break-all bg-[#F4F4F4] px-3 py-[7px] leading-normal`}
          >
            {reply.content}
          </div>
        </div>

        {/* Fill Parent Dashed Line */}
        {isChild && (
          <div className="flex flex-col justify-center h-full mr-auto w-8">
            <Line
              color={"#e5e5e6"}
              className={`flex flex-grow ml-auto mr-auto !w-[1.5px] ${
                index === 0 && "-mt-3"
              }`}
            />
          </div>
        )}
      </div>

      {/* Stats */}
      {replyCount > 0 && (
        <div
          onClick={handleLoadReplies}
          className={`min-h-[16px] flex flex-col relative w-full ${reverseAlignment}`}
        >
          {/* Create baseline if children fetched */}
          <>
            {showChildReplies ? (
              <div className="absolute flex flex-col cursor-pointer h-full w-8 pt-1">
                <DashedLine
                  className={"flex flex-grow ml-auto mr-auto mb-8"}
                  color={"#e5e5e6"}
                />
              </div>
            ) : (
              // Show curved stat-line if replies exist
              <>
                <div
                  className={`cursor-pointer flex items-end w-full gap-1 ${flexDirection}`}
                >
                  <StatLineIcon
                    color={"#CCC"}
                    className={`${reverseStatLine}`}
                  />
                  <Image
                    className="outline outline-2 rounded-full"
                    src={
                      replyChild?.author.image ||
                      "/public/images/default-avatar.png"
                    }
                    alt={`${reply.author.username}'s avatar`}
                    width={16}
                    height={16}
                  />
                  <div className="text-xs text-gray2 leading-[16px]">
                    {replyCount}
                  </div>
                </div>
              </>
            )}
          </>

          {showChildReplies && (
            <RenderChildren parentReplyId={reply.id} level={level + 1} />
          )}
        </div>
      )}
    </div>
  );
}
