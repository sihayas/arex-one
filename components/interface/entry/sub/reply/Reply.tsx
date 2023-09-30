import React from "react";
import Image from "next/image";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyData } from "@/lib/global/interfaces";
import Line from "@/components/interface/entry/sub/icons/Line";
import { StatLineIcon } from "@/components/icons";

import RenderChildren from "@/components/interface/entry/sub/reply/RenderChildren";

interface ReplyProps {
  reply: ReplyData;
  level: number;
  isChild: boolean;
  index?: number;
}

export default function Reply({ reply, level, isChild, index }: ReplyProps) {
  const { setReplyParent } = useThreadcrumb();
  const [showChildReplies, setShowChildReplies] =
    React.useState<boolean>(false);

  const replyCount = reply._count ? reply._count.replies : 0;
  const replyChild = reply.replies?.[0];

  const handleReplyParent = (reply: ReplyData) => {
    setReplyParent(reply);
  };

  const handleLoadReplies = () => {
    // setShowChildReplies((prev) => !prev);
    setShowChildReplies(true);
  };

  // Styles
  const flexDirection = level % 2 === 0 ? "flex-row" : "flex-row-reverse";
  const reverseAlignment = level % 2 === 0 ? "items-start" : "items-end";
  const borderRadius =
    level % 2 === 0 ? "rounded-bl-[4px]" : "rounded-br-[4px]";
  const reverseStatLine = level % 2 === 0 ? "" : "transform scale-x-[-1]";
  const maxWidth = isChild ? "max-w-[344px]" : "max-w-[380px]";

  return (
    <div
      className={`flex flex-col relative w-full ${
        index === 0 && isChild ? "pt-10" : "pt-4"
      } `}
    >
      {/* Main Reply */}
      <div className={`flex gap-1 items-end ${flexDirection}`}>
        <Image
          className="w-[32px] h-[32px] outline outline-1 outline-gray3 rounded-full"
          src={reply.author.image}
          alt={`${reply.author.name}'s avatar`}
          width={32}
          height={32}
          onClick={() => handleReplyParent(reply)}
        />

        {/* Attribution & Content */}
        <div className={`flex flex-col gap-1 ${reverseAlignment}`}>
          <div className={`font-medium text-sm text-gray2 leading-[75%] px-2`}>
            {reply.author.name}
          </div>
          {/* Content  */}
          <div
            onClick={handleLoadReplies}
            className={`w-fit ${maxWidth} ${borderRadius}  text-gray4 text-sm rounded-2xl break-all bg-[#F4F4F4] px-3 py-[7px] leading-normal`}
          >
            {reply.content}
          </div>
        </div>
      </div>

      {/* Stats */}
      {replyCount > 0 && (
        <div
          onClick={handleLoadReplies}
          className={`min-h-[16px] flex flex-col relative w-full ${reverseAlignment}`}
        >
          <>
            {/* Create baseline if children fetched */}
            {showChildReplies ? (
              <div className="absolute flex flex-col cursor-pointer h-full w-8 pt-2">
                <Line
                  className={"flex flex-grow ml-auto mr-auto"}
                  color={"rgba(0,0,0,0.1)"}
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
                    alt={`${reply.author.name}'s avatar`}
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
