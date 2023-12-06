import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

import { Artwork } from "../global/Artwork";
import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";

interface FeedProps {
  artifact: ArtifactExtended;
}

export const Feed: React.FC<FeedProps> = ({ artifact }) => {
  const user = useUser();
  const sound = artifact.appleData;
  const apiUrl = artifact.heartedByUser
    ? "/api/heart/delete/artifact"
    : "/api/heart/post/artifact";

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    artifact.heartedByUser,
    artifact._count.hearts,
    apiUrl,
    "artifactId",
    artifact.id,
    artifact.author.id,
    user?.id,
  );
  const handleEntryClick = useArtifact(artifact);

  if (!sound) return null;

  const isAlbum = artifact.sound.type === "albums";
  const bgColor = sound.attributes.artwork.bgColor;

  return (
    <motion.div className="flex flex-col gap-4 w-fit relative">
      {/* Artwork */}
      {isAlbum ? (
        <Artwork
          outerClassName={`ml-[224px] w-fit h-fit`}
          className="rounded-[32px]"
          sound={sound}
          width={320}
          height={320}
          rating={artifact.content?.rating}
          bgColor={bgColor}
          isFeed={true}
          isAlbum={true}
        />
      ) : (
        <div className={`ml-[224px] flex items-end`}>
          <Artwork
            outerClassName={`rounded-[32px]`}
            className="rounded-[32px]"
            sound={sound}
            width={160}
            height={160}
            bgColor={bgColor}
            isFeed={true}
            isAlbum={false}
          />
        </div>
      )}
      <div className={`flex items-end w-[608px] -z-20`}>
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

        {/* Rating, content & bubbles */}
        <div
          className={`bg-[#F4F4F4] rounded-[18px] relative px-[10px] pt-[6px] pb-[7px] max-w-[384px] w-fit mb-3 ml-3`}
        >
          {/* Content */}
          <div
            onClick={handleEntryClick}
            className={`break-words line-clamp-6 w-full text-sm text-gray5 cursor-pointer z-10`}
          >
            {artifact.content?.text}
          </div>

          <Heart
            handleHeartClick={handleHeartClick}
            hearted={hearted}
            className="absolute -bottom-1 -right-1"
            heartCount={heartCount}
            replyCount={artifact._count.replies}
          />

          {/* Count */}
          {heartCount > 0 ||
            (artifact._count.replies > 0 && (
              <div
                className={`absolute -bottom-[25px] right-4 flex items-center gap-1 text-xs bg-white rounded-full p-[6px] font-medium shadow-shadowKitLow`}
              >
                <p className={`text-gray4 leading-[9px] text-red`}>
                  {heartCount}
                </p>
                {artifact._count.replies > 0 && (
                  <>
                    {heartCount > 0 && <div>&middot;</div>}
                    <p className={`text-gray4 leading-[9px] text-gray3`}>
                      {artifact._count.replies}
                    </p>
                  </>
                )}
              </div>
            ))}

          {/* Bubbles */}
          <div className={`w-3 h-3 absolute -bottom-1 -left-1 -z-10`}>
            <div
              className={`bg-[#F4F4F4] w-2 h-2 absolute top-0 right-0 rounded-full`}
            />
            <div
              className={`bg-[#F4F4F4] w-1 h-1 absolute bottom-0 left -0 rounded-full`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
