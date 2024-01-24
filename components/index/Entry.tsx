import React, { useRef, useState } from "react";

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

interface NewAProps {
  artifact: ArtifactExtended;
}

export const Entry: React.FC<NewAProps> = ({ artifact }) => {
  const { handleSelectSound } = useSound();
  const { playContent } = useSoundContext();
  const { user } = useInterfaceContext();
  const [hoverContent, setHoverContent] = useState(false);

  const variants = {
    initial: { translateY: 64, borderRadius: 16 },
    hover: {
      translateY: 0,
      borderRadius: 32,
    },
    hoverContent: {
      translateY: 246,
      borderRadius: 24,
    },
  };

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "720")
    .replace("{h}", "720");
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
    maskImage: "url('/images/entry_mask.svg')",
    maskSize: "cover",
    maskRepeat: "no-repeat",
    WebkitMaskImage: "url('/images/entry_mask.svg')",
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
      <Heart
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className="absolute -top-[28px] left-[46px] mix-blend-multiply"
        heartCount={heartCount}
        replyCount={artifact._count.replies}
      />
      {/* Content Inner / Card */}
      <motion.div
        style={{
          width: 304,
          height: 384,
          ...maskStyle,
        }}
        className={`flex flex-col relative will-change-transform bg-white`}
      >
        {/* Content Container */}
        <motion.div
          onHoverStart={() => setHoverContent(true)}
          onHoverEnd={() => setHoverContent(false)}
          className={`flex flex-col gap-2.5 cursor-pointer p-6 w-full h-full bg-white`}
          onClick={handleEntryClick}
        >
          <div className={`flex items-center gap-4 w-full pr-2`}>
            <EntryDial rating={artifact.content!.rating!} />

            <div className={`flex flex-col gap-0.5`}>
              <div className={`text-sm text-gray2 line-clamp-1 leading-tight`}>
                {sound.attributes.artistName}
              </div>
              <div
                className={`font-medium text-base text-black line-clamp-1 leading-normal`}
              >
                {sound.attributes.name}
              </div>
            </div>
          </div>

          <div className={`text-base text-black line-clamp-[10] pt-0`}>
            {artifact.content?.text}
          </div>

          <div></div>
        </motion.div>

        {/* Artwork */}
        <motion.div
          className="cursor-pointer absolute bottom-0 left-0 overflow-hidden"
          variants={variants}
          animate={hoverContent ? "hoverContent" : "initial"}
          whileHover="hover"
          transition={{
            type: "spring",
            stiffness: 357,
            damping: 38,
            mass: 1.5,
          }}
          onClick={handleSoundClick}
        >
          <Image
            src={artwork}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            width={304}
            height={304}
          />
        </motion.div>
      </motion.div>

      {/* Ambien */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute left-[52px] w-[304px] h-[384px] -z-10`}
      />
    </div>
  );
};
