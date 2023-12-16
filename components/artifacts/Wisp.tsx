import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact, useSound } from "@/hooks/usePage";

import { Artwork } from "../global/Artwork";
import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
import ArtworkURL from "@/components/global/ArtworkURL";
import Image from "next/image";

interface NewWProps {
  artifact: ArtifactExtended;
}

export const Wisp: React.FC<NewWProps> = ({ artifact }) => {
  const user = useUser();
  const { handleSelectSound } = useSound();

  const sound = artifact.appleData;
  const url = ArtworkURL(sound.attributes.artwork.url, "320");
  const color = sound.attributes.artwork.bgColor;
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
  const handleSoundClick = () => {
    handleSelectSound(sound, url);
  };

  if (!sound) return null;

  return (
    <motion.div className="flex flex-col gap-4 w-[438px]">
      {/* Artwork Capsule */}
      <div
        onClick={handleSoundClick}
        className={`flex items-center gap-4 w-[384px] h-fit relative ml-[54px]`}
      >
        <div className={`p-2 bg-[#F4F4F4]/50  rounded-[24px]`}>
          <Image
            className={`cursor-pointer rounded-[16px] shadow-shadowKitLow`}
            src={url}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            width={128}
            height={128}
          />
        </div>

        {/* Names */}
        <div className={`flex flex-col gap-3`}>
          <p
            className={`text-[#000] font-medium text-sm leading-[10px] w-[162px]`}
          >
            {sound.attributes.name}
          </p>
          <p className={`text-[#000] font text-xs leading-[9px] min-w-[162px]`}>
            {sound.attributes.artistName}
          </p>
        </div>
        {/* Blur Color */}
        <div
          style={{
            background: `#${color}`,
            backgroundRepeat: "repeat, no-repeat",
          }}
          className={`absolute left-0 top-0 w-full h-full -z-10 rounded-full`}
        />
      </div>

      {/* Attribution & Content */}
      <div className={`flex items-end w-full z-10 mix-blend-multiply`}>
        {/* Avatar*/}
        <Avatar
          className={`h-[42px] border border-silver`}
          imageSrc={artifact.author.image}
          altText={`${artifact.author.username}'s avatar`}
          width={42}
          height={42}
          user={artifact.author}
        />
        <div className={`flex flex-col gap-2`}></div>

        {/* Rating, content & bubbles */}
        <div
          className={`bg-[#F4F4F4] rounded-[18px] relative px-[10px] pt-[6px] pb-[7px] max-w-[384px] w-fit mb-3 ml-3`}
        >
          {/* Content */}
          <div
            onClick={handleEntryClick}
            className={`break-words line-clamp-6 w-full text-sm text-gray5 cursor-pointer`}
          >
            {artifact.content?.text}
          </div>

          {/* Name */}
          <p
            className={`absolute -bottom-[13px] left-2 text-gray2 font-medium text-xs leading-[9px]`}
          >
            {artifact.author.username}
          </p>

          {/*<Heart*/}
          {/*  handleHeartClick={handleHeartClick}*/}
          {/*  hearted={hearted}*/}
          {/*  className="absolute -bottom-1 -right-1"*/}
          {/*  heartCount={heartCount}*/}
          {/*  replyCount={artifact._count.replies}*/}
          {/*/>*/}

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
          <div className={`w-3 h-3 absolute -bottom-1 -left-1`}>
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
