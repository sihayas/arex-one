import Image from "next/image";
import React from "react";

import Avatar from "@/components/global/Avatar";
import {
  ChainlinkIcon,
  HeartIcon,
  StarIcon,
  StarMiniIcon,
} from "@/components/icons";

const Heart = ({ notificationsGroup }: any) => {
  const notifications = notificationsGroup.notifications.slice(0, 4);
  const count = Math.min(notificationsGroup.count, 4);
  const remainingCount =
    notificationsGroup.count > 4 ? notificationsGroup.count - 3 : 0;

  const sound =
    notifications[0].activity.heart.artifact?.sound.appleData ||
    notifications[0].activity.heart.reply?.artifact.sound.appleData;

  const url = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    96 * 2.5,
    96 * 2.5,
  );

  const name = notifications[0].activity.heart.author.username;
  const reply = notifications[0].activity.heart.reply;

  let avatarData1, avatarData2, avatarData3;

  notifications.forEach((notification: any, index: number) => {
    const { image, id } = notification.activity.heart.author;
    const avatarData = { image, id };

    // Assign avatar data based on index
    if (index === 0) avatarData1 = avatarData;
    else if (index === 1) avatarData2 = avatarData;
    else if (index === 2) avatarData3 = avatarData;
  });

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
      }}
      className={`flex flex-col py-6 px-4`}
    >
      <div className={`flex items-center`}>
        <div
          className={`w-8 h-8 bg-black flex-shrink-0 flex items-center justify-center rounded-full mr-4 shadow-notification`}
        >
          <HeartIcon />
        </div>
        {/* Art & Avatar */}
        <div className={`w-12 h-16 relative flex-shrink-0 -rotate-4`}>
          <div className={`-rotate-3 w-12 h-16`}>
            <Image
              className="rounded-xl shadow-notification"
              src={url}
              alt={`Artwork`}
              loading="lazy"
              quality={100}
              style={{ objectFit: "cover" }}
              fill={true}
            />
          </div>

          {avatarData1 && (
            <Image
              className="absolute -top-2 -left-2 outline-2 outline-white outline shadow-notification rounded-full"
              src={avatarData1.image}
              alt={`Author ${avatarData1.id}`}
              width={32}
              height={32}
              loading="lazy"
              quality={100}
            />
          )}

          {avatarData2 && (
            <Image
              className="absolute -left-2 -bottom-2 outline-2 outline-white outline shadow-notification rounded-full"
              src={avatarData2.image}
              alt={`Author ${avatarData2.id}`}
              width={24}
              height={24}
              loading="lazy"
              quality={100}
            />
          )}

          {avatarData3 && (
            <Image
              className="absolute bottom-1 left-0 outline-2 outline-white outline shadow-notification rounded-full"
              src={avatarData3.image}
              alt={`Author ${avatarData3.id}`}
              width={20}
              height={20}
              loading="lazy"
              quality={100}
            />
          )}

          {reply ? (
            <Avatar
              className={`absolute -bottom-2 -right-2 outline-2 outline-white outline shadow-notification`}
              imageSrc={reply.author.image}
              altText={`${reply.author.username}'s avatar`}
              user={reply.author}
              width={24}
              height={24}
            />
          ) : (
            <div
              className={`flex w-max items-center gap-2 absolute -bottom-2 left-6`}
            >
              <div
                className={`w-8 h-8 bg-white rounded-full shadow-notification flex items-center justify-center`}
              >
                <StarMiniIcon />
              </div>
              <p className={`text-gray2 font-semibold text-base`}>
                {sound.attributes.name}
              </p>
            </div>
          )}
        </div>

        {/* Reply? & Attribution */}
        {reply ? (
          <div className={`flex w-full items-end z-10 relative`}>
            <p className={`absolute -top-[23px] left-4 z-10`}>
              <p className={`text-gray2 text-base font-semibold`}>
                {reply.author.username}{" "}
                <span className={`font-normal`}>
                  & {count} {count > 1 ? "other hearts" : "other heart"}
                </span>
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
        ) : (
          <div className={`pl-4 flex w-full items-end z-10 relative`}>
            <p className={`text-gray2 text-base font-semibold`}>
              {name} & {count}{" "}
              <span className={`font-normal`}>
                {count > 1 ? "other hearts..." : "hearts..."}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Heart;
