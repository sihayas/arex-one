import React, { useEffect, useMemo } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useSound } from "@/hooks/usePage";
import useHandleHeartClick from "@/hooks/useHeart";
import Avatar from "@/components/global/Avatar";
import Replies from "@/components/interface/artifact/render/Replies";
import { ArtifactExtended } from "@/types/globalTypes";

import Image from "next/image";
import { getStarComponent } from "@/components/index/items/Entry";

const artworkConfig = {
  type: "spring",
  stiffness: 357,
  damping: 60,
  mass: 2,
};

export const Artifact = () => {
  const { activePage, scrollContainerRef, pages, user } = useInterfaceContext();
  const { handleSelectSound } = useSound();

  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    pages[pages.length - 1].isOpen = latest >= 1;
  });

  const borderRadius = useSpring(useTransform(scrollY, [0, 1], [0, 20]), {
    stiffness: 400,
    damping: 40,
  });

  const scale = useSpring(
    useTransform(scrollY, [0, 1], [1, 0.625]),
    artworkConfig,
  );

  const rotate = useSpring(
    useTransform(scrollY, [0, 1], [0, -3]),
    artworkConfig,
  );

  const x = useSpring(useTransform(scrollY, [0, 1], [0, 32]), artworkConfig);

  const y = useSpring(useTransform(scrollY, [0, 1], [0, 32]), artworkConfig);

  const artifactExtended = useMemo(
    () => activePage.artifact?.artifact as ArtifactExtended,
    [activePage],
  );

  const sound = artifactExtended.appleData;
  const artwork = MusicKit.formatArtworkURL(sound.attributes.artwork, 520, 520);

  const handleSoundClick = async () => {
    handleSelectSound(sound);
  };

  const artifact = artifactExtended;

  // Scroll to top on mount
  useEffect(() => {
    if (!activePage.isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, []);

  if (!user) return;

  return (
    <>
      <div className="flex">
        <motion.div
          style={{
            scale,
            rotate,
            borderRadius,
            x,
            y,
          }}
          className={`shadow-shadowKitHigh sticky top-0 h-fit min-w-fit origin-top-left cursor-pointer overflow-hidden`}
        >
          <Image
            onClick={handleSoundClick}
            src={artwork}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            width={256}
            height={256}
          />
        </motion.div>

        <div className={`flex flex-col pb-[100vh]`}>
          <div className={`flex w-full items-center p-8 pb-2`}>
            <div className="rounded-max outline-silver z-10 -ml-[50px] bg-white p-3 outline outline-1">
              {getStarComponent(artifact.content!.rating!)}
            </div>

            <div className={`ml-3 flex flex-col`}>
              <p className={`text-gray2 line-clamp-1 text-sm`}>
                {sound.attributes.artistName}
              </p>
              <p className={`line-clamp-1 text-base font-medium text-black`}>
                {sound.attributes.name}
              </p>
            </div>

            <div className={`ml-auto flex w-max items-center gap-2`}>
              <p className={`text-end text-base font-medium`}>
                {artifact.author.username}
              </p>
              <Avatar
                className={`border-silver border`}
                imageSrc={artifact.author.image}
                altText={`${artifact.author.username}'s avatar`}
                width={40}
                height={40}
                user={artifact.author}
              />
            </div>
          </div>
          <div className={`text-gray p-8 pt-0 text-base font-medium`}>
            {artifact.content?.text}
          </div>

          <div className={`-ml-8 min-h-full min-w-full pr-8`}>
            <Replies artifactId={artifact.id} userId={user.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Artifact;

// const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
//   artifactExtended.heartedByUser,
//   artifactExtended._count.hearts,
//   "/api/heart/post/artifact",
//   "artifactId",
//   artifactExtended.id,
//   artifactExtended.authorId,
//   user?.id,
// );
