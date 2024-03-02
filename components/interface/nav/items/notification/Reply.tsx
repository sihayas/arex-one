import Image from "next/image";
import React from "react";

import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useArtifact } from "@/hooks/usePage";
import { ChainlinkIcon, ChainIcon } from "@/components/icons";

const Reply = ({ notificationsGroup }: any) => {
  const { user } = useInterfaceContext();
  const { handleSelectArtifact } = useArtifact();

  const notifications = notificationsGroup.notifications;
  const reply = notifications[0].activity.reply;
  const sound = reply.artifact?.sound.appleData;

  const url = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    96 * 2.5,
    96 * 2.5,
  );

  return reply.replyTo && user ? (
    <div
      onClick={(event) => {
        event.stopPropagation();
        handleSelectArtifact(reply?.artifact, reply.id);
      }}
      className={`flex flex-col`}
    >
      <div className={`flex items-center`}>
        <div
          className={`w-8 h-8 bg-gray3 flex-shrink-0 flex items-center justify-center rounded-full mr-4`}
        >
          <ChainlinkIcon />
        </div>
        {/* Art & Avatar */}
        <div className={`w-12 h-16 relative flex-shrink-0`}>
          <Image
            className="rounded-xl shadow-shadowKitLow"
            src={url}
            alt={`Artwork`}
            loading="lazy"
            quality={100}
            style={{ objectFit: "cover" }}
            fill={true}
          />
          <Avatar
            className={`absolute -bottom-2 -right-2 outline-2 outline-white outline shadow-shadowKitLow`}
            imageSrc={reply.author.image}
            altText={`${reply.author.username}'s avatar`}
            user={reply.author}
            width={32}
            height={32}
          />
        </div>
        {/* Reply & Attribution */}
        <div className={`flex w-full items-end z-10 relative`}>
          <p className={`absolute -top-[23px] left-4 z-10`}>
            <p className={`text-gray2 text-base font-semibold`}>
              {reply.author.username}{" "}
              <span className={`font-normal`}>chainlinked...</span>
            </p>
          </p>
          <div
            className={`relative mb-1 ml-1 w-fit rounded-[18px] bg-white px-[10px] pb-[7px] pt-[6px] shadow-shadowKitLow`}
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
    </div>
  ) : (
    <div
      onClick={(event) => {
        event.stopPropagation();
        handleSelectArtifact(reply?.artifact, reply.id);
      }}
      className={`flex flex-col`}
    >
      <div className={`flex items-center`}>
        <div
          className={`w-8 h-8 bg-gray3 flex-shrink-0 flex items-center justify-center rounded-full mr-4`}
        >
          <ChainIcon />
        </div>
        {/* Art & Avatar */}
        <div className={`w-12 h-16 relative flex-shrink-0`}>
          <Image
            className="rounded-xl shadow-shadowKitLow"
            src={url}
            alt={`Artwork`}
            loading="lazy"
            quality={100}
            style={{ objectFit: "cover" }}
            fill={true}
          />
          <Avatar
            className={`absolute -bottom-2 -right-2 outline-2 outline-white outline shadow-shadowKitLow`}
            imageSrc={reply.author.image}
            altText={`${reply.author.username}'s avatar`}
            user={reply.author}
            width={32}
            height={32}
          />
        </div>
        {/* Reply & Attribution */}
        <div className={`flex w-full items-end z-10 relative`}>
          <p className={`absolute -top-[23px] left-4 z-10`}>
            <p className={`text-gray2 text-base font-semibold`}>
              {reply.author.username}{" "}
              <span className={`font-normal`}>created a chain...</span>
            </p>
          </p>
          <div
            className={`relative mb-1 ml-1 w-fit rounded-[18px] bg-white px-[10px] pb-[7px] pt-[6px] shadow-shadowKitLow`}
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
    </div>
  );
};

export default Reply;
