import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
import Image from "next/image";
import EntryDial from "@/components/global/EntryDial";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { MaskCardBottom, MaskCardTop } from "@/components/icons";

interface NewAProps {
  artifact: ArtifactExtended;
}

export const Entry: React.FC<NewAProps> = ({ artifact }) => {
  const { user } = useInterfaceContext();

  const sound = artifact.appleData;
  const artwork = MusicKit.formatArtworkURL(sound.attributes.artwork, 540, 540);
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

  const maskStyle = {
    maskImage: "url('/images/mask_card_top.svg')",
    maskSize: "cover",
    maskRepeat: "no-repeat",
    WebkitMaskImage: "url('/images/mask_card_top.svg')",
    WebkitMaskSize: "cover",
    WebkitMaskRepeat: "no-repeat",
  };

  return (
    <div className={`flex items-end gap-2.5 relative group w-[356px] group`}>
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
        className={`flex flex-col will-change-transform bg-white relative z-10 overflow-scroll`}
      >
        <Image
          className={`outline outline-1 outline-silver min-w-[304px] min-h-[304px] -mt-8`}
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          width={304}
          height={304}
        />
        {/* Content Container */}
        <div className={`px-6 pt-4 pb-2 flex items-center gap-2`}>
          <EntryDial rating={artifact.content!.rating!} />

          <div className={`flex flex-col`}>
            <div className={`text-sm text-black line-clamp-1`}>
              {sound.attributes.artistName}
            </div>
            <div className={`font-semibold text-base text-black line-clamp-1`}>
              {sound.attributes.name}
            </div>
          </div>
        </div>

        <div className={`text-base text-gray4 px-6`}>
          {artifact.content?.text}
        </div>
      </motion.div>

      <div className={`absolute bottom-0 right-0 cloud-shadow`}>
        <MaskCardTop />
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

// const handleSoundClick = async () => {
//   playContent(sound.id, sound.type);
// };

// const handleSoundClick = async () => {
//     handleSelectSound(sound);
// };
//

// const { playContent } = useSoundContext();
//
