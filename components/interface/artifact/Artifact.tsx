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
import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { Artwork } from "@/components/global/Artwork";
import Stars from "@/components/global/Stars";
import Avatar from "@/components/global/Avatar";
import RenderReplies from "@/components/interface/artifact/sub/reply/RenderReplies";
import { useRepliesQuery } from "@/lib/apiHandlers/artifactAPI";
import { GetDimensions } from "@/components/interface/Interface";
import { ArtifactExtended } from "@/types/globalTypes";
import { createPortal } from "react-dom";
import Heart from "@/components/global/Heart";

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

  const { data: replies } = useRepliesQuery(activePage.artifact?.id, user!.id);

  // Hook for artifact content animation
  const [scope, animate] = useAnimate();

  // Upon mount, store the height of the artifact content into dimensions so
  // GetDimensions can use it to calculate the base height for this specific
  // Record as the Record page can vary depending on the length of the entry
  useLayoutEffect(() => {
    if (scope.current) height.current = scope.current.offsetHeight;
    activePage.dimensions.height = scope.current.offsetHeight + 5;
  }, [activePage.dimensions, scope]);

  // Scroll tracker hook
  const { scrollY } = useScroll({ container: scrollContainerRef });

  // Animate opacity
  const replyInputOpacity = useTransform(scrollY, [0, 24], [0, 1]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 24], [1, 0]);

  // Animate artifact height from whatever it is to 72px
  const newHeight = useTransform(scrollY, [0, 24], [height.current, 72]);

  // Animate scale
  const newScale = useTransform(scrollY, [0, 24], [1, 0.861]);
  const springScale = useSpring(newScale, { stiffness: 160, damping: 20 });

  // Animate Y
  const y = useTransform(scrollY, [0, 24], [396, 10]);
  const springY = useSpring(y, { stiffness: 160, damping: 20 });

  useEffect(() => {
    const shiftDimension = () => {
      animate(
        scope.current,
        { height: newHeight.get() },
        { type: "spring", stiffness: 160, damping: 20 },
      );
    };
    const unsubHeight = newHeight.on("change", () => shiftDimension());
    return () => unsubHeight();
  }, [animate, newHeight, scope]);

  const artifact = useMemo(
    () => activePage.artifact as ArtifactExtended,
    [activePage],
  );

  const isWisp = artifact.type === "wisp";

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    artifact.heartedByUser,
    artifact._count.hearts,
    "/api/artifact/entry/post/heart",
    "artifactId",
    artifact.id,
    artifact.authorId,
    user?.id,
  );

  useEffect(() => {
    if (artifact) setArtifact(artifact);
  }, [artifact, setArtifact]);
  if (!artifact) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative"
    >
      <div className="flex flex-col items-center relative">
        <Artwork
          className="!rounded-3xl !rounded-bl-none !rounded-br-none"
          sound={artifact.appleData}
          width={480}
          height={480}
          bgColor={artifact.appleData.attributes.artwork.bgColor}
        />

        {createPortal(
          <motion.div
            ref={scope}
            whileHover={{ color: "rgba(0,0,0,1)" }}
            onClick={() => setReplyParent({ artifact })}
            style={{
              maxHeight: entryContentMax,
              scale: springScale,
              y: springY,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={artifact.id}
            className={`absolute top-0 flex flex-col bg-[#F4F4F4] rounded-[24px] w-[464px] z-20 shadow-shadowKitHigh`}
          >
            <div
              className={`flex items-center gap-2 relative min-w-[40px] min-h-[40px] drop-shadow-sm ml-4 mt-4`}
            >
              <Stars
                className={`bg-[#E5E5E5] absolute -top-[28px] left-[36px] p-[6px] rounded-full backdrop-blur-xl w-max z-10 text-gray5 max-h-[24px]`}
                rating={artifact.content?.rating}
                soundName={artifact.appleData.attributes.name}
                artist={artifact.appleData.attributes.artistName}
                isWisp={isWisp}
              />
              <div
                className={`bg-[#E5E5E5] w-1 h-1 absolute top-0 left-[40px] rounded-full`}
              />
              <div
                className={`bg-[#E5E5E5] w-2 h-2 absolute -top-2 left-[44px] rounded-full`}
              />
              <Avatar
                className="border border-gray3 min-w-[40px] min-h-[40px]"
                imageSrc={artifact.author.image}
                altText={`${artifact.author.username}'s avatar`}
                width={40}
                height={40}
                user={artifact.author}
              />
              <p className="text-gray5 font-semibold text-sm leading-[1]">
                {artifact.author.username}
              </p>
            </div>

            <div className="flex flex-col gap-[5px] w-full px-4 pb-[10px] pt-[11px] overflow-scroll scrollbar-none">
              <div
                className={`break-words w-full text-sm text-gray5 leading-normal cursor-pointer`}
              >
                {artifact.content?.text || artifact.content?.text}
              </div>
            </div>
            <Heart
              handleHeartClick={handleHeartClick}
              hearted={hearted}
              className="absolute bottom-4 right-4"
              heartCount={heartCount}
              replyCount={artifact._count.replies}
            />
            <motion.div
              style={{ opacity: scrollIndicatorOpacity }}
              className={`absolute -bottom-[25px] text-xs font-medium text-gray3 left-1/2 -translate-x-1/2 leading-[1]`}
            >
              SCROLL TO SHOW CHAINS
            </motion.div>
          </motion.div>,
          cmdk,
        )}
      </div>
      <motion.div
        style={{ height: target.height, opacity: replyInputOpacity }}
        className={`flex flex-col gap-4 p-8 pt-[88px] overflow-scroll`}
      >
        <RenderReplies replies={replies} />
      </motion.div>
    </motion.div>
  );
};

export default Artifact;
