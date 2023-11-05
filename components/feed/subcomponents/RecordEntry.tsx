import React from "react";

import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { useHandleEntryClick } from "@/hooks/useInteractions/useHandlePageChange";

import { Artwork } from "../../global/Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import HeartButton from "@/components/global/HeartButton";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import { RecordExtended } from "@/types/globalTypes";

import { EntryBlob } from "@/components/icons";

interface RecordEntryProps {
  record: RecordExtended;
  associatedType: "album" | "track";
}

export const RecordEntry: React.FC<RecordEntryProps> = ({
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

  const handleEntryClick = useHandleEntryClick(record);

  return (
    <div className="flex w-fit gap-2">
      {/* Username and Rating */}
      <div className={`flex items-center relative z-10 h-fit`}>
        <p
          className={`text-gray4 font-medium text-xs leading-[75%] mr-2 text-end w-[126px]`}
        >
          {record.author.username}
        </p>
        <div className={`relative w-[42px] h-[42px] drop-shadow-sm`}>
          <UserAvatar
            className={`h-[42px] border border-gray3`}
            imageSrc={record.author.image}
            altText={`${record.author.username}'s avatar`}
            width={42}
            height={42}
            user={record.author}
          />
          <Stars
            className={`bg-[#F4F4F4] absolute -top-[32px] left-[42px] rounded-full backdrop-blur-xl p-[6px] w-max z-10 pr-2 text-[#808084] `}
            rating={record.entry!.rating}
            soundName={sound.attributes.name}
            artist={sound.attributes.artistName}
          />
          <div
            className={`bg-[#F4F4F4] w-1 h-1 absolute -top-1 left-[46px] rounded-full`}
          />
          <div
            className={`bg-[#F4F4F4] w-2 h-2 absolute -top-3 left-[50px] rounded-full`}
          />
        </div>
      </div>

      <div
        className={`flex flex-col bg-[#F4F4F4] rounded-[16px] relative transition-all duration-300 ease-entryPreview will-change-transform pt-[11px] ${
          isAlbumEntry ? "w-[352px]" : "w-[224px]"
        } `}
      >
        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-6 w-full text-sm text-[#3C3C43]/60 leading-normal cursor-pointer px-4 will-change-transform`}
        >
          {record.entry?.text}
        </div>

        <div className="relative mt-[10px]">
          <div
            style={{
              pointerEvents: "none",
              content: "",
              position: "absolute",
              bottom: "50%",
              left: 0,
              right: 0,
              top: 0,
              background:
                "linear-gradient(rgb(244, 244, 244), transparent 50%)",
            }}
          ></div>
          <Artwork
            className="rounded-b-[16px]"
            sound={sound}
            width={isAlbumEntry ? 352 : 224}
            height={isAlbumEntry ? 352 : 224}
          />
        </div>

        <HeartButton
          handleHeartClick={handleHeartClick}
          hearted={hearted}
          className="absolute -bottom-0 -right-0"
          heartCount={heartCount}
          replyCount={record._count.replies}
        />
      </div>
    </div>
  );
};
