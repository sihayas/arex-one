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

  const url =
    notifications[0].activity.heart.artifact?.appleData.attributes.artwork
      .url ||
    notifications[0].activity.heart.reply?.artifact.appleData.attributes.artwork
      .url;

  const artwork = url.replace("{w}", "280").replace("{h}", "280");

  const reply = notifications[0].activity.heart.reply;

  return (
    <div
      className={`flex items-center flex-wrap w-[208px] min-h-[128px] gap-4 relative`}
    >
      <motion.div
        style={{
          paddingBottom: reply ? 68 : 0,
        }}
        className={`flex flex-col items-center z-10`}
      >
        <div className="bg-[#F4F4F4] rounded-max relative w-[96px] h-[96px] flex justify-center items-center">
          {notifications.map((notification: any, index: number) => {
            const { image, id } = notification.activity.heart.author;
            const { positionClasses, width, height } = getPositionClasses(
              index,
              count,
            );
            return (
              <Image
                key={id}
                className={`absolute ${positionClasses} rounded-max border border-silver overflow-hidden`}
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
            <div className="absolute top-6 left-3 text-xs leading-[8px] text-white bg-gray3 rounded-full w-[26px] h-[26px] flex items-center justify-center font-bold">
              {remainingCount}
            </div>
          )}
          <HeartIcon className={`absolute top-0 left-0`} />
        </div>
        <div className="text-sm leading-[9px] text-gray2 font-medium mt-2">
          {notifications[0].activity.heart.author.username}
        </div>

        {reply && (
          <div className={`absolute -bottom-1.5 left-0 flex items-end w-full`}>
            <Avatar
              className={`h-6 border border-silver`}
              imageSrc={reply.author.image}
              altText={`${reply.author.username}'s avatar`}
              user={reply.author}
              width={24}
              height={24}
            />
            <div
              className={`bg-[#F4F4F4] rounded-[18px] relative px-[10px] pt-[6px] pb-[7px] max-w-[172px] w-fit mb-3 ml-3`}
            >
              <div
                className={`break-words line-clamp-2 w-full text-sm text-gray5 cursor-pointer`}
              >
                {reply.text}
              </div>

              {/* Bubbles */}
              <div className={`w-3 h-3 absolute -bottom-1 -left-1`}>
                <div
                  className={`bg-[#F4F4F4] w-2 h-2 absolute top-0 right-0 rounded-full`}
                />
                <div
                  className={`bg-[#F4F4F4] w-1 h-1 absolute bottom-0 left -0 rounded-full`}
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
      {/* Art / Reply */}
      <motion.div
        className={`min-w-[86px] h-[112px] rounded-2xl overflow-hidden relative ml-[5px] rotate-3`}
      >
        <Image
          className={`cursor-pointer rounded-2xl`}
          src={artwork}
          alt={`Artwork`}
          loading="lazy"
          quality={100}
          style={{ objectFit: "cover" }}
          fill={true}
        />
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
        return { positionClasses: "right-3 bottom-4", width: 36, height: 36 };
      if (index === 1)
        return { positionClasses: "top-2 right-6", width: 32, height: 32 };
      if (index === 2)
        return { positionClasses: "left-4 bottom-3", width: 28, height: 28 };
      return {
        positionClasses: "top-6 left-3",
        width: 26,
        height: 26,
      };

    default:
      return { positionClasses: "", width: 30, height: 30 };
  }
};

export default Heart;
