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
    appleData: selectedSound as AlbumData,
  });

  if (!selectedSound) {
    return null;
  }

  return (
    <>
      {/* Rating & Attribution */}
      <div
        className={`absolute center-x -top-[23px] py-1 px-[5px] flex items-center gap-2 bg-white shadow-shadowKitMedium rounded-full`}
      >
        <div
          className={`flex items-center justify-center p-2 outline outline-silver outline-1 rounded-full w-max`}
        >
          <Stars rating={artifact.content?.rating} />
        </div>

        <div className={`text-sm leading-[10px] text-[#000] font-bold`}>
          {artifact.author.username}
        </div>
        <Avatar
          className={`h-[30px]`}
          imageSrc={artifact.author.image}
          altText={`${artifact.author.username}'s avatar`}
          width={30}
          height={30}
          user={artifact.author}
        />
      </div>

      {/* Content */}
      <div
        onClick={handleEntryClick}
        className={`break-words line-clamp-6 w-full text-sm text-center text-gray5 leading-normal font-medium cursor-pointer z-10`}
      >
        {artifact.content?.text}
      </div>

      <Heart
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className="absolute -top-[28px] -left-[7px]"
        heartCount={heartCount}
        replyCount={artifact._count.replies}
      />
    </>
  );
};

export default Album;
