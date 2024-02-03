import Image from "next/image";
import React from "react";

import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Reply = ({ notificationsGroup }: any) => {
  const notifications = notificationsGroup.notifications;
  const { user } = useInterfaceContext();
  const reply = notifications[0].activity.reply;

  const url = reply.artifact?.appleData.attributes.artwork.url;
  const artwork = url ? url.replace("{w}", "280").replace("{h}", "280") : null;

  const name =
    notificationsGroup.notifications[0].activity.reply.author.username;

  return reply.replyTo && user ? (
    <div className={`flex flex-col gap-4`}>
      {/* Parent */}
      <div className={`flex min-w-full items-end justify-end`}>
        <div
          className={`relative mb-3 mr-3 w-fit rounded-[18px] bg-[#E5E5E5] px-[10px] pb-[7px] pt-[6px]`}
        >
          <div
            className={`text-gray5 line-clamp-2 w-full cursor-pointer break-words text-sm`}
          >
            {reply.replyTo.text}
          </div>

          <div className="text-gray2 absolute -bottom-5 right-4 text-sm">
            {reply.replyTo.author.username}
          </div>

          {/* Bubbles */}
          <div className={`absolute -bottom-1 -right-1 h-3 w-3`}>
            <div
              className={`absolute left-0 top-0 h-2 w-2 rounded-full bg-[#E5E5E5]`}
            />
            <div
              className={`absolute bottom-0 right-0 h-1 w-1 rounded-full bg-[#E5E5E5]`}
            />
          </div>
        </div>

        <Avatar
          className={`border-silver h-6 border`}
          imageSrc={reply.replyTo.author.image}
          altText={`${user.username}'s avatar`}
          user={user}
          width={24}
          height={24}
        />
      </div>
      {/* Reply */}
      <div className={`flex w-full items-end`}>
        <Avatar
          className={`border-silver h-8 border`}
          imageSrc={reply.author.image}
          altText={`${reply.author.username}'s avatar`}
          user={reply.author}
          width={32}
          height={32}
        />
        <div
          className={`relative mb-3 ml-3 w-fit  rounded-[18px] bg-[#E5E5E5] px-[10px] pb-[7px] pt-[6px]`}
        >
          <div
            className={`line-clamp-6 w-full cursor-pointer break-words text-base text-black`}
          >
            {reply.text}
          </div>

          <div className="text-gray2 absolute -bottom-6 left-4 text-base">
            {reply.author.username}
          </div>

          {/* Bubbles */}
          <div className={`absolute -bottom-1 -left-1 h-3 w-3`}>
            <div
              className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-[#E5E5E5]`}
            />
            <div
              className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-[#E5E5E5]`}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={`flex flex-col`}>
      <div className="flex items-end justify-between gap-4">
        <div className={`pl-14 text-base font-medium text-black`}>
          {name}{" "}
          <span style={{ color: "#999", letterSpacing: "-.05em" }}>
            chained...
          </span>
        </div>

        <div
          className={`shadow-shadowKitLow outline-silver relative -mb-2 mr-6 h-[64px] min-w-[48px] rotate-3 overflow-hidden rounded-xl outline outline-1`}
        >
          <Image
            className="rounded-xl"
            src={artwork}
            alt={`Artwork`}
            loading="lazy"
            quality={100}
            style={{ objectFit: "cover" }}
            fill={true}
          />
        </div>
      </div>

      {/* Reply */}
      <div className={`flex w-full items-end`}>
        <Avatar
          className={`border-silver h-8 border`}
          imageSrc={reply.author.image}
          altText={`${reply.author.username}'s avatar`}
          user={reply.author}
          width={32}
          height={32}
        />
        <div
          className={`relative mb-3 ml-3 w-fit rounded-[18px] bg-[#E5E5E5] px-[10px] pb-[7px] pt-[6px]`}
        >
          <div
            className={`line-clamp-6 w-full cursor-pointer break-words text-base text-black`}
          >
            {reply.text}
          </div>

          {/* Bubbles */}
          <div className={`absolute -bottom-1 -left-1 h-3 w-3`}>
            <div
              className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-[#E5E5E5]`}
            />
            <div
              className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-[#E5E5E5]`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
