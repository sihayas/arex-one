import Image from "next/image";
import React from "react";

import { motion } from "framer-motion";

const Heart = ({ notificationsGroup }: any) => {
  const notifications = notificationsGroup.notifications.slice(0, 4);
  const count = Math.min(notificationsGroup.count, 4);
  const remainingCount =
    notificationsGroup.count > 4 ? notificationsGroup.count - 3 : 0;

  // Directly use notifications[0] when needed
  const artworkUrl =
    notifications[0].activity.heart.artifact?.appleData.attributes.artwork
      .url ||
    notifications[0].activity.heart.reply?.appleData.attributes.artwork.url;

  const artwork = artworkUrl.replace("{w}", "280").replace("{h}", "280");

  return (
    <div className={`flex items-center w-[208px] h-[128px] gap-4`}>
      {/* Users */}
      <div className={`flex flex-col items-center`}>
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
            <div className="absolute bottom-6 right-3 text-xs leading-[8px] text-white bg-gray3 rounded-full w-[26px] h-[26px] flex items-center justify-center font-bold">
              {remainingCount}
            </div>
          )}
        </div>
        <div className="text-sm leading-[9px] text-gray2 font-medium mt-2">
          {notifications[0].activity.heart.author.username}
        </div>
        {notificationsGroup.count > 1 && (
          <div className="text-xs leading-[8px] text-gray2 tracking-tight mt-[7px] font-medium">
            & {notificationsGroup.count - 1} others
          </div>
        )}
      </div>
      {/* Art */}
      <motion.div
        className={`min-w-[86px] h-[112px] rounded-xl overflow-hidden relative shadow-notificationCard`}
        style={{ x: 5, rotate: 3 }}
      >
        <Image
          className={`cursor-pointer`}
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
        return { positionClasses: "top-4 left-3", width: 36, height: 36 };
      if (index === 1)
        return { positionClasses: "left-6 bottom-2", width: 32, height: 32 };
      if (index === 2)
        return { positionClasses: "top-3 right-4", width: 28, height: 28 };
      return {
        positionClasses: "right-3 bottom-6",
        width: 26,
        height: 26,
      };

    default:
      return { positionClasses: "", width: 30, height: 30 };
  }
};

export default Heart;
