// Importing all necessary libraries and components
import React, { useEffect, useLayoutEffect, useMemo } from "react";
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
import HeartButton from "@/components/global/HeartButton";
import Stars from "@/components/global/Stars";
import UserAvatar from "@/components/global/UserAvatar";
import RenderReplies from "@/components/interface/record/sub/reply/RenderReplies";
import ReplyInput from "@/components/interface/record/sub/reply/ReplyInput";
import { useRepliesQuery } from "@/lib/apiHandlers/entryAPI";
import { GetDimensions } from "@/components/interface/Interface";
import { RecordExtended } from "@/types/globalTypes";
import { createPortal } from "react-dom";

export const RecordFace = () => {
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;
  const user = useUser();
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { setReplyParent, setRecord } = useThreadcrumb();

  // Set max height for the record content based on the target height set in GetDimensions
  const activePage: Page = pages[pages.length - 1];
  const { target } = GetDimensions(activePage.name as PageName);
  const entryContentMax = target.height * 0.4;

  // Hook for record content animation
  const [scope, animate] = useAnimate();

  // Upon mount, store the height of the record content into dimensions so
  // GetDimensions can use it to calculate the base height for this  page
  useLayoutEffect(() => {
    if (scope.current)
      activePage.dimensions.height = scope.current.offsetHeight + 5;
  }, [activePage.dimensions, scope]);

  // Scroll tracker hook
  const { scrollY } = useScroll({ container: scrollContainerRef });

  // Animate opacity
  const replyInputOpacity = useTransform(scrollY, [0, 64], [0, 1]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 64], [1, 0]);

  // Animate record height from whatever it is to 72px
  const newHeight = useTransform(
    scrollY,
    [0, 64],
    [scope.current?.offsetHeight, 72],
  );

  // Animate scale
  const newScale = useTransform(scrollY, [0, 64], [1, 0.861]);
  const springScale = useSpring(newScale, { stiffness: 160, damping: 20 });

  // Animate Y
  const y = useTransform(scrollY, [0, 64], [396, 10]);
  const springY = useSpring(y, { stiffness: 160, damping: 20 });

  useEffect(() => {
    const shiftDimension = (dimension: string, newDimension: any) => {
      animate(
        scope.current,
        { [dimension]: newDimension.get() },
        { type: "spring", stiffness: 160, damping: 20 },
      );
    };
    const unsubHeight = newHeight.on("change", () =>
      shiftDimension("height", newHeight),
    );
    return () => unsubHeight();
  }, [animate, newHeight, scope]);

  const { data: replies } = useRepliesQuery(activePage.record?.id, user!.id);

  const record = useMemo(
    () => activePage.record as RecordExtended,
    [activePage],
  );

  const isCaption = record.caption ? true : false;

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    record.heartedByUser,
    record._count.hearts,
    "/api/record/record/post/heart",
    "recordId",
    record.id,
    record.author.id,
    user?.id,
  );

  useEffect(() => {
    if (record) setRecord(record);
  }, [record, setRecord]);
  if (!record) return null;

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
          sound={record.appleAlbumData}
          width={480}
          height={480}
        />

        {createPortal(
          <motion.div
            ref={scope}
            whileHover={{ color: "rgba(0,0,0,1)" }}
            onClick={() => setReplyParent(record)}
            style={{
              maxHeight: entryContentMax,
              scale: springScale,
              y: springY,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={record.id}
            className={`absolute top-0 flex bg-[#F4F4F4] rounded-3xl w-[464px] gap-4 z-50 shadow-shadowKitHigh`}
          >
            <div
              className={`relative min-w-[40px] min-h-[40px] drop-shadow-sm ml-4 mt-4 flex flex-col`}
            >
              <UserAvatar
                className="border border-gray3 min-w-[40px] min-h-[40px]"
                imageSrc={record.author.image}
                altText={`${record.author.username}'s avatar`}
                width={40}
                height={40}
                user={record.author}
              />
              <Stars
                className={`bg-[#E5E5E5] absolute -top-[28px] left-[36px] rounded-full backdrop-blur-xl p-[6px] w-max z-10 text-gray5`}
                rating={record.entry?.rating}
                soundName={record.appleAlbumData.attributes.name}
                artist={record.appleAlbumData.attributes.artistName}
                isCaption={isCaption}
              />
              <div
                className={`bg-[#E5E5E5] w-1 h-1 absolute top-0 left-[40px] rounded-full`}
              />
              <div
                className={`bg-[#E5E5E5] w-2 h-2 absolute -top-2 left-[44px] rounded-full`}
              />
            </div>
            <div className="flex flex-col gap-[5px] w-full pt-6 pr-4 pb-[10px] overflow-scroll scrollbar-none">
              <p className="text-gray5 font-semibold text-xs leading-[1]">
                {record.author.username}
              </p>
              <div
                className={`break-words w-full text-sm text-gray5 leading-normal cursor-pointer`}
              >
                {record.entry?.text || record.caption?.text}
              </div>
            </div>
            {/*<HeartButton*/}
            {/*  handleHeartClick={handleHeartClick}*/}
            {/*  hearted={hearted}*/}
            {/*  className="absolute bottom-0 right-0"*/}
            {/*  heartCount={heartCount}*/}
            {/*  replyCount={record._count.replies}*/}
            {/*/>*/}
            <motion.div
              style={{ opacity: scrollIndicatorOpacity }}
              className={`absolute -bottom-[25px] text-xs font-medium text-gray3 left-1/2 -translate-x-1/2 leading-[1]`}
            >
              SCROLL HERE TO SHOW CHAINS
            </motion.div>
          </motion.div>,
          cmdk,
        )}
      </div>
      {replies && replies.length > 0 && (
        <div
          style={{ height: target.height }}
          className={`flex flex-wrap p-8 pt-[88px] overflow-scroll`}
        >
          <RenderReplies replies={replies} />
        </div>
      )}
      <motion.div style={{ opacity: replyInputOpacity }}>
        <ReplyInput />
      </motion.div>
    </motion.div>
  );
};

export default RecordFace;
