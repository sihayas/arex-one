import React, { useEffect, useMemo, useState } from "react";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useUser } from "@supabase/auth-helpers-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useSound } from "@/hooks/usePage";
import useHandleHeartClick from "@/hooks/useHeart";
import Stars from "@/components/global/Stars";
import Avatar from "@/components/global/Avatar";
import RenderReplies from "@/components/interface/artifact/sub/RenderReplies";
import { ArtifactExtended } from "@/types/globalTypes";

import { createPortal } from "react-dom";
import Heart from "@/components/global/Heart";

import Image from "next/image";

const scaleEntryConfig = { damping: 20, stiffness: 160 };

export const Artifact = () => {
  const user = useUser();
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { setReplyParent } = useThreadcrumb();
  const { handleSelectSound } = useSound();

  const [isOpen, setIsOpen] = useState(false);
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const cmdkScroll = document.getElementById("cmdk-scroll") as HTMLDivElement;

  const activePage: Page = pages[pages.length - 1];

  const { scrollY } = useScroll({ container: scrollContainerRef });

  // Time transition
  useMotionValueEvent(scrollY, "change", async (latest) => {
    if (latest > 1) {
      setTimeout(() => {
        setIsOpen(true);
      }, 50);
    } else if (latest < 1) {
      setTimeout(() => {
        setIsOpen(false);
      }, 130);
    }
  });

  const scaleCardKeyframes = useTransform(scrollY, [0, 1], [1, 0.811]);
  const scaleCard = useSpring(scaleCardKeyframes, scaleEntryConfig);

  const rotateCardKeyframes = useTransform(scrollY, [0, 1], [0, -3]);
  const rotateCard = useSpring(rotateCardKeyframes, scaleEntryConfig);

  const yEntryConfig = !isOpen
    ? { damping: 20, stiffness: 122, delay: 50 } // Delay translate up for scale
    : { damping: 24, stiffness: 300 };

  const yEntryKeyframes = useTransform(scrollY, [0, 1], [0, -326]);
  const yEntry = useSpring(yEntryKeyframes, yEntryConfig);

  const opacityReplies = useTransform(scrollY, [0, 1], [0, 1]);

  const artifactExtended = useMemo(
    () => activePage.artifact as ArtifactExtended,
    [activePage],
  );

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    artifactExtended.heartedByUser,
    artifactExtended._count.hearts,
    "/api/heart/post/artifact",
    "artifactId",
    artifactExtended.id,
    artifactExtended.authorId,
    user?.id,
  );

  if (!artifactExtended) return null;

  const sound = artifactExtended.appleData;
  const color = sound.attributes.artwork.bgColor;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "1200")
    .replace("{h}", "1200");

  const handleSoundClick = async () => {
    handleSelectSound(sound);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full mt-[1px]"
    >
      <motion.div
        style={{ opacity: opacityReplies }}
        className={`flex flex-col p-8 pt-[256px] overflow-scroll scrollbar-none h-full relative`}
      >
        {user && (
          <RenderReplies userId={user.id} artifactId={artifactExtended.id} />
        )}
      </motion.div>

      {/* Top */}
      {createPortal(
        <motion.div
          style={{
            width: 416,
            height: 538,
            scale: scaleCard,
            rotate: rotateCard,
            y: yEntry,
          }}
          className={`absolute top-0 flex flex-col rounded-full shadow-shadowKitHigh will-change-transform cursor-pointer overflow-hidden
            ${!isOpen ? "opacity-100" : "opacity-0"}
            `}
        >
          <Heart
            handleHeartClick={handleHeartClick}
            hearted={hearted}
            className="absolute -top-7 -left-[7px]"
            heartCount={heartCount}
            replyCount={artifactExtended._count.replies}
          />
          <Image
            onClick={handleSoundClick}
            className={`absolute rounded-[32px]`}
            src={artwork}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            style={{ objectFit: "cover" }}
            fill={true}
          />

          {/* Stars */}
          <div
            className={`flex items-center mx-auto mt-6 p-2 pr-2.5 bg-white rounded-xl w-max max-w-[352px] max-h-8 z-10 gap-2 shadow-shadowKitMedium`}
          >
            <Stars rating={artifactExtended.content?.rating} />
            <div className={`text-base text-[#000] font-bold line-clamp-1`}>
              {sound.attributes.name}
            </div>
          </div>

          <div
            style={{
              background: `linear-gradient(to top, #${color}, rgba(0,0,0,0)`,
            }}
            className="absolute bottom-0 w-full h-[416px] pointer-events-none"
          />

          <div
            className={`z-10 p-8 pb-0 text-base text-white font-bold line-clamp-6 pointer-events-none mt-auto will-change-transform`}
          >
            {artifactExtended.content?.text}
          </div>

          <div className={`z-10 flex items-center gap-2 p-6 pt-2`}>
            <Avatar
              className="border border-gray3 min-w-[40px] min-h-[40px]"
              imageSrc={artifactExtended.author.image}
              altText={`${artifactExtended.author.username}'s avatar`}
              width={40}
              height={40}
              user={artifactExtended.author}
            />
            <p className="text-white font-bold text-base leading-[10px]">
              {artifactExtended.author.username}
            </p>
          </div>
        </motion.div>,
        cmdk,
      )}
      {/* Transition Clone (Mini) */}
      {createPortal(
        <motion.div
          style={{
            width: 416,
            height: 538,
            scale: scaleCard,
            rotate: rotateCard,
            y: yEntry,
          }}
          className={`absolute top-0 flex flex-col rounded-full will-change-transform pointer-events-none overflow-hidden`}
        >
          <Image
            className={`absolute rounded-full`}
            src={artwork}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            style={{ objectFit: "cover" }}
            fill={true}
          />

          {/* Stars */}
          <div
            className={`flex items-center mx-auto mt-6 p-2 pr-2.5 bg-white rounded-full w-max max-w-[272px] z-10 gap-2 shadow-shadowKitMedium`}
          >
            <Stars rating={artifactExtended.content?.rating} />
            <div className={`text-base text-[#000] leading-[9px] font-medium`}>
              {sound.attributes.name}
            </div>
          </div>

          <div
            style={{
              background: `linear-gradient(to top, #${color}, rgba(0,0,0,0)`,
            }}
            className="absolute bottom-0 w-full h-[416px] pointer-events-none"
          />

          <div
            className={`z-10 p-6 text-base text-white font-medium line-clamp-6 pointer-events-none mt-auto will-change-transform`}
          >
            {artifactExtended.content?.text}
          </div>

          <div className={`z-10 flex items-center gap-2 p-6 pt-2`}>
            <Avatar
              className="border border-gray3 min-w-[40px] min-h-[40px]"
              imageSrc={artifactExtended.author.image}
              altText={`${artifactExtended.author.username}'s avatar`}
              width={40}
              height={40}
              user={artifactExtended.author}
            />
            <p className="text-white font-bold text-base leading-[10px]">
              {artifactExtended.author.username}
            </p>
          </div>
        </motion.div>,
        cmdkScroll,
      )}
    </motion.div>
  );
};

export default Artifact;
