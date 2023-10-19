import React from "react";

import { Entry, Record, RecordType } from "@/types/dbTypes";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";
import { useHandleEntryClick } from "@/hooks/useInteractions/useHandlePageChange";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";

import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";
import { useSound } from "@/context/SoundContext";
import { motion } from "framer-motion";
import { EntryBlob, EntryBlobAlbum } from "@/components/icons";
import { Artwork } from "@/components/feed/subcomponents/Artwork";
import { RecordExtended } from "@/types/globalTypes";
import { useUser } from "@supabase/auth-helpers-react";

const RecordAlbum = ({ record }: { record: RecordExtended }) => {
  const { selectedSound } = useSound();
  const user = useUser();

  // Since it's rendered within an album page, assume the selected
  // sound/album is the same as the review
  let mergedRecord: RecordExtended = record;

  if (selectedSound && selectedSound.sound.type === "album") {
    mergedRecord = {
      ...record,
      appleAlbumData: {
        ...selectedSound.sound,
      },
    };
  }

  const { liked, handleLikeClick, likeCount } = useHandleLikeClick(
    record.likedByUser,
    record._count.likes,
    "/api/record/entry/post/like",
    "reviewId",
    record.id,
    user?.id
  );

  const handleEntryClick = useHandleEntryClick(mergedRecord);

  if (!selectedSound?.sound) {
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      <div className="flex items-center gap-2 ml-5 mb-1">
        <UserAvatar
          className="w-10 h-10 outline outline-[.5px] outline-silver"
          imageSrc={record.author.image}
          altText={`${record.author.username}'s avatar`}
          width={40}
          height={40}
          user={record.author}
        />
        <p className="text-gray2 font-medium text-sm leading-[75%]">
          {record.author.username}
        </p>
      </div>

      <EntryBlobAlbum className={"ml-4"} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col w-[416px] bg-[#F4F4F4] rounded-[13px] relative p-4 gap-2">
          {/* Content*/}
          <div
            onClick={handleEntryClick}
            className={`break-words line-clamp-4 w-full text-sm text-[#3C3C43]/60 leading-normal cursor-pointer`}
          >
            {record.entry?.text}
          </div>

          <LikeButton
            handleLikeClick={handleLikeClick}
            liked={liked}
            className="absolute -bottom-2 -right-2"
            likeCount={likeCount}
            replyCount={record._count.replies}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RecordAlbum;
