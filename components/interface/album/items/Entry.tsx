import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import { useSoundContext } from "@/context/SoundContext";
import { ArtifactExtended } from "@/types/globalTypes";
import { useUser } from "@supabase/auth-helpers-react";
import { AlbumData } from "@/types/appleTypes";
import Heart from "@/components/global/Heart";
import EntryDial from "@/components/global/EntryDial";

const Entry = ({ artifact }: { artifact: ArtifactExtended }) => {
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

  return (
    <>
      <div
        className={`absolute -top-4 -left-4 bg-[#F4F4F4] rounded-max shadow-shadowKitMedium w-[42px] h-[42px]`}
      >
        <div className={`absolute center-x center-y`}>
          {/* @ts-ignore */}
          <EntryDial rating={artifact.content!.rating} />
        </div>
      </div>
      {/* Content */}
      <div
        onClick={handleEntryClick}
        className={`break-words line-clamp-6 w-full text-base text-center text-gray5 font-medium cursor-pointer`}
      >
        {artifact.content?.text}
      </div>

      <div className={`flex items-center gap-2 -ml-2 -mb-1`}>
        <Avatar
          className={`border border-silver`}
          imageSrc={artifact.author.image}
          altText={`${artifact.author.username}'s avatar`}
          width={32}
          height={32}
          user={artifact.author}
        />
        <div className={`text-base leading-[10px] text-black font-semibold`}>
          {artifact.author.username}
        </div>
      </div>

      <Heart
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className="absolute -top-[28px] right-[7px]"
        heartCount={heartCount}
        replyCount={artifact._count.replies}
      />
    </>
  );
};

export default Entry;
