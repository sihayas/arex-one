import Image from "next/image";
import React from "react";

import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useArtifact } from "@/hooks/usePage";
import { ReplyToReplyIcon, ReplyIcon } from "@/components/icons";

const Reply = ({ notificationsGroup }: any) => {
  const { user } = useInterfaceContext();
  const { handleSelectArtifact } = useArtifact();

  const notifications = notificationsGroup.notifications;
  const reply = notifications[0].activity.reply;
  const sound = reply.artifact?.sound.appleData;

  const url = MusicKit.formatArtworkURL(sound.attributes.artwork, 96 * 2.5, 96 * 2.5);

  return reply.replyTo && user ? (
    <div
      onClick={(event) => {
        event.stopPropagation();
        handleSelectArtifact(reply?.artifact, reply.id);
      }}
      className={`flex flex-col rounded-3xl px-4 py-6`}
    >
      <div className={`flex items-center`}>
        <div
          className={`shadow-notification mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black`}
        >
          <ReplyToReplyIcon />
        </div>
        {/* Art & Avatar */}
        <div className={`relative h-16 w-12 flex-shrink-0`}>
          <div className={`h-16 w-12 -rotate-3`}>
            <Image
              className="shadow-notification rounded-xl"
              src={url}
              alt={`Artwork`}
              loading="lazy"
              quality={100}
              style={{ objectFit: "cover" }}
              fill={true}
            />
          </div>

          <Avatar
            className={`shadow-notification absolute -bottom-2 -right-2 outline outline-2 outline-white`}
            imageSrc={reply.author.image}
            altText={`${reply.author.username}'s avatar`}
            user={reply.author}
            width={32}
            height={32}
          />
        </div>
        {/* Reply & Attribution */}
        <div className={`relative z-10 flex w-full items-end`}>
          <p className={`absolute -bottom-[12px] left-4 z-10`}>
            <p className={`text-gray2 text-sm font-semibold`}>{reply.author.username}</p>
          </p>
          <div
            className={`shadow-notification relative mb-1.5 ml-1 w-fit rounded-[18px] bg-white px-[10px] pb-[7px] pt-[6px]`}
          >
            <div
              className={`line-clamp-6 w-full cursor-pointer break-words text-base text-black`}
            >
              {reply.text}
            </div>

            {/* Bubbles */}
            <div className={`absolute -bottom-1 -left-1 h-3 w-3`}>
              <div className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white`} />
              <div
                className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-white`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      onClick={(event) => {
        event.stopPropagation();
        handleSelectArtifact(reply?.artifact, reply.id);
      }}
      className={`flex flex-col rounded-3xl px-4 py-6`}
    >
      <div className={`flex items-center`}>
        <div
          className={`shadow-notification mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black`}
        >
          <ReplyIcon />
        </div>
        {/* Art & Avatar */}
        <div className={`relative h-16 w-12 flex-shrink-0`}>
          <div className={`h-16 w-12 -rotate-3`}>
            <Image
              className="shadow-notification rounded-xl"
              src={url}
              alt={`Artwork`}
              loading="lazy"
              quality={100}
              style={{ objectFit: "cover" }}
              fill={true}
            />
          </div>

          <Avatar
            className={`shadow-notification absolute -bottom-2 -right-2 outline outline-2 outline-white`}
            imageSrc={reply.author.image}
            altText={`${reply.author.username}'s avatar`}
            user={reply.author}
            width={32}
            height={32}
          />
        </div>
        {/* Reply & Attribution */}
        <div className={`relative z-10 flex w-full items-end`}>
          <p className={`absolute -bottom-[12px] left-4 z-10`}>
            <p className={`text-gray2 text-sm font-semibold`}>{reply.author.username}</p>
          </p>
          <div
            className={`shadow-notification relative mb-1.5 ml-1 w-fit rounded-[18px] bg-white px-[10px] pb-[7px] pt-[6px]`}
          >
            <div
              className={`line-clamp-6 w-full cursor-pointer break-words text-base text-black`}
            >
              {reply.text}
            </div>

            {/* Bubbles */}
            <div className={`absolute -bottom-1 -left-1 h-3 w-3`}>
              <div className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-white`} />
              <div
                className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-white`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
