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

const scaleArtConfig = { damping: 20, stiffness: 122 };
const borderConfig = { damping: 30, stiffness: 122 };
const yEntryConfig = { damping: 20, stiffness: 122 };
const scaleEntryConfig = { damping: 20, stiffness: 160 };

export const Artifact = () => {
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const user = useUser();
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { setReplyParent, setArtifact } = useThreadcrumb();
  const height = useRef(0);

  // Set max height for the artifact content based on the target height set in GetDimensions
  const activePage: Page = pages[pages.length - 1];
  const { target } = GetDimensions(activePage.name as PageName);
  const entryContentMax = target.height * 0.4;

  // Hook for artifact content animation
  const [scope, animate] = useAnimate();

  // *
  useLayoutEffect(() => {
    if (scope.current) height.current = scope.current.offsetHeight;
    activePage.dimensions.height = scope.current.offsetHeight;
  }, [activePage.dimensions, scope]);

  const { scrollY } = useScroll({ container: scrollContainerRef });

  const scaleArtKeyframes = useTransform(scrollY, [0, 1], [1, 0.2167]);
  const scaleArt = useSpring(scaleArtKeyframes, scaleArtConfig);

  const borderBLKeyframes = useTransform(scrollY, [0, 1], [0, 128]);
  const borderBLSpring = useSpring(borderBLKeyframes, borderConfig);

  const borderTLKeyframes = useTransform(scrollY, [0, 1], [32, 0]);
  const borderTLSpring = useSpring(borderTLKeyframes, borderConfig);

  const borderTRKeyframes = useTransform(scrollY, [0, 1], [0, 128]);
  const borderTRSpring = useSpring(borderTRKeyframes, borderConfig);

  const replyInputOpacity = useTransform(scrollY, [0, 1], [0, 1]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 1], [1, 0]);

  // Animate artifact height from whatever it is to 72px
  const newHeight = useTransform(scrollY, [0, 1], [height.current, 72]);
  const newWidth = useTransform(scrollY, [0, 1], [512, 344]);

  // Animate Y
  const yEntryKeyframes = useTransform(scrollY, [0, 1], [400, 16]);
  const yEntry = useSpring(yEntryKeyframes, yEntryConfig);

  const xEntryKeyframes = useTransform(scrollY, [0, 1], [0, -52]);
  const xEntry = useSpring(xEntryKeyframes, yEntryConfig);

  useEffect(() => {
    const shiftDimension = () => {
      animate(
        scope.current,
        { height: newHeight.get(), width: newWidth.get() },
        { type: "spring", stiffness: 160, damping: 20 },
      );
    };
    const unsubHeight = newHeight.on("change", () => shiftDimension());
    const unsubWidth = newWidth.on("change", () => shiftDimension());
    return () => {
      unsubHeight();
      unsubWidth();
    };
  }, [animate, newHeight, newWidth, scope]);

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
  const name = sound.attributes.name;
  const color = sound.attributes.artwork.bgColor;
  const url = ArtworkURL(sound.attributes.artwork.url, "1200");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-full relative"
    >
      <motion.div
        style={{ opacity: replyInputOpacity }}
        className={`flex flex-col p-8 pt-[104px] mt-[1px] overflow-scroll scrollbar-none h-full`}
      >
        {user && <RenderReplies userId={user.id} artifactId={artifact.id} />}
      </motion.div>

      <motion.div
        style={{
          scale: scaleArt,
          borderTopRightRadius: borderTRSpring,
          borderTopLeftRadius: borderTLSpring,
          borderBottomLeftRadius: borderBLSpring,
        }}
        className={`absolute top-0 right-0 origin-top-right overflow-hidden shadow-userAvi  `}
      >
        <Image
          src={url}
          alt={`${name}'s artwork`}
          width={512}
          height={512}
          quality={100}
        />
      </motion.div>

      {createPortal(
        <motion.div
          layout
          ref={scope}
          whileHover={{ color: "rgba(0,0,0,1)" }}
          onClick={() => setReplyParent({ artifact })}
          style={{
            maxHeight: entryContentMax,
            y: yEntry,
            x: xEntry,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={artifact.id}
          className={`absolute top-0 flex flex-col bg-[#F4F4F4] rounded-[24px] z-20`}
        >
          <div
            className={`flex items-center gap-2 relative min-w-[40px] min-h-[40px] drop-shadow-sm ml-4 mt-4`}
          >
            <Avatar
              className="border border-gray3 min-w-[40px] min-h-[40px]"
              imageSrc={artifact.author.image}
              altText={`${artifact.author.username}'s avatar`}
              width={40}
              height={40}
              user={artifact.author}
            />
            <p className="text-gray5 font-semibold text-sm leading-[10px]">
              {artifact.author.username}
            </p>

            {/* Star */}
            <div
              className={`flex items-center ml-auto mr-4 p-2 bg-white rounded-full w-max z-10 gap-2 shadow-shadowKitMedium`}
            >
              <div className={`text-xs text-[#000] leading-[9px] font-medium`}>
                {sound.attributes.name}
              </div>
              <Stars rating={artifact.content?.rating} />
            </div>
          </div>

          <div className="flex flex-col gap-[5px] w-full px-4 overflow-scroll scrollbar-none">
            <div
              className={`break-words w-full text-sm text-gray5 leading-normal cursor-pointer pt-[11px] pb-[10px]`}
            >
              {artifact.content?.text || artifact.content?.text}
            </div>
          </div>
          <motion.div style={{ opacity: scrollIndicatorOpacity }}>
            <Heart
              handleHeartClick={handleHeartClick}
              hearted={hearted}
              className="absolute bottom-4 right-4"
              heartCount={heartCount}
              replyCount={artifact._count.replies}
            />
          </motion.div>

          <motion.div
            style={{ opacity: scrollIndicatorOpacity }}
            className={`absolute -bottom-[25px] text-xs font-medium text-gray3 left-1/2 -translate-x-1/2 leading-[9px]`}
          >
            scroll for chains ({artifact._count.replies})
          </motion.div>
        </motion.div>,
        cmdk,
      )}
    </motion.div>
  );
};

export default Artifact;

// Upon mount, store the height of the artifact content into dimensions so
// GetDimensions can use it to calculate the base height for this specific
// Record as the Record page can vary depending on the length of the entry
