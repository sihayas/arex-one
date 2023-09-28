import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { useThreadcrumb } from "@/context/Threadcrumbs";

import { ReplyData } from "@/lib/global/interfaces";
import Line from "@/components/interface/entry/sub/icons/Line";
import { useQuery } from "@tanstack/react-query";
import { fetchReplies } from "@/lib/api/entryAPI";

import ColorThief from "colorthief";
import {
  blendWithBackground,
  increaseSaturation,
} from "@/hooks/global/useDominantColor";

interface ReplyChildProps {
  reply: ReplyData;
  level: number;
  parentColor: string;
}

export default function ReplyChild({
  reply,
  level,
  parentColor,
}: ReplyChildProps) {
  const { data: session } = useSession();
  const { setReplyParent } = useThreadcrumb();
  const userId = session?.user.id;

  const colorThief = new ColorThief();
  const [blendedColor, setBlendedColor] = React.useState<string>("#000000");
  const [saturatedColor, setSaturatedColor] = React.useState<string>("");

  const replyCount = reply._count ? reply._count.replies : 0;
  // const replyChild = reply.replies?.[0];

  const handlePaletteGenerated = (img: HTMLImageElement) => {
    const color: [number, number, number] = colorThief.getColor(img);
    const saturatedColorArray = increaseSaturation(color, 0.5); // +50%
    const saturatedColorStr = `rgb(${saturatedColorArray.join(",")})`;
    setSaturatedColor(saturatedColorStr); // Set the saturated color string

    const blendedColorArray = blendWithBackground(saturatedColorArray, 0.25); // Create a lighter color (baseline)
    const blendedColorStr = `rgb(${blendedColorArray.join(",")})`;
    setBlendedColor(blendedColorStr); // Set the blended color string
  };

  const handleReplyParent = (reply: ReplyData) => {
    setReplyParent(reply);
  };

  const { data: childReplies, refetch } = useQuery(
    ["replies", reply.id],
    () => fetchReplies({ replyId: reply.id, userId }),
    { enabled: false },
  );

  const handleLoadReplies = () => {
    refetch().then(() => {
      console.log("Child Replies:", childReplies);
    });
  };

  const flexDirection = level % 2 === 0 ? "flex-row" : "flex-row-reverse";
  const nameAlignment = level % 2 === 0 ? "" : "items-end";
  const loadMoreAlignment = level % 2 === 0 ? "items-start" : "items-end";
  const namePadding = level % 2 === 0 ? "pl-2" : "pr-2";
  const borderRadius =
    level % 2 === 0 ? "rounded-bl-[4px]" : "rounded-br-[4px]";

  return (
    <div className="flex flex-col relative w-full">
      {/* Spacing */}
      <div className="h-4"></div>
      {/* Main Reply */}
      <div className={`flex gap-1 items-end ${flexDirection}`}>
        <Image
          className="w-[32px] h-[32px] outline outline-1 outline-[#F4F4F4] rounded-full"
          src={reply.author.image}
          alt={`${reply.author.name}'s avatar`}
          width={32}
          height={32}
          onClick={() => handleReplyParent(reply)}
          onLoadingComplete={(img) => handlePaletteGenerated(img)}
        />

        {/* Attribution & Content */}
        <div className={`flex flex-col gap-1 min-w-[344px] ${nameAlignment}`}>
          <div
            className={`font-medium text-sm text-gray2 leading-[75%] ${namePadding}`}
          >
            {reply.author.name}
          </div>
          {/* Content  */}
          <div
            onClick={handleLoadReplies}
            className={`w-fit max-w-[344px] text-gray4 text-sm rounded-2xl ${borderRadius} break-all bg-[#F4F4F4] px-2 py-[6px] leading-normal`}
          >
            {reply.content}
          </div>
        </div>

        <div className="flex flex-col h-full w-full">
          {/*  Parent Line Color */}
          <Line
            className={"flex flex-grow ml-auto mr-auto"}
            color={parentColor}
          />
        </div>
      </div>

      {replyCount > 0 && (
        <div
          className={`min-h-[16px] flex flex-col relative w-full ${loadMoreAlignment}`}
        >
          {/* Line Chain Here */}
          <div
            onClick={handleLoadReplies}
            className="h-full w-8 absolute flex flex-col cursor-pointer"
          >
            <Line
              className={"flex flex-grow w-8 ml-auto mr-auto"}
              color={blendedColor}
            />
          </div>

          {/* Load Children Here */}
          <div className="mt-8 flex flex-col gap-4 w-full">
            {childReplies?.map((childReply: ReplyData, index: number) => (
              <ReplyChild
                key={childReply.id}
                reply={childReply}
                level={level + 1}
                parentColor={saturatedColor}
              /> // Recursive call here
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
