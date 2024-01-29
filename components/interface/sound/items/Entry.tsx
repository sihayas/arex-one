import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import { useSoundContext } from "@/context/SoundContext";
import { ArtifactExtended } from "@/types/globalTypes";

import { AlbumData } from "@/types/appleTypes";
import Heart from "@/components/global/Heart";
import EntryDial from "@/components/global/EntryDial";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { getStarComponent } from "@/components/index/items/Entry";

const Entry = ({ artifact }: { artifact: ArtifactExtended }) => {
  const { selectedSound } = useSoundContext();
  const { user } = useInterfaceContext();

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
    <div
      className={`flex flex-col bg-[#F4F4F4] relative w-full px-6 pt-[18px] pb-4 rounded-full gap-2.5 outline outline-1 outline-silver`}
    >
      <div
        className={`absolute -top-3 -left-3 flex items-center justify-center bg-[#F4F4F4] rounded-max shadow-shadowKitMedium p-3`}
      >
        {getStarComponent(artifact.content!.rating!)}
      </div>
      {/* Content */}
      <div
        onClick={handleEntryClick}
        className={`break-words line-clamp-6 w-full text-base text-center text-black cursor-pointer`}
      >
        {artifact.content?.text}
      </div>

      <div className={`flex items-center gap-2 -mx-2`}>
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

      {/*<Heart*/}
      {/*  handleHeartClick={handleHeartClick}*/}
      {/*  hearted={hearted}*/}
      {/*  className="absolute -top-[30px] -left-[8px]"*/}
      {/*  heartCount={heartCount}*/}
      {/*  replyCount={artifact._count.replies}*/}
      {/*/>*/}
    </div>
  );
};

export default Entry;
