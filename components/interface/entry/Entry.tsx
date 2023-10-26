import React, { useMemo } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { RecordExtended } from "@/types/globalTypes";
import useHandleHeartClick from "@/hooks/useInteractions/useHandleHeart";
import { useHandleUserClick } from "@/hooks/useInteractions/useHandlePageChange";
import { Artwork } from "@/components/global/Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import HeartButton from "@/components/global/HeartButton";
import Stars from "@/components/global/Stars";
import { EntryBlobAlbum } from "@/components/icons";
import { useUser } from "@supabase/auth-helpers-react";
import RenderReplies from "@/components/interface/entry/sub/reply/RenderReplies";
import ReplyInput from "./sub/reply/ReplyInput";
import { useRepliesQuery } from "@/lib/apiHandlers/entryAPI";
import GradientBlur from "../album/sub/GradientBlur";

export const Entry = () => {
  const user = useUser();
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { setReplyParent } = useThreadcrumb();

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const activePage = pages[pages.length - 1];
  const record = useMemo(
    () => activePage.record as RecordExtended,
    [activePage]
  );

  const opacity = useTransform(scrollY, [0, 120], [0, 1]);

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    record.heartedByUser,
    record._count.hearts,
    "/api/record/entry/post/heart",
    "recordId",
    record.id,
    user?.id
  );

  const handleUserClick = useHandleUserClick(record.author);

  const recordId = activePage.record?.id;
  const {
    data: replies,
    isLoading,
    isError,
  } = useRepliesQuery(recordId, user!.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative"
    >
      {record && (
        <div>
          {/* EntryFull content starts here */}
          <div className="flex flex-col items-center pb-0 relative">
            <div className="relative">
              <Artwork
                className="!rounded-3xl !rounded-bl-none !rounded-br-none shadow-shadowKitLow outline outline-1 outline-silver"
                sound={record.appleAlbumData}
                width={480}
                height={480}
              />
            </div>

            <Stars
              className={`w-fit shadow-stars outline outline-silver outline-[.5px] pr-2 pl-8 rounded-br-2xl rounded-tr-2xl mr-auto -mt-[132px] z-10`}
              rating={record.entry!.rating}
              soundName={record.appleAlbumData.attributes.name}
              artist={record.appleAlbumData.attributes.artistName}
            />

            {/* Avatar & Name */}
            <div className="flex items-center gap-2 w-full z-10 drop-shadow px-12 pb-2 pt-4">
              <UserAvatar
                imageSrc={record.author.image}
                altText={`${record.author.username}'s avatar`}
                width={40}
                height={40}
                user={record.author}
              />
              <p className="text-white font-medium text-sm leading-[75%]">
                {record.author.username}
              </p>
            </div>

            <EntryBlobAlbum className={"pl-[44px] w-full z-10"} />
            <motion.div
              whileHover={{ color: "rgba(0,0,0,1)" }}
              onClick={() => setReplyParent(record)}
              className="flex flex-col gap-2"
            >
              <div className="flex flex-col w-[416px] bg-[#F4F4F4] rounded-[13px] relative px-4 pt-[11px] pb-[10px] gap-2 shadow-shadowKitHigh outline outline-[.5px] outline-silver">
                {/* Content*/}
                <div
                  className={`break-words w-full text-sm text-[#3C3C43]/60 leading-normal cursor-pointer`}
                >
                  {record.entry?.text}
                </div>

                <HeartButton
                  handleHeartClick={handleHeartClick}
                  hearted={hearted}
                  className="absolute -bottom-2 -right-2"
                  heartCount={heartCount}
                  replyCount={record._count.replies}
                />
              </div>
            </motion.div>
          </div>
          <div className="pt-8">
            <svg width="100%" height="2">
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="0"
                style={{ stroke: "rgba(0,0,0,.05)", strokeWidth: "2px" }}
                strokeDasharray="2, 2"
              />
            </svg>
          </div>

          <RenderReplies replies={replies} />
        </div>
      )}
      <motion.div style={{ opacity }}>
        <ReplyInput />
      </motion.div>
    </motion.div>
  );
};

export default Entry;
