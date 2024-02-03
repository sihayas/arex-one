import Image from "next/image";
import React from "react";

import { motion } from "framer-motion";
import { HeartIcon } from "@/components/icons/Heart";
import Avatar from "@/components/global/Avatar";

const Heart = ({ notificationsGroup }: any) => {
  const notifications = notificationsGroup.notifications.slice(0, 4);
  const count = Math.min(notificationsGroup.count, 4);
  const remainingCount =
    notificationsGroup.count > 4 ? notificationsGroup.count - 3 : 0;

  const sound =
    notifications[0].activity.heart.artifact?.appleData ||
    notifications[0].activity.heart.reply?.artifact.appleData;

  const url = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    96 * 2.5,
    96 * 2.5,
  );

  const name = notifications[0].activity.heart.author.username;
  const reply = notifications[0].activity.heart.reply;

  return (
    <div className={`relative flex w-full items-center gap-2`}>
      <HeartIcon className={`absolute -top-1 left-5 z-10 -scale-x-[1]`} />

      {/* Art */}
      <motion.div
        className={`shadow-shadowKitLow outline-silver relative h-[64px] min-w-[48px] -rotate-3 overflow-hidden rounded-xl outline outline-1 `}
      >
        <Image
          className="rounded-xl"
          src={url}
          alt={`Artwork`}
          loading="lazy"
          quality={100}
          style={{ objectFit: "cover" }}
          fill={true}
        />
      </motion.div>

      {/* Text */}
      <div className={`flex w-full flex-col`}>
        <div className={`text-base font-medium text-black`}>{name}</div>
        <div className={`text-gray2 text-base font-medium tracking-tighter`}>
          {count > 1 ? `& ${count - 1} more ` : "liked your sound"}
          {count > 1 && <span style={{ color: "#FF4DC9" }}>hearts!</span>}
        </div>
      </div>

      <motion.div
        style={{
          paddingBottom: reply ? 68 : 0,
        }}
        className={`z-10 flex flex-col items-center`}
      >
        {/* Avatar's Container */}
        <div className="rounded-max border-silver relative flex h-[96px] w-[96px] items-center justify-center border bg-[#E5E5E5]">
          {notifications.map((notification: any, index: number) => {
            const { image, id } = notification.activity.heart.author;
            const { positionClasses, width, height } = getPositionClasses(
              index,
              count,
            );
            return (
              <Image
                key={id}
                className={`absolute ${positionClasses} rounded-max border-silver overflow-hidden border`}
                src={image}
                alt={`Author ${id}`}
                width={width}
                height={height}
                loading="lazy"
                quality={100}
              />
            );
          })}
          {remainingCount > 0 && (
            <div className="bg-gray3 absolute left-3 top-6 flex h-[26px] w-[26px] items-center justify-center rounded-full text-xs font-bold leading-[8px] text-white">
              {remainingCount}
            </div>
          )}
        </div>

        {/* If Reply Heart */}
        {reply && (
          <div className={`absolute -bottom-1.5 left-0 flex w-full items-end`}>
            <Avatar
              className={`border-silver h-6 border`}
              imageSrc={reply.author.image}
              altText={`${reply.author.username}'s avatar`}
              user={reply.author}
              width={24}
              height={24}
            />
            <div
              className={`relative mb-3 ml-3 w-fit max-w-[172px] rounded-[18px] bg-[#F4F4F4] px-[10px] pb-[7px] pt-[6px]`}
            >
              <div
                className={`text-gray5 line-clamp-2 w-full cursor-pointer break-words text-sm`}
              >
                {reply.text}
              </div>

              {/* Bubbles */}
              <div className={`absolute -bottom-1 -left-1 h-3 w-3`}>
                <div
                  className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-[#F4F4F4]`}
                />
                <div
                  className={`left -0 absolute bottom-0 h-1 w-1 rounded-full bg-[#F4F4F4]`}
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const getPositionClasses = (index: number, count: number) => {
  switch (count) {
    case 1:
      return {
        positionClasses: "center-x center-y",
        width: 80,
        height: 80,
      };

    case 2:
      if (index === 0)
        return { positionClasses: "top-4 left-4", width: 40, height: 40 };
      return { positionClasses: "bottom-4 right-4", width: 24, height: 24 };

    case 3:
      if (index === 0)
        return { positionClasses: "top-2 right-6", width: 40, height: 40 };
      if (index === 1)
        return { positionClasses: "right-4 bottom-3", width: 32, height: 32 };
      return { positionClasses: "left-3 bottom-6", width: 24, height: 24 };

    case 4:
      if (index === 0)
        return { positionClasses: "left-3 top-4", width: 36, height: 36 };
      if (index === 1)
        return {
          positionClasses: "left-[26px] bottom-[10px]",
          width: 28,
          height: 28,
        };
      if (index === 2)
        return { positionClasses: "top-3 right-4", width: 24, height: 24 };
      return {
        positionClasses: "right-4 bottom-6",
        width: 26,
        height: 26,
      };

    default:
      return { positionClasses: "", width: 30, height: 30 };
  }
};

export default Heart;
