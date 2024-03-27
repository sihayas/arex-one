import Image from "next/image";
import React from "react";

import { motion } from "framer-motion";
import {
  notificationVariants,
  notificationSpring,
} from "@/components/interface/nav/render/Notifications";

const Notification = ({ notificationsGroup, notificationType }: any) => {
  const count = Math.min(notificationsGroup.count, 4);
  const notifications = notificationsGroup.notifications.slice(0, 4);

  const isHeart = notificationType === "HEART";
  const isReply = notificationType === "REPLY";

  const heart = isHeart ? notifications[0].activity.heart : null;
  const reply = isHeart
    ? notifications[0].activity.heart.reply
    : notifications[0].activity.reply;
  const username = isHeart ? heart.author.username : reply.author.username;

  const sound = heart
    ? heart.artifact?.sound.appleData || heart.reply?.artifact.sound.appleData
    : reply?.artifact.sound.appleData;
  const artworkUrl = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    48 * 2.5,
    48 * 2.5,
  );

  let avatarData1, avatarData2;

  notifications.forEach((notification: any, index: number) => {
    const { image, id } = isHeart ? heart.author : reply.author;
    const avatarData = { image, id };

    if (index === 0) avatarData1 = avatarData;
    else if (index === 1) avatarData2 = avatarData;
  });

  return (
    <motion.div
      variants={notificationVariants}
      transition={notificationSpring}
      onClick={(event) => {
        event.stopPropagation();
      }}
      className={`flex flex-col flex-shrink-0 -space-y-2 origin-bottom-left`}
    >
      {/* Reply Text */}
      {reply && (
        <div
          className={`ml-auto bg-[#F6F6F6] px-4 pb-[18px] pt-[10px] w-[calc(100%-48px)] shadow-shadowKitLow rounded-xl rounded-br-none`}
        >
          <p className={`text-sm text-gray2 line-clamp-4`}>{reply.text}</p>
        </div>
      )}

      <div
        className={`flex flex-shrink-0 items-center bg-white rounded-xl shadow-notification`}
      >
        <Image
          className="flex-shrink-0 rounded-l-xl"
          src={artworkUrl}
          alt={`Artwork`}
          loading="lazy"
          quality={100}
          width={48}
          height={48}
        />

        {count > 1 && (
          <p className={`text-sm font-bold text-black ml-4`}>
            {count > 1 && `${count}`}
          </p>
        )}

        <div className={`flex items-center -space-x-1 flex-shrink-0 ml-4`}>
          {avatarData2 && (
            <Image
              className="outline-2 outline-white outline rounded-full"
              // @ts-ignore
              src={avatarData2.image}
              // @ts-ignore
              alt={`Author ${avatarData2.id}`}
              width={16}
              height={16}
              loading="lazy"
              quality={100}
            />
          )}
          {avatarData1 && (
            <Image
              className="outline-2 outline-white outline rounded-full"
              // @ts-ignore
              src={avatarData1.image}
              // @ts-ignore
              alt={`Author ${avatarData1.id}`}
              width={18}
              height={18}
              quality={100}
            />
          )}
        </div>

        {/* Attribution*/}
        <p className={`text-base text-black ml-2`}>{username}</p>

        <div
          style={{
            backgroundColor: isReply ? "#000000" : "#FF5EC4",
          }}
          className={`ml-auto w-4 h-4 bg-[#FF5EC4] flex-shrink-0 rounded-full mr-4`}
        />
      </div>
    </motion.div>
  );
};

export default Notification;
