import React from "react";

import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { useHandleRecordClick } from "@/hooks/useInteractions/useHandlePageChange";

import Avatar from "@/components/global/Avatar";
import Stars from "@/components/global/Stars";
import { useSound } from "@/context/SoundContext";
import { RecordExtended } from "@/types/globalTypes";
import { useUser } from "@supabase/auth-helpers-react";
import { AlbumData } from "@/types/appleTypes";
import Heart from "@/components/global/Heart";

const RecordAlbum = ({ record }: { record: RecordExtended }) => {
  const { selectedSound } = useSound();
  const user = useUser();

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    record.heartedByUser,
    record._count.hearts,
    "/api/record/record/post/",
    "recordId",
    record.id,
    record.author.id,
    user?.id,
  );

  const handleEntryClick = useHandleRecordClick({
    ...record,
    appleAlbumData: selectedSound?.sound as AlbumData,
  });

  if (!selectedSound?.sound) {
    return null;
  }
  return (
    <div className={`flex items-end relative w-full`}>
      {/* Username and Avatar*/}
      <Avatar
        className={`h-[32px] border border-gray3`}
        imageSrc={record.author.image}
        altText={`${record.author.username}'s avatar`}
        width={32}
        height={32}
        user={record.author}
      />

      {/* Rating */}
      <Stars
        className={`bg-[#E5E5E6] absolute -top-[14px] left-[30px] rounded-full w-max text-[#808084] -z-10 p-[6px]`}
        rating={record.entry?.rating}
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
          {record.author.username}
        </div>

        {/* Content */}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-6 w-full text-sm text-gray5 leading-normal cursor-pointer z-10`}
        >
          {record.entry?.text || record.caption?.text}
        </div>

        {/* Bubbles */}
        <div className={`w-3 h-3 absolute -bottom-1 -left-1 -z-10`}>
          <div
            className={`bg-[#F4F4F4] w-2 h-2 absolute top-0 right-0 rounded-full`}
          />
          <div
            className={`bg-[#F4F4F4] w-1 h-1 absolute bottom-0 left -0 rounded-full`}
          />
        </div>
        <Heart
          handleHeartClick={handleHeartClick}
          hearted={hearted}
          className="absolute -bottom-1 -right-1"
          heartCount={heartCount}
          replyCount={record._count.replies}
        />
      </div>
    </div>
  );
};

export default RecordAlbum;
