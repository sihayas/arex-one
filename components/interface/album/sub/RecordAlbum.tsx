import React from "react";

import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { useHandleEntryClick } from "@/hooks/useInteractions/useHandlePageChange";

import UserAvatar from "@/components/global/UserAvatar";
import HeartButton from "@/components/global/HeartButton";
import Stars from "@/components/global/Stars";
import { useSound } from "@/context/SoundContext";
import { motion } from "framer-motion";
import { RecordExtended } from "@/types/globalTypes";
import { useUser } from "@supabase/auth-helpers-react";
import { AlbumData } from "@/types/appleTypes";

const RecordAlbum = ({ record }: { record: RecordExtended }) => {
  const { selectedSound } = useSound();
  const user = useUser();

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    record.heartedByUser,
    record._count.hearts,
    "/api/record/entry/post/",
    "recordId",
    record.id,
    record.author.id,
    user?.id,
  );

  const handleEntryClick = useHandleEntryClick({
    ...record,
    appleAlbumData: selectedSound?.sound as AlbumData,
  });

  if (!selectedSound?.sound) {
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex bg-[#F4F4F4] rounded-3xl p-4 w-full gap-4 relative"
    >
      {/* Author Avatar / Left Side*/}
      <div className={`relative min-w-10 min-h-10 drop-shadow-sm`}>
        <UserAvatar
          className="border border-gray3"
          imageSrc={record.author.image}
          altText={`${record.author.username}'s avatar`}
          width={40}
          height={40}
          user={record.author}
        />
        <Stars
          className={`bg-[#F4F4F4]/80 absolute -top-[24px] left-[40px] rounded-full backdrop-blur-xl p-[6px] w-max z-10`}
          rating={record.entry!.rating}
        />
        <div
          className={`bg-[#F4F4F4]/80 w-1 h-1 absolute top-1 left-[44px] rounded-full`}
        />
        <div
          className={`bg-[#F4F4F4]/80 w-2 h-2 absolute -top-1 left-[48px] rounded-full`}
        />
      </div>

      {/* Right Side / Name & Content */}
      <div className="flex flex-col gap-[7px] w-full mt-[10px]">
        <p className="text-gray5 font-semibold text-xs leading-[75%]">
          {record.author.username}
        </p>
        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-4 w-full text-sm text-gray5 leading-normal cursor-pointer`}
        >
          {record.entry?.text}
        </div>
      </div>

      <HeartButton
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className="absolute bottom-0 right-0"
        heartCount={heartCount}
        replyCount={record._count.replies}
      />
    </motion.div>
  );
};

export default RecordAlbum;
