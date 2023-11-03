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
    <div className="flex">
      <p
        className={`text-gray4 font-medium text-xs leading-[75%] mr-2 text-end min-w-[126px] ${
          isAlbumEntry ? "translate-y-[350px]" : "translate-y-[224px]"
        }`}
      >
        {record.author.username}
      </p>
      {/* Username and Rating */}
      <div
        className={`flex relative w-10 h-10 mr-2 z-10 drop-shadow-sm ${
          isAlbumEntry ? "translate-y-[336px]" : "translate-y-[210px]"
        } `}
      >
        <UserAvatar
          className={`w-10 h-10 border border-gray3`}
          imageSrc={record.author.image}
          altText={`${record.author.username}'s avatar`}
          width={40}
          height={40}
          user={record.author}
        />
        <Stars
          className={`bg-[#F4F4F4]/80 absolute -top-[24px] left-[40px] rounded-full backdrop-blur-xl p-[6px] w-max z-10 pr-2`}
          rating={record.entry!.rating}
          soundName={sound.attributes.name}
          artist={sound.attributes.artistName}
        />
        <div
          className={`bg-[#F4F4F4]/80 w-1 h-1 absolute top-1 left-[44px] rounded-full`}
        />
        <div
          className={`bg-[#F4F4F4]/80 w-2 h-2 absolute -top-1 left-[48px] rounded-full`}
        />
      </div>

      <div
        className={`flex flex-col bg-[#F4F4F4] rounded-[16px] relative transition-all duration-300 ease-entryPreview will-change-transform ${
          isAlbumEntry ? "w-[352px]" : "w-[224px]"
        } `}
      >
        <div className="relative">
          <Artwork
            className="rounded-t-[16px]"
            sound={sound}
            width={isAlbumEntry ? 352 : 224}
            height={isAlbumEntry ? 352 : 224}
          />

          <div
            style={{
              content: "",
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(transparent 50%, #F4F4F4 95%)",
            }}
          ></div>
        </div>

        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-4 w-full text-sm text-[#3C3C43]/60 leading-normal cursor-pointer -mt-[5px] px-4 mb-[10px] will-change-transform`}
        >
          {record.entry?.text}
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
