import Image from "next/image";
import React from "react";

import { useArtifact } from "@/hooks/usePage";
import { ReplyToReplyIcon } from "@/components/icons";
import { motion } from "framer-motion";
import {
  notificationVariants,
  notificationSpring,
} from "@/components/interface/nav/render/Notifications";

const Reply = ({ notificationsGroup, index }: any) => {
  const { handleSelectArtifact } = useArtifact();

  const notifications = notificationsGroup.notifications;
  const reply = notifications[0].activity.reply;
  const sound = reply.artifact?.sound.appleData;

  const url = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    32 * 2.5,
    32 * 2.5,
  );

  return (
    <motion.div
      variants={notificationVariants}
      transition={notificationSpring}
      key={reply.id}
      onClick={(event) => {
        event.stopPropagation();
      }}
      className={`flex flex-col flex-shrink-0 -space-y-3 origin-bottom-left`}
    >
      {/* Text */}
      <div
        className={`ml-12 bg-[#F6F6F6] px-4 pb-[18px] pt-[10px] max-w-[calc(100%-48px)] shadow-shadowKitLow rounded-3xl`}
      >
        <p className={`text-sm text-gray2 line-clamp-4`}>{reply.text}</p>
      </div>
      {/* Metadata & Attribution */}
      <div
        className={`flex flex-shrink-0 items-center bg-white rounded-xl shadow-notification`}
      >
        {/* Artwork */}
        <Image
          className="flex-shrink-0 rounded-l-xl"
          src={url}
          alt={`Artwork`}
          loading="lazy"
          quality={100}
          width={48}
          height={48}
        />

        {/* Avatar */}
        <Image
          className="outline-2 outline-white outline rounded-full flex-shrink-0 ml-4"
          src={reply.author.image}
          alt={``}
          width={18}
          height={18}
          quality={100}
        />

        {/* Attribution*/}
        <p className={`text-base text-black ml-2`}>{reply.author.username}</p>

        <div
          className={`ml-auto w-4 h-4 bg-black flex-shrink-0 rounded-full mr-4`}
        />
      </div>
    </motion.div>
  );
};

export default Reply;
