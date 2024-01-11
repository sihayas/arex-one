import React, { useMemo, useRef, useState } from "react";
import {
  Page,
  PageName,
  useInterfaceContext,
} from "@/context/InterfaceContext";
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
import Avatar from "@/components/global/Avatar";
import Replies from "@/components/interface/artifact/render/Replies";
import { ArtifactExtended } from "@/types/globalTypes";
import { GetDimensions } from "@/components/interface/Interface";

import Heart from "@/components/global/Heart";

import Image from "next/image";
import EntryDial from "@/components/global/EntryDial";

const rotateConfig = { damping: 20, stiffness: 100 };
const artworkConfig = {
  type: "spring",
  stiffness: 357,
  damping: 60,
  mass: 2,
};

export const Artifact = () => {
  const user = useUser();
  const { pages, scrollContainerRef, activePage, setActivePage } =
    useInterfaceContext();
  const { handleSelectSound } = useSound();

  const [hoverContent, setHoverContent] = useState(false);

  const { scrollY } = useScroll({ container: scrollContainerRef });

  const lastIsOpenRef = useRef<boolean | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isOpen = latest >= 1;
    if (isOpen !== lastIsOpenRef.current) {
      const updatedActivePage = {
        ...activePage,
        isOpen: isOpen,
      };
      pages[pages.length - 1].isOpen = false;
      setActivePage(updatedActivePage);
      lastIsOpenRef.current = isOpen;
    }
  });

  const variants = {
    initial: { translateX: -200, borderTopRightRadius: "16px" },
    hoverContent: {
      translateX: -200,
    },
    isOpen: {
      translateX: activePage.isOpen ? 0 : -200,
    },
  };

  const rotateCardKeyframes = useTransform(scrollY, [0, 1], [0, -3]);
  const rotateCard = useSpring(rotateCardKeyframes, rotateConfig);
  const yCardKeyframes = useTransform(scrollY, [0, 1], [0, 16]);
  const yCard = useSpring(yCardKeyframes, rotateConfig);
  const hideCardKeyframes = useTransform(scrollY, [0, 1], [1, 0]);
  const hideCard = useSpring(hideCardKeyframes, rotateConfig);
  const showChainsKeyframes = useTransform(scrollY, [0, 1], [0, 1]);
  const showChains = useSpring(showChainsKeyframes, rotateConfig);

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

  const sound = artifactExtended.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "720")
    .replace("{h}", "720");

  const handleSoundClick = async () => {
    handleSelectSound(sound);
  };

  const artifact = artifactExtended;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full mt-[1px] p-8 flex flex-col items-center"
    >
      {/* Content Inner / Card */}
      <motion.div
        style={{
          width: 464,
          height: 304,
          rotate: rotateCard,
          y: yCard,
        }}
        className={`flex flex-col pl-[104px] rounded-3xl rounded-l-2xl relative shadow-shadowKitHigh will-change-transform overflow-hidden bg-white outline outline-silver outline-1 `}
      >
        {/* Content Container */}
        <motion.div
          onHoverStart={() => setHoverContent(true)}
          onHoverEnd={() => setHoverContent(false)}
          className={`flex flex-col gap-[18px] overflow-scroll p-6 pt-4 pl-0 scrollbar-none`}
        >
          <div
            className={`pl-4 flex items-center gap-4 justify-between w-full`}
          >
            <EntryDial rating={artifact.content!.rating!} />

            <div className={`flex flex-col items-end`}>
              <div className={`text-sm text-gray2 line-clamp-1 leading-[13px]`}>
                {sound.attributes.artistName}
              </div>
              <div
                className={`font-medium text-base text-black line-clamp-1 leading-[23px]`}
              >
                {sound.attributes.name}
              </div>
            </div>
          </div>

          <div className={`text-base text-black pl-6`}>
            {artifact.content?.text}
          </div>

          <div
            className={`absolute bottom-6 right-6 flex items-center w-max gap-2`}
          >
            <p className={`text-base font-medium`}>
              {artifact.author.username}
            </p>
            <Avatar
              className={`border border-silver`}
              imageSrc={artifact.author.image}
              altText={`${artifact.author.username}'s avatar`}
              width={32}
              height={32}
              user={artifact.author}
            />
          </div>
        </motion.div>

        {/* Artwork */}
        <motion.div
          className="cursor-pointer absolute top-0 left-0 shadow-cartArtArtifact overflow-hidden rounded-2xl"
          variants={variants}
          animate={hoverContent ? "hoverContent" : "isOpen"}
          transition={artworkConfig}
          onClick={handleSoundClick}
        >
          <p
            className={`absolute top-6 right-6 text-white text-xl font-bold  `}
          >
            RX
          </p>
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

      <motion.div
        style={{ opacity: hideCard }}
        className={`absolute top-[360px] text-gray2 font-semibold text-sm uppercase`}
      >
        {artifactExtended._count.hearts} hearts &middot;{" "}
        {artifactExtended._count.replies} chains
      </motion.div>

      <motion.div
        style={{ opacity: showChains }}
        className={`flex flex-col p-8 relative`}
      >
        <Replies userId={user!.id} artifactId={artifactExtended.id} />
      </motion.div>
    </motion.div>
  );
};

export default Artifact;
