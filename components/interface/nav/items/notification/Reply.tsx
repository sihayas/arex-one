import Image from "next/image";
import React from "react";

import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useArtifact } from "@/hooks/usePage";

const Reply = ({ notificationsGroup }: any) => {
  const { user } = useInterfaceContext();
  const { handleSelectArtifact } = useArtifact();

  const notifications = notificationsGroup.notifications;
  const reply = notifications[0].activity.reply;

  const url = reply.artifact?.sound.appleData.attributes.artwork.url;
  const artwork = url ? url.replace("{w}", "280").replace("{h}", "280") : null;

  const name =
    notificationsGroup.notifications[0].activity.reply.author.username;

  return reply.replyTo && user ? (
    <div
      onClick={(event) => {
        event.stopPropagation();
        handleSelectArtifact(reply?.artifact, reply.id);
      }}
      className={`flex flex-col gap-4`}
    >
      {/* Parent */}
      <div className={`flex min-w-full items-end justify-end`}>
        this is a reply to someone, not sure how to handle this yet
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
          className={`relative mb-3 ml-3 w-fit  rounded-[18px] bg-white px-[10px] pb-[7px] pt-[6px]`}
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
              className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white`}
            />
            <div
              className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-white`}
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
          className={`relative mb-3 ml-3 w-fit rounded-[18px] bg-white px-[10px] pb-[7px] pt-[6px]`}
        >
          <div
            className={`line-clamp-6 w-full cursor-pointer break-words text-base text-black`}
          >
            {reply.text}
          </div>

          {/* Bubbles */}
          <div className={`absolute -bottom-1 -left-1 h-3 w-3`}>
            <div
              className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white`}
            />
            <div
              className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-white`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
