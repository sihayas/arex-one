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
import { StatLineIcon } from "@/components/icons";

interface ReplyChildProps {
  index: number;
  reply: ReplyData;
  level: number;
  parentColor: string;
}

export default function ReplyChild({
  reply,
  level,
  parentColor,
  index,
}: ReplyChildProps) {
  const { data: session } = useSession();
  const { setReplyParent } = useThreadcrumb();
  const userId = session?.user.id;

  const colorThief = new ColorThief();
  const [blendedColor, setBlendedColor] = React.useState<string>("#000000");
  const [saturatedColor, setSaturatedColor] = React.useState<string>("");

  const replyCount = reply._count ? reply._count.replies : 0;
  const replyChild = reply.replies?.[0];

  // Generate the color palette
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
      console.log("Child RenderReplies:", childReplies);
    });
  };

  // Reverses the direction of the reply
  const flexDirection = level % 2 === 0 ? "flex-row" : "flex-row-reverse";

  const reverseAlignment = level % 2 === 0 ? "items-start" : "items-end";
  const borderRadius =
    level % 2 === 0 ? "rounded-bl-[4px]" : "rounded-br-[4px]";

  const reverseStatLine = level % 2 === 0 ? "" : "transform scale-x-[-1]";

  return (
    <div
      className={`flex flex-col relative w-full  ${
        index === 0 ? "pt-10" : "pt-4"
      }`}
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
          onLoadingComplete={(img) => handlePaletteGenerated(img)}
        />

        {/* Attribution & Content */}
        <div
          className={`flex flex-col gap-1 min-w-[344px] ${reverseAlignment}`}
        >
          <div className={`font-medium text-sm text-gray2 leading-[75%] px-2`}>
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
            className={`flex flex-grow ml-auto mr-auto ${
              index === 0 ? "-mt-8" : "-mt-4"
            }`}
            color={parentColor}
          />
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
            {childReplies ? (
              <div
                onClick={handleLoadReplies}
                className="absolute flex flex-col cursor-pointer h-full w-8 pt-2"
              >
                <Line
                  className={"flex flex-grow ml-auto mr-auto"}
                  color={blendedColor}
                />
              </div>
            ) : (
              // Show stat-line if replies exist
              <div className={`flex justify-between w-full ${flexDirection}`}>
                <div
                  className={`cursor-pointer flex items-end gap-1 ${flexDirection}`}
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
                <div className="flex flex-col w-8 h-6">
                  <Line
                    className={"flex flex-grow ml-auto mr-auto"}
                    color={parentColor}
                  />
                </div>
              </div>
            )}
          </>

          {/* Load Children Here */}
          <div className="flex flex-col w-full">
            {childReplies?.map((childReply: ReplyData, index: number) => (
              <ReplyChild
                index={index}
                key={childReply.id}
                reply={childReply}
                level={level + 1}
                parentColor={saturatedColor}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
