import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact, useSound } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
import Image from "next/image";
import ArtworkURL from "@/components/global/ArtworkURL";

interface NewAProps {
  artifact: ArtifactExtended;
}

export const Entry: React.FC<NewAProps> = ({ artifact }) => {
  const user = useUser();
  const { handleSelectSound } = useSound();

  const sound = artifact.appleData;
  const url = ArtworkURL(sound.attributes.artwork.url, "1148");
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
    await handleSelectSound(sound, url);
  };

  if (!sound) return null;

  return (
    <div className={`flex items-end gap-2.5 relative group w-[438px] group`}>
      <Avatar
        className={`h-[42px] border border-silver`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={42}
        height={42}
        user={artifact.author}
      />

      {/* Content Inner / Card */}
      <motion.div
        onClick={handleEntryClick}
        initial={{ rotate: 3, scale: 0.5, opacity: 0 }}
        animate={{ rotate: -1, scale: 1, opacity: 1 }}
        whileHover={{ scale: 0.96, rotate: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 34 }}
        className={`flex flex-col rounded-[32px] bg-white relative w-[384px] h-[538px] shadow-shadowKitHigh will-change-transform`}
      >
        {/* Stars */}
        <Heart
          handleHeartClick={handleHeartClick}
          hearted={hearted}
          className="absolute -top-7 -left-[7px]"
          heartCount={heartCount}
          replyCount={artifact._count.replies}
        />
        <div
          className={`absolute top-6 left-1/2 -translate-x-1/2 flex items-center p-2 pr-2.5 bg-white rounded-full w-max max-w-[272px] z-10 gap-2 shadow-shadowKitMedium max-h-8`}
        >
          <Stars rating={artifact.content?.rating} />
          <div
            className={`text-xs text-[#000] leading-[9px] font-medium line-clamp-1`}
          >
            {sound.attributes.name}
          </div>
          <div className={`-ml-1`}>&middot;</div>
          <div
            className={`-ml-1 text-xs text-[#000] leading-[9px] line-clamp-1`}
          >
            {sound.attributes.artistName}
          </div>
        </div>

        <Image
          className={`cursor-pointer rounded-[32px]`}
          src={url}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          style={{ objectFit: "cover" }}
          fill={true}
          // onClick={handleSoundClick}
        />
        {/* Gradient */}
        <div
          style={{
            background: `linear-gradient(to top, #${color}, rgba(0,0,0,0)`,
          }}
          className="absolute bottom-0 w-full h-4/5 rounded-b-[32px] pointer-events-none"
        />
        <div
          className={`absolute px-6 text-sm text-white font-medium line-clamp-5 bottom-[18px] pointer-events-none`}
        >
          {artifact.content?.text}
        </div>

        {/* Name */}
        <p
          className={`absolute -bottom-[13px] left-2 text-[#000] font-medium text-xs leading-[9px]`}
        >
          {artifact.author.username}
        </p>
      </motion.div>

      {/* Color Blur */}
      <motion.div
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute rounded-full left-[52px] w-[320px] h-[448px] -z-10 -rotate-1`}
      />
    </div>
  );
};

// {heartCount > 0 ||
// (artifact._count.replies > 0 && (
//     <div
//         className={`absolute -bottom-[25px] right-4 flex items-center gap-1 text-xs bg-white rounded-full p-[6px] font-medium shadow-shadowKitLow`}
//     >
//       <p className={`text-gray4 leading-[9px] text-red`}>
//         {heartCount}
//       </p>
//       {artifact._count.replies > 0 && (
//           <>
//             {heartCount > 0 && <div>&middot;</div>}
//             <p className={`text-gray4 leading-[9px] text-gray3`}>
//               {artifact._count.replies}
//             </p>
//           </>
//       )}
//     </div>
// ))}
