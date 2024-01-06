import React from "react";

import useHandleHeartClick from "@/hooks/useHeart";
import { useArtifact, useSound } from "@/hooks/usePage";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import { useUser } from "@supabase/auth-helpers-react";
import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
import Image from "next/image";
import EntryDial from "@/components/global/EntryDial";
import { BlurDiv } from "@/components/global/Blur";

interface NewAProps {
  artifact: ArtifactExtended;
}

export const Entry: React.FC<NewAProps> = ({ artifact }) => {
  const user = useUser();
  const { handleSelectSound } = useSound();

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "1148")
    .replace("{h}", "1148");
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
    handleSelectSound(sound);
  };

  if (!sound) return null;

  return (
    <div className={`flex items-end gap-2.5 relative group w-[388px] group`}>
      <Avatar
        className={`h-[42px] border border-silver`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={42}
        height={42}
        user={artifact.author}
      />
      {/* Stars */}
      <Heart
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className="absolute -top-[28px] left-[46px]"
        heartCount={heartCount}
        replyCount={artifact._count.replies}
      />
      {/* Content Inner / Card */}
      <motion.div
        onClick={handleEntryClick}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        style={{
          width: 288,
          height: 368,
        }}
        className={`flex flex-col rounded-full relative shadow-shadowKitHigh will-change-transform overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 z-10 p-2`}>
          {/*<EntryDial rating={artifact.content!.rating!} />*/}
          <div
            className={`font-semibold text-xs text-gray3 left-8 top-8 absolute w-max`}
          >
            {/*{artifact.content!.rating}*/}
            RX ENTRY
          </div>
        </div>

        <Image
          className={`cursor-pointer `}
          src={artwork}
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
          className="absolute bottom-0 w-full h-full pointer-events-none"
        />
        <div
          className={`absolute px-8 text-base text-white font-bold line-clamp-4 bottom-[26px] pointer-events-none will-change-transform`}
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
        className={`absolute left-[52px] w-[288px] h-[368px] -z-10`}
      />
    </div>
  );
};

{
  /*<div*/
}
{
  /*  className={`pointer-events-none absolute bottom-0 left-0 w-full h-1/2 z-0`}*/
}
{
  /*>*/
}
{
  /*  <div className={`w-full h-full relative`}>*/
}
{
  /*    <BlurDiv*/
}
{
  /*      zIndex={1}*/
}
{
  /*      blurValue={0.25}*/
}
{
  /*      gradientStops="rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 0) 37.5%"*/
}
{
  /*    />*/
}
{
  /*    <BlurDiv*/
}
{
  /*      zIndex={2}*/
}
{
  /*      blurValue={0.5}*/
}
{
  /*      gradientStops="rgba(0, 0, 0, 0) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(0, 0, 0, 0) 50%"*/
}
{
  /*    />*/
}
{
  /*    <BlurDiv*/
}
{
  /*      zIndex={3}*/
}
{
  /*      blurValue={0.75}*/
}
{
  /*      gradientStops="rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 62.5%"*/
}
{
  /*    />*/
}
{
  /*    <BlurDiv*/
}
{
  /*      zIndex={4}*/
}
{
  /*      blurValue={1}*/
}
{
  /*      gradientStops="rgba(0, 0, 0, 0) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(0, 0, 0, 0) 75%"*/
}
{
  /*    />*/
}
{
  /*    <BlurDiv*/
}
{
  /*      zIndex={5}*/
}
{
  /*      blurValue={1.25}*/
}
{
  /*      gradientStops="rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 87.5%"*/
}
{
  /*    />*/
}
{
  /*    <BlurDiv*/
}
{
  /*      zIndex={6}*/
}
{
  /*      blurValue={1.5}*/
}
{
  /*      gradientStops="rgba(0, 0, 0, 0) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 0) 100%"*/
}
{
  /*    />*/
}
{
  /*    <BlurDiv*/
}
{
  /*      zIndex={7}*/
}
{
  /*      blurValue={2}*/
}
{
  /*      gradientStops="rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 1) 100%"*/
}
{
  /*    />*/
}
{
  /*    <BlurDiv*/
}
{
  /*      zIndex={8}*/
}
{
  /*      blurValue={2.5}*/
}
{
  /*      gradientStops="rgba(0, 0, 0, 0) 87.5%, rgba(0, 0, 0, 1) 100%"*/
}
{
  /*      className="bg-mauve-light-2 dark:bg-mauve-dark-2"*/
}
{
  /*    />*/
}
{
  /*  </div>*/
}
{
  /*</div>*/
}
