import React from "react";

import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { useHandleEntryClick } from "@/hooks/useInteractions/useHandlePageChange";

import { Artwork } from "../../global/Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import HeartButton from "@/components/global/HeartButton";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import { RecordExtended } from "@/types/globalTypes";

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
    "/api/record/entry/post/heart",
    "recordId",
    record.id,
    record.author.id,
    user?.id
  );

  const handleEntryClick = useHandleEntryClick(record);

  return (
    <div className="flex">
      <p
        className={`text-gray2 font-medium text-sm leading-[75%] mr-2 text-end min-w-[126px] ${
          associatedType === "album"
            ? "translate-y-[384px]"
            : "translate-y-[128px]"
        }`}
      >
        {record.author.username}
      </p>
      <UserAvatar
        className={`w-10 h-10 outline outline-[.5px] outline-silver mr-2 ${
          associatedType === "album"
            ? "translate-y-[369px]"
            : "translate-y-[113px]"
        }`}
        imageSrc={record.author.image}
        altText={`${record.author.username}'s avatar`}
        width={40}
        height={40}
        user={record.author}
      />
      {/*<EntryBlob className={`translate-y-[339.5px]`} />*/}
      <div className="flex flex-col w-[384px] bg-[#F4F4F4] rounded-[13px] relative p-4">
        {associatedType === "album" ? (
          <>
            <Artwork sound={sound} />
            <Stars
              className={`absolute top-[335px] -left-[13px] shadow-stars outline outline-silver outline-[.5px] pl-[30px] pr-2 rounded-br-2xl rounded-tr-2xl rounded-bl-lg rounded-tl-lg`}
              rating={record.entry!.rating}
              soundName={sound.attributes.name}
              artist={sound.attributes.artistName}
            />
          </>
        ) : (
          <div className="flex w-full items-center gap-4">
            <Artwork sound={sound} width={96} height={96} />
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#3C3C43]/60 leading-[75%] font-medium">
                {sound.attributes.name}
              </p>
              <div className={"flex items-center gap-2"}>
                <p className="text-xs text-[#3C3C43]/60 leading-[75%]">
                  {/* {sound.attributes.albumName} */}
                </p>
                <p className="text-xs text-[#3C3C43]/60 leading-[75%]">
                  {sound.attributes.artistName}
                </p>
              </div>
            </div>

            <Stars
              className={`absolute top-[80px] -left-[13px] shadow-stars outline outline-silver outline-[.5px] pl-[30px] rounded-br-2xl rounded-tr-2xl rounded-bl-lg rounded-tl-lg`}
              rating={record.entry!.rating}
            />
          </div>
        )}

        {/* Content*/}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-4 w-full text-sm text-[#3C3C43]/60 leading-normal cursor-pointer mt-[11px]`}
        >
          {record.entry?.text}
        </div>

        <HeartButton
          handleHeartClick={handleHeartClick}
          hearted={hearted}
          className="absolute -bottom-2 -right-2"
          heartCount={heartCount}
          replyCount={record._count.replies}
        />
      </div>
    </div>
  );
};
