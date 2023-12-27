import Image from "next/image";
import React from "react";

import { motion } from "framer-motion";
import { HeartIcon } from "@/components/icons/Heart";
import Avatar from "@/components/global/Avatar";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Reply = ({ notificationsGroup }: any) => {
  const notifications = notificationsGroup.notifications;
  const { user } = useInterfaceContext();
  const reply = notifications[0].activity.reply;
  const isReplyTo = reply.replyTo;
  console.log(reply);

  const url = reply.artifact?.appleData.attributes.artwork.url;
  const artwork = url ? url.replace("{w}", "280").replace("{h}", "280") : null;

  return isReplyTo && user ? (
    <div className={`flex flex-col gap-2`}>
      {/* Parent */}
      <div className={`flex items-end justify-end min-w-full`}>
        <div
          className={`bg-[#F4F4F4] rounded-[18px] relative px-[10px] pt-[6px] pb-[7px] max-w-[172px] w-fit mb-3 mr-3`}
        >
          <div
            className={`break-words line-clamp-2 w-full text-sm text-gray5 cursor-pointer`}
          >
            {reply.replyTo.text}
          </div>

          {/* Bubbles */}
          <div className={`w-3 h-3 absolute -bottom-1 -right-1`}>
            <div
              className={`bg-[#F4F4F4] w-2 h-2 absolute top-0 left-0 rounded-full`}
            />
            <div
              className={`bg-[#F4F4F4] w-1 h-1 absolute bottom-0 right-0 rounded-full`}
            />
          </div>
        </div>

        <Avatar
          className={`h-6 border border-silver`}
          imageSrc={user.image}
          altText={`${user.username}'s avatar`}
          user={user}
          width={24}
          height={24}
        />
      </div>
      {/* Reply */}
      <div className={`flex items-end w-full`}>
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
            className={`break-words line-clamp-6 w-full text-sm text-gray5 cursor-pointer`}
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
    </div>
  ) : (
    <div className={`flex flex-col gap-2`}>
      <motion.div
        className={`min-w-[86px] h-[112px] rounded-2xl overflow-hidden relative ml-auto rotate-3`}
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
      {/* Reply */}
      <div className={`flex items-end w-full`}>
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
            className={`break-words line-clamp-6 w-full text-sm text-gray5 cursor-pointer`}
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
    </div>
  );
};

export default Reply;
