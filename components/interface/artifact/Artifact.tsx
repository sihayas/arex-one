import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  Page,
  PageName,
  useInterfaceContext,
} from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useUser } from "@supabase/auth-helpers-react";
import {
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import useHandleHeartClick from "@/hooks/useHeart";
import { Artwork } from "@/components/global/Artwork";
import Stars from "@/components/global/Stars";
import Avatar from "@/components/global/Avatar";
import RenderReplies from "@/components/interface/artifact/sub/RenderReplies";
import { GetDimensions } from "@/components/interface/Interface";
import { ArtifactExtended } from "@/types/globalTypes";
import { createPortal } from "react-dom";
import Heart from "@/components/global/Heart";
import ArtworkURL from "@/components/global/ArtworkURL";
import Image from "next/image";

const scaleEntryConfig = { damping: 20, stiffness: 160 };

export const Artifact = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const cmdkScroll = document.getElementById("cmdk-scroll") as HTMLDivElement;
  const user = useUser();
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { setArtifact } = useThreadcrumb();

  const activePage: Page = pages[pages.length - 1];

  const { scrollY } = useScroll({ container: scrollContainerRef });

  // Time transition
  useMotionValueEvent(scrollY, "change", async (latest) => {
    if (latest > 1) {
      setTimeout(() => {
        setIsOpen(true);
      }, 130);
    } else if (latest < 1) {
      setTimeout(() => {
        setIsOpen(false);
      }, 70);
    }
  });

  const scaleCardKeyframes = useTransform(scrollY, [0, 1], [1, 0.811]);
  const scaleCard = useSpring(scaleCardKeyframes, scaleEntryConfig);

  const rotateCardKeyframes = useTransform(scrollY, [0, 1], [0, -3]);
  const rotateCard = useSpring(rotateCardKeyframes, scaleEntryConfig);

  const yEntryConfig = !isOpen
    ? { damping: 20, stiffness: 122, delay: 50 } // Delay translate up for scale
    : { damping: 20, stiffness: 300 };

  const yEntryKeyframes = useTransform(scrollY, [0, 1], [0, -326]);
  const yEntry = useSpring(yEntryKeyframes, yEntryConfig);

  const opacityReplies = useTransform(scrollY, [0, 1], [0, 1]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 1], [1, 0]);

  const artifact = useMemo(
    () => activePage.artifact as ArtifactExtended,
    [activePage],
  );

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    artifact.heartedByUser,
    artifact._count.hearts,
    "/api/heart/post/artifact",
    "artifactId",
    artifact.id,
    artifact.authorId,
    user?.id,
  );

  useEffect(() => {
    if (artifact) setArtifact(artifact);
  }, [artifact, setArtifact]);

  if (!artifact) return null;

  const sound = artifact.appleData;
  const color = sound.attributes.artwork.bgColor;
  const url = ArtworkURL(sound.attributes.artwork.url, "1200");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full relative mt-[1px]"
    >
      <div
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute -top-[268px] left-16 w-[352px] h-[493px] z-10 blur-3xl -rotate-3`}
      />
      <div
        style={{
          background: `linear-gradient(to bottom, #FFF, rgba(0,0,0,0) z-0`,
        }}
        className="absolute top-0 left-0 w-full h-[288px] pointer-events-none"
      />
      <motion.div
        style={{ opacity: opacityReplies }}
        className={`flex flex-col p-8 pt-[256px] overflow-scroll scrollbar-none h-full relative`}
      >
        {user && <RenderReplies userId={user.id} artifactId={artifact.id} />}
      </motion.div>

      {/* Top */}
      {createPortal(
        <motion.div
          style={{
            width: 434,
            height: 608,
            scale: scaleCard,
            rotate: rotateCard,
            y: yEntry,
          }}
          className={`absolute top-0 flex flex-col rounded-[32px] shadow-shadowKitHigh will-change-transform z-20 pointer-events-none
            ${!isOpen ? "opacity-100" : "opacity-0"}
            `}
        >
          <Image
            className={`absolute rounded-[32px]`}
            src={url}
            alt={`artwork`}
            loading="lazy"
            quality={100}
            style={{ objectFit: "cover" }}
            fill={true}
          />

          {/* Stars */}
          <div
            className={`flex items-center mx-auto mt-6 p-2 pr-2.5 bg-white rounded-full w-max max-w-[272px] max-h-8 z-10 gap-2 shadow-shadowKitMedium`}
          >
            <Stars rating={artifact.content?.rating} />
            <div className={`text-xs text-[#000] leading-[9px] font-medium`}>
              {sound.attributes.name}
            </div>
            <div className={`-ml-1`}>&middot;</div>
            <div
              className={`-ml-1 text-xs text-[#000] leading-[9px] font-medium`}
            >
              {sound.attributes.artistName}
            </div>
          </div>

          <div
            style={{
              background: `linear-gradient(to top, #${color}, rgba(0,0,0,0)`,
            }}
            className="absolute bottom-0 w-full h-[416px] rounded-b-[32px] pointer-events-none"
          />

          <div
            className={`z-10 p-6 text-sm text-white font-medium line-clamp-6 pointer-events-none mt-auto will-change-transform`}
          >
            {artifact.content?.text}
          </div>

          <div className={`z-10 flex items-center gap-2 p-6 pt-2`}>
            <Avatar
              className="border border-gray3 min-w-[40px] min-h-[40px]"
              imageSrc={artifact.author.image}
              altText={`${artifact.author.username}'s avatar`}
              width={40}
              height={40}
              user={artifact.author}
            />
            <p className="text-white font-bold text-sm leading-[10px]">
              {artifact.author.username}
            </p>
          </div>
        </motion.div>,
        cmdk,
      )}
      {/* Transition Clone (Mini) */}
      {createPortal(
        <motion.div
          style={{
            width: 434,
            height: 608,
            scale: scaleCard,
            rotate: rotateCard,
            y: yEntry,
          }}
          className={`absolute top-0 flex flex-col rounded-[32px] shadow-shadowKitHigh will-change-transform z-20 pointer-events-none`}
        >
          <Image
            className={`absolute rounded-[32px]`}
            src={url}
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
            <Stars rating={artifact.content?.rating} />
            <div className={`text-xs text-[#000] leading-[9px] font-medium`}>
              {sound.attributes.name}
            </div>
            <div className={`-ml-1`}>&middot;</div>
            <div
              className={`-ml-1 text-xs text-[#000] leading-[9px] font-medium`}
            >
              {sound.attributes.artistName}
            </div>
          </div>

          <div
            style={{
              background: `linear-gradient(to top, #${color}, rgba(0,0,0,0)`,
            }}
            className="absolute bottom-0 w-full h-[416px] rounded-b-[32px] pointer-events-none"
          />

          <div
            className={`z-10 p-6 text-sm text-white font-medium line-clamp-6 pointer-events-none mt-auto will-change-transform`}
          >
            {artifact.content?.text}
          </div>

          <div className={`z-10 flex items-center gap-2 p-6 pt-2`}>
            <Avatar
              className="border border-gray3 min-w-[40px] min-h-[40px]"
              imageSrc={artifact.author.image}
              altText={`${artifact.author.username}'s avatar`}
              width={40}
              height={40}
              user={artifact.author}
            />
            <p className="text-white font-bold text-sm leading-[10px]">
              {artifact.author.username}
            </p>
          </div>
        </motion.div>,
        cmdkScroll,
      )}
    </motion.div>
  );
};

export default Artifact;
