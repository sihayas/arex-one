import React, { useMemo } from "react";
import {
  Page,
  PageName,
  useInterfaceContext,
} from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useUser } from "@supabase/auth-helpers-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useSound } from "@/hooks/usePage";
import useHandleHeartClick from "@/hooks/useHeart";
import Avatar from "@/components/global/Avatar";
import RenderReplies from "@/components/interface/artifact/sub/RenderReplies";
import { ArtifactExtended } from "@/types/globalTypes";
import { GetDimensions } from "@/components/interface/Interface";

import Heart from "@/components/global/Heart";

import Image from "next/image";
import ArtifactDial from "@/components/interface/artifact/sub/ArtifactDial";

const scaleEntryConfig = { damping: 20, stiffness: 160 };

export const Artifact = () => {
  const user = useUser();
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { handleSelectSound } = useSound();

  const activePage: Page = pages[pages.length - 1];
  const name = activePage.name as PageName;
  const maxHeight = GetDimensions(name).target.height - 488 - 32;

  const { scrollY } = useScroll({ container: scrollContainerRef });

  const scaleCardKeyframes = useTransform(scrollY, [0, 1], [0.867, 1]);
  const scaleCard = useSpring(scaleCardKeyframes, scaleEntryConfig);

  const xCardKeyframes = useTransform(scrollY, [0, 1], [-33, 0]);
  const xCard = useSpring(xCardKeyframes, scaleEntryConfig);

  const rotateCardKeyframes = useTransform(scrollY, [0, 1], [-2, 0]);
  const rotateCard = useSpring(rotateCardKeyframes, scaleEntryConfig);

  const artifactExtended = useMemo(
    () => activePage.artifact as ArtifactExtended,
    [activePage],
  );

  // const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
  //   artifactExtended.heartedByUser,
  //   artifactExtended._count.hearts,
  //   "/api/heart/post/artifact",
  //   "artifactId",
  //   artifactExtended.id,
  //   artifactExtended.authorId,
  //   user?.id,
  // );

  if (!artifactExtended) return null;

  const sound = artifactExtended.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "1200")
    .replace("{h}", "1200");

  console.log("Render Artifact");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full mt-[1px]"
    >
      <motion.div
        className={`w-full h-[576px] overflow-hidden relative -mb-[88px]`}
      >
        <Image
          className={`cursor-pointer`}
          src={artwork}
          alt={`artwork`}
          loading="lazy"
          quality={100}
          style={{ objectFit: "cover" }}
          fill={true}
        />
      </motion.div>

      {/* Card  */}
      <motion.div className={`p-8 py-0`}>
        <motion.div
          style={{
            x: xCard,
            scale: scaleCard,
            rotate: rotateCard,
            transformOrigin: "top",
            maxHeight: maxHeight,
            width: 480,
          }}
          className={`flex flex-col bg-white p-6 rounded-[20px] shadow-shadowKitHigh will-change-transform overflow-scroll relative scrollbar-none`}
        >
          {/* Top */}
          <div className={`flex items-center`}>
            <Avatar
              user={artifactExtended.author}
              imageSrc={artifactExtended.author.image}
              altText={artifactExtended.author.username}
              width={40}
              height={40}
              className={`border border-black`}
            />
            <div className="text-black font-semibold leading-[11px] text-base ml-3">
              {artifactExtended.author.username}
            </div>
            <ArtifactDial rating={artifactExtended.content!.rating!} />
          </div>
          {/* Bottom */}
          <motion.div className={`mt-2 text-gray2 text-base font-medium`}>
            {artifactExtended.content?.text}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className={`flex flex-col p-8 h-full relative`}>
        <RenderReplies userId={user!.id} artifactId={artifactExtended.id} />
      </motion.div>
    </motion.div>
  );
};

export default Artifact;
// <div
//     className={`pointer-events-none absolute top-8 left-0 w-full h-1/2 z-0`}
// >
{
  /*<div className={`w-full h-full relative`}>*/
}
{
  /*  <BlurDiv*/
}
{
  /*    zIndex={1}*/
}
{
  /*    blurValue={0.25}*/
}
{
  /*    gradientStops="rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 0) 37.5%"*/
}
{
  /*  />*/
}
{
  /*  <BlurDiv*/
}
{
  /*    zIndex={2}*/
}
{
  /*    blurValue={0.5}*/
}
{
  /*    gradientStops="rgba(0, 0, 0, 0) 12.5%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(0, 0, 0, 0) 50%"*/
}
{
  /*  />*/
}
{
  /*  <BlurDiv*/
}
{
  /*    zIndex={3}*/
}
{
  /*    blurValue={0.75}*/
}
{
  /*    gradientStops="rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 1) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 62.5%"*/
}
{
  /*  />*/
}
{
  /*  <BlurDiv*/
}
{
  /*    zIndex={4}*/
}
{
  /*    blurValue={1}*/
}
{
  /*    gradientStops="rgba(0, 0, 0, 0) 37.5%, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(0, 0, 0, 0) 75%"*/
}
{
  /*  />*/
}
{
  /*  <BlurDiv*/
}
{
  /*    zIndex={5}*/
}
{
  /*    blurValue={1.25}*/
}
{
  /*    gradientStops="rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 87.5%"*/
}
{
  /*  />*/
}
{
  /*  <BlurDiv*/
}
{
  /*    zIndex={6}*/
}
{
  /*    blurValue={1.5}*/
}
{
  /*    gradientStops="rgba(0, 0, 0, 0) 62.5%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 0) 100%"*/
}
{
  /*  />*/
}
{
  /*  <BlurDiv*/
}
{
  /*    zIndex={7}*/
}
{
  /*    blurValue={2}*/
}
{
  /*    gradientStops="rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 1) 87.5%, rgba(0, 0, 0, 1) 100%"*/
}
{
  /*  />*/
}
{
  /*  <BlurDiv*/
}
{
  /*    zIndex={8}*/
}
{
  /*    blurValue={2.5}*/
}
{
  /*    gradientStops="rgba(0, 0, 0, 0) 87.5%, rgba(0, 0, 0, 1) 100%"*/
}
{
  /*    className="bg-mauve-light-2 dark:bg-mauve-dark-2"*/
}
{
  /*  />*/
}
{
  /*</div>*/
}
// </div>
