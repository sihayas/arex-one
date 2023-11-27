import React from "react";

import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { useHandleArtifactClick } from "@/hooks/useInteractions/useHandlePageChange";

import { Artwork } from "../global/Artwork";
import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
interface ArtifactFeedProps {
  artifact: ArtifactExtended;
}

export const ArtifactFeed: React.FC<ArtifactFeedProps> = ({ artifact }) => {
  const user = useUser();
  const sound = artifact.appleAlbumData || artifact.appleTrackData;

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    artifact.heartedByUser,
    artifact._count.hearts,
    "/api/artifact/entry/post/",
    "artifactId",
    artifact.id,
    artifact.author.id,
    user?.id,
  );

  const isAlbumEntry = artifact.sound.type === "albums";
  const isWisp = artifact.type === "wisp";

  const handleEntryClick = useHandleArtifactClick(artifact);

  return (
    <motion.div className="flex flex-col w-fit relative">
      {/* Top Section */}
      <div className={`flex items-end w-[608px]`}>
        {/* Username and Avatar*/}
        <div className={`flex items-center gap-2 h-fit`}>
          <p
            className={`text-gray4 font-medium text-sm leading-[75%] min-w-[162px] text-end`}
          >
            {artifact.author.username}
          </p>
          <Avatar
            className={`h-[42px] border border-silver`}
            imageSrc={artifact.author.image}
            altText={`${artifact.author.username}'s avatar`}
            width={42}
            height={42}
            user={artifact.author}
          />
        </div>

        {/* Rating */}
        <Stars
          className={`bg-[#E5E5E6] absolute -top-[14px] left-[210px] rounded-full w-max text-[#808084] -z-10 p-[6px]`}
          rating={artifact.content?.rating}
          isWisp={isWisp}
        />

        {/* Rating, content & bubbles */}
        <div
          className={`bg-[#F4F4F4] rounded-[18px] relative px-[10px] pt-[6px] pb-[7px] max-w-[384px] w-fit mb-3 ml-3`}
        >
          {/* White Outline */}
          <div
            className={`-z-10 bg-white rounded-[16px] w-[86px] h-[40px] absolute -top-[1px] -left-[1px]`}
          />
          {/* Names */}
          <div
            className={`absolute -top-4 left-[18px] text-xs text-gray5 leading-[1] w-max gap-1 flex`}
          >
            <div className={`font-medium`}>{sound.attributes.name}</div>
            &middot;
            <span className={`font-normal`}>{sound.attributes.artistName}</span>
          </div>

          {/* Content */}
          <div
            onClick={handleEntryClick}
            className={`break-words line-clamp-6 w-full text-sm text-gray5 cursor-pointer z-10`}
          >
            {artifact.content?.text || artifact.content?.text}
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

      {/* Artwork */}
      {isAlbumEntry ? (
        <Artwork
          outerClassName={`ml-[224px] -mt-1 w-fit h-fit rounded-2xl`}
          className="rounded-2xl outline outline-silver outline-1"
          sound={sound}
          width={320}
          height={320}
        />
      ) : (
        <div className={`ml-[224px] -mt-1 flex items-end`}>
          <Artwork
            outerClassName={`rounded-2xl`}
            className="rounded-2xl outline outline-silver outline-1"
            sound={sound}
            width={160}
            height={160}
          />
        </div>
      )}
    </motion.div>
  );
};
