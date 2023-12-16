import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact } from "@/hooks/usePage";

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

export const User: React.FC<NewAProps> = ({ artifact }) => {
  const user = useUser();

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

  if (!sound) return null;

  return (
    <motion.div
      onClick={handleEntryClick}
      className={`flex flex-col rounded-3xl relative w-[256px] min-h-[359px] will-change-transform overflow-hidden snap-center`}
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
        className={`absolute top-6 center-x flex items-center p-2 pr-2.5 bg-white rounded-xl w-max max-w-[320px] z-10 gap-2 shadow-shadowKitMedium max-h-8`}
      >
        <Stars rating={artifact.content?.rating} />
        <div className={`text-sm text-[#000] font-bold line-clamp-1`}>
          {sound.attributes.name}
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
      />
      {/* Gradient */}
      <div
        style={{
          background: `linear-gradient(to top, #${color}, rgba(0,0,0,0)`,
        }}
        className="absolute bottom-0 w-full h-4/5 pointer-events-none"
      />
      <div
        className={`absolute px-6 text-sm text-white font-medium line-clamp-6 bottom-[18px] pointer-events-none will-change-transform`}
      >
        {artifact.content?.text}
      </div>
    </motion.div>
  );
};
