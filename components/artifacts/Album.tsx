import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import Stars from "@/components/global/Stars";
import { useSoundContext } from "@/context/SoundContext";
import { ArtifactExtended } from "@/types/globalTypes";
import { useUser } from "@supabase/auth-helpers-react";
import { AlbumData } from "@/types/appleTypes";
import Heart from "@/components/global/Heart";

const Album = ({ artifact }: { artifact: ArtifactExtended }) => {
  const { selectedSound } = useSoundContext();
  const user = useUser();

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    artifact.heartedByUser,
    artifact._count.hearts,
    "/api/artifact/entry/post/",
    "recordId",
    artifact.id,
    artifact.author.id,
    user?.id,
  );

  const handleEntryClick = useArtifact({
    ...artifact,
    appleData: selectedSound?.sound as AlbumData,
  });

  if (!selectedSound?.sound) {
    return null;
  }
  return (
    <div className={`flex items-end relative w-full`}>
      {/* Username and Avatar*/}
      <Avatar
        className={`h-[32px] border border-gray3`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={32}
        height={32}
        user={artifact.author}
      />

      {/* Rating, content & bubbles */}
      <div
        className={`bg-[#F4F4F4] rounded-[18px] relative px-[10px] pt-[6px] pb-[7px] max-w-[404px] w-fit mb-3 ml-3`}
      >
        {/* Rating */}
        <Stars
          className={`absolute bg-white -top-[18px] -left-[18px] rounded-full w-max text-[#808084] p-2 shadow-shadowKitMedium z-10`}
          rating={artifact.content?.rating}
        />

        {/* Names */}
        <div
          className={`absolute -top-4 left-[18px] text-xs text-gray5 leading-[1] font-medium w-max`}
        >
          {artifact.author.username}
        </div>

        {/* Content */}
        <div
          onClick={handleEntryClick}
          className={`break-words line-clamp-6 w-full text-sm text-gray5 leading-normal cursor-pointer z-10`}
        >
          {artifact.content?.text}
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
          replyCount={artifact._count.replies}
        />
      </div>
    </div>
  );
};

export default Album;
