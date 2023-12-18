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
    <div className={`flex items-end gap-2.5 relative group w-[468px] group`}>
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
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className={`flex flex-col rounded-full bg-white relative w-[416px] h-[538px] shadow-shadowKitHigh will-change-transform overflow-hidden`}
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
          className={`absolute top-8 center-x flex items-center p-2 pr-2.5 bg-white rounded-xl w-max max-w-[320px] z-10 gap-2 shadow-shadowKitMedium max-h-8`}
        >
          <Stars rating={artifact.content?.rating} />
          <div className={`text-base text-[#000] font-bold line-clamp-1`}>
            {sound.attributes.name}
          </div>
        </div>

        <Image
          className={`cursor-pointer `}
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
          className="absolute bottom-0 w-full h-4/5 pointer-events-none"
        />
        <div
          className={`absolute px-8 text-base text-white font-medium line-clamp-6 bottom-[26px] pointer-events-none will-change-transform`}
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

      {/* Ambien */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute rounded-full left-[52px] w-[384px] h-[538px] -z-10`}
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
