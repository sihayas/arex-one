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
    <div className={`flex items-end gap-2.5 relative group w-[608px]`}>
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

      {/* Content Inner / Card */}
      <motion.div
        onClick={handleEntryClick}
        initial={{ rotate: -1 }}
        whileHover={{ scale: 0.95, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 13 }}
        className={`flex flex-col rounded-[32px] bg-white relative w-[320px] h-[448px] shadow-shadowKitHigh will-change-transform`}
      >
        {/* Stars */}
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
            className={`-ml-1 text-xs text-[#000] leading-[9px] font-medium line-clamp-1`}
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
        <div
          style={{
            background: `linear-gradient(to top, #${color}, rgba(0,0,0,0)`,
          }}
          className="absolute bottom-0 w-full h-2/5 rounded-b-[32px] pointer-events-none"
        />
        <div
          className={`absolute px-6 text-sm text-white font-medium line-clamp-5 bottom-[18px] pointer-events-none`}
        >
          {artifact.content?.text}
        </div>
      </motion.div>

      {/* Color Blur */}
      <div
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute left-[222px] w-[320px] h-[448px] -z-10 -rotate-1`}
      />
    </div>
  );
};
// <Heart
//     handleHeartClick={handleHeartClick}
//     hearted={hearted}
//     className="absolute -bottom-1 -right-1"
//     heartCount={heartCount}
//     replyCount={artifact._count.replies}
// />
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
