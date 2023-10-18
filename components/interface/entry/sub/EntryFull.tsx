import React from "react";

import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";

import { Artwork } from "@/components/feed/subcomponents/Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";
import { motion } from "framer-motion";
import { EntryBlobAlbum } from "@/components/icons";
import { RecordExtended } from "@/types/globalTypes";
import { useUser } from "@supabase/auth-helpers-react";

interface EntryFullProps {
  record: RecordExtended;
}

export const EntryFull: React.FC<EntryFullProps> = ({ record }) => {
  const user = useUser();
  const album = record.appleAlbumData;

  const { liked, handleLikeClick, likeCount } = useHandleLikeClick(
    record.likedByUser,
    record._count.likes,
    "/api/record/entry/post/like",
    "reviewId",
    record.id,
    user?.id,
  );

  return (
    <div className="flex flex-col items-center p-8 relative">
      <div className="relative">
        <Artwork album={album} width={320} height={320} />
        <Stars
          className={`absolute -bottom-8 w-fit left-1/2 -translate-x-1/2  shadow-stars outline outline-silver outline-[.5px] pr-2`}
          rating={record.entry!.rating}
          soundName={album.attributes.name}
          artist={album.attributes.artistName}
        />
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-2 ml-7 mb-2 mt-8 w-full">
        <UserAvatar
          className="w-10 h-10 outline outline-1 outline-silver"
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

      <EntryBlobAlbum className={"ml-6 w-full"} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col w-[416px] bg-[#F4F4F4] rounded-[13px] relative px-4 pt-[11px] pb-[10px] gap-2">
          {/* Content*/}
          <div
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
    </div>
  );
};
