import React from "react";

import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { useHandleRecordClick } from "@/hooks/useInteractions/useHandlePageChange";

import { Artwork } from "../../global/Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import HeartButton from "@/components/global/HeartButton";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import { RecordExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";

interface FeedRecordProps {
  record: RecordExtended;
  associatedType: "album" | "track";
}

export const FeedRecord: React.FC<FeedRecordProps> = ({
  record,
  associatedType,
}) => {
  const user = useUser();
  const sound = record.appleAlbumData;

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    record.heartedByUser,
    record._count.hearts,
    "/api/record/entry/post/",
    "recordId",
    record.id,
    record.author.id,
    user?.id,
  );

  const isAlbumEntry = associatedType === "album";
  const isCaption = record.caption ? true : false;

  const handleEntryClick = useHandleRecordClick(record);

  return (
    <motion.div className="flex flex-col w-fit relative">
      {/* Top Section */}
      <div className={`flex items-end w-[608px]`}>
        {/* Username and Avatar*/}
        <div className={`flex items-center gap-2 h-fit`}>
          <p
            className={`text-gray4 font-medium text-xs leading-[75%] min-w-[162px] text-end`}
          >
            {record.author.username}
          </p>
          <UserAvatar
            className={`h-[42px] border border-gray3`}
            imageSrc={record.author.image}
            altText={`${record.author.username}'s avatar`}
            width={42}
            height={42}
            user={record.author}
          />
        </div>

        {/* Rating */}
        <Stars
          className={`bg-[#E5E5E6] absolute -top-[14px] left-[210px] rounded-full w-max text-[#808084] -z-10 p-[6px]`}
          rating={record.entry?.rating}
          isCaption={isCaption}
        />

        {/* Rating, content & bubbles */}
        <div
          className={`bg-[#F4F4F4] rounded-[18px] relative px-[10px] pt-[6px] pb-[7px] max-w-[384px] w-fit mb-3 ml-3`}
        >
          <div
            className={`-z-10 bg-white rounded-[16px] w-[86px] h-[40px] absolute -top-[1px] -left-[1px]`}
          ></div>
          {/* Names */}
          <div
            className={`absolute -top-4 left-[18px] text-xs text-gray5 leading-[1] font-medium w-max`}
          >
            {sound.attributes.name} &middot;{" "}
            <span className={`font-normal`}>{sound.attributes.artistName}</span>
          </div>

          {/* Content */}
          <div
            onClick={handleEntryClick}
            className={`break-words line-clamp-6 w-full text-sm text-gray5 leading-normal cursor-pointer z-10`}
          >
            {record.entry?.text || record.caption?.text}
          </div>

          {/* Bubbles */}
          <div
            className={`bg-[#F4F4F4] w-2 h-2 absolute bottom-0 left-0 rounded-full`}
          />
          <div
            className={`bg-[#F4F4F4] w-1 h-1 absolute -bottom-1 -left-1 rounded-full`}
          />
          <HeartButton
            handleHeartClick={handleHeartClick}
            hearted={hearted}
            className="absolute -bottom-1 -right-1"
            heartCount={heartCount}
            replyCount={record._count.replies}
          />
        </div>
      </div>

      <Artwork
        className="rounded-[32px] ml-[224px] -mt-1 outline outline-silver outline-1"
        sound={sound}
        width={320}
        height={320}
      />
    </motion.div>
  );
};
