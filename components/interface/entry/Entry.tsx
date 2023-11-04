import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  Page,
  PageName,
  useInterfaceContext,
} from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { motion, useScroll, useTransform } from "framer-motion";
import { RecordExtended } from "@/types/globalTypes";
import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { Artwork } from "@/components/global/Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import HeartButton from "@/components/global/HeartButton";
import Stars from "@/components/global/Stars";
import { useUser } from "@supabase/auth-helpers-react";
import RenderReplies from "@/components/interface/entry/sub/reply/RenderReplies";
import ReplyInput from "./sub/reply/ReplyInput";
import { useRepliesQuery } from "@/lib/apiHandlers/entryAPI";
import { createPortal } from "react-dom";
import { GetDimensions } from "@/components/interface/Interface";

export const Entry = () => {
  const user = useUser();
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { setReplyParent, setRecord } = useThreadcrumb();

  // Entry content measurements
  const entryRef = useRef<HTMLDivElement>(null);

  // Set the max height of the entry content based on window target
  const activePage: Page = pages[pages.length - 1];
  const { target } = GetDimensions(activePage.name as PageName);
  const entryContentMax = target.height * 0.5;

  // Scroll animations
  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });
  const replyInputOpacity = useTransform(scrollY, [0, 64], [0, 1]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 64], [1, 0]);

  // React portal for entry content
  const cmdk = document.getElementById("cmdk") as HTMLDivElement;

  const record = useMemo(
    () => activePage.record as RecordExtended,
    [activePage],
  );

  // Heart button
  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    record.heartedByUser,
    record._count.hearts,
    "/api/record/entry/post/heart",
    "recordId",
    record.id,
    record.author.id,
    user?.id,
  );

  // Set record in threadcrumbs
  useEffect(() => {
    if (record) {
      setRecord(record);
    }
  }, [record, setRecord]);

  // Set height to adapt to content for GetDimensions in Interface.tsx
  useLayoutEffect(() => {
    if (entryRef.current) {
      activePage.dimensions.height = entryRef.current.offsetHeight + 5;
    }
  }, [activePage.dimensions]);

  const {
    data: replies,
    isLoading,
    isError,
  } = useRepliesQuery(activePage.record?.id, user!.id);

  if (!record) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative"
    >
      {/* EntryFull content starts here */}
      <div className="flex flex-col items-centerrelative">
        {/* Artwork */}
        <div className="relative pb-[100vh]">
          <Artwork
            className="!rounded-3xl !rounded-bl-none !rounded-br-none"
            sound={record.appleAlbumData}
            width={480}
            height={480}
          />
          <div
            style={{
              content: "",
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(transparent 50%, #FFFFFF 95%)",
            }}
          ></div>
        </div>

        {/* Portal Entry Content */}
        {createPortal(
          <motion.div
            ref={entryRef}
            whileHover={{ color: "rgba(0,0,0,1)" }}
            onClick={() => setReplyParent(record)}
            style={{ maxHeight: entryContentMax }}
            className={`absolute top-[396px] flex bg-[#F4F4F4] rounded-3xl w-[464px] gap-4 z-50 shadow-shadowKitHigh`}
          >
            {/* Author Avatar / Left Side*/}
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
                className={`bg-[#F4F4F4]/80 absolute -top-[24px] left-[40px] rounded-full backdrop-blur-xl p-[6px] w-max z-10`}
                rating={record.entry!.rating}
              />
              <div
                className={`bg-[#F4F4F4]/80 w-1 h-1 absolute top-1 left-[44px] rounded-full`}
              />
              <div
                className={`bg-[#F4F4F4]/80 w-2 h-2 absolute -top-1 left-[48px] rounded-full`}
              />
            </div>

            {/* Right Side / Name & Content */}
            <div className="flex flex-col gap-[5px] w-full pt-6 pr-4 pb-[10px] overflow-scroll scrollbar-none">
              <p className="text-gray5 font-semibold text-xs leading-[1]">
                {record.author.username}
              </p>
              {/* Content*/}
              <div
                className={`break-words w-full text-sm text-gray5 leading-normal cursor-pointer`}
              >
                {record.entry?.text}
              </div>
            </div>

            <HeartButton
              handleHeartClick={handleHeartClick}
              hearted={hearted}
              className="absolute bottom-0 right-0"
              heartCount={heartCount}
              replyCount={record._count.replies}
            />
          </motion.div>,
          cmdk,
        )}
      </div>

      <RenderReplies replies={replies} />
      <motion.div style={{ opacity: replyInputOpacity }}>
        <ReplyInput />
      </motion.div>
    </motion.div>
  );
};

export default Entry;
