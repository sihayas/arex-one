import React, { useState } from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact, useSound } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
import Image from "next/image";
import EntryDial from "@/components/global/EntryDial";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useSoundContext } from "@/context/SoundContext";
import { MaskCardBottom } from "@/components/icons";

interface NewAProps {
  artifact: ArtifactExtended;
}

export const Entry: React.FC<NewAProps> = ({ artifact }) => {
  const { handleSelectSound } = useSound();
  const { playContent } = useSoundContext();
  const { user } = useInterfaceContext();

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "540")
    .replace("{h}", "540");
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

  const handleSoundClick = async () => {
    playContent(sound.id, sound.type);
  };

  // const handleSoundClick = async () => {
  //     handleSelectSound(sound);
  // };
  //

  const maskStyle = {
    maskImage: "url('/images/mask_card_bottom.svg')",
    maskSize: "cover",
    maskRepeat: "no-repeat",
    WebkitMaskImage: "url('/images/mask_card_bottom.svg')",
    WebkitMaskSize: "cover",
    WebkitMaskRepeat: "no-repeat",
  };

  return (
    <div className={`flex gap-2.5 relative group w-[356px] group`}>
      <Avatar
        className={`h-[42px] border border-silver z-10`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={42}
        height={42}
        user={artifact.author}
      />

      {/* Content Inner / Card */}
      <motion.div
        style={{
          width: 304,
          height: 400,
          ...maskStyle,
        }}
        className={`flex flex-col will-change-transform bg-white relative z-10`}
      >
        {/* Content Container */}
        <motion.div className={`flex`} onClick={handleEntryClick}>
          <div className={`p-6`}>
            <EntryDial rating={artifact.content!.rating!} />
          </div>
          <Image
            className={`rounded-bl-[20px] outline outline-1 outline-silver`}
            src={artwork}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            width={216}
            height={216}
          />
        </motion.div>
        <div className={`flex flex-col px-6 pt-[20px] pb-[18px]`}>
          <div className={`text-sm text-gray5 line-clamp-1`}>
            {sound.attributes.artistName}
          </div>
          <div className={`font-semibold text-base text-gray4 line-clamp-1`}>
            {sound.attributes.name}
          </div>
        </div>
        <div className={`text-base text-gray4 line-clamp-[10] px-6`}>
          {artifact.content?.text}
        </div>

        <motion.div
          style={{
            background: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.68) 56.5%, #FFF 100%)`,
          }}
          className={`absolute bottom-0 left-0 w-full h-12`}
        />
      </motion.div>

      <div className={`absolute bottom-0 right-0 cloud-shadow`}>
        <MaskCardBottom />
      </div>

      {/* Ambien */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute left-[52px] w-[304px] h-[400px] -z-10`}
      />

      <Heart
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className="absolute -top-[28px] left-[46px] mix-blend-multiply"
        heartCount={heartCount}
        replyCount={artifact._count.replies}
      />
    </div>
  );
};
