import React, { useMemo } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { RecordExtended } from "@/types/globalTypes";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";
import { useHandleUserClick } from "@/hooks/useInteractions/useHandlePageChange";
import { Artwork } from "@/components/global/Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";
import { EntryBlobAlbum } from "@/components/icons";
import { useUser } from "@supabase/auth-helpers-react";
import RenderReplies from "@/components/interface/entry/sub/reply/RenderReplies";
import ReplyInput from "./sub/reply/ReplyInput";
import { useRepliesQuery } from "@/lib/apiHandlers/entryAPI";

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

  const { liked, handleLikeClick, likeCount } = useHandleLikeClick(
    record.likedByUser,
    record._count.likes,
    "/api/record/entry/post/like",
    "reviewId",
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
          <div className="flex flex-col items-center p-8 pb-0 relative">
            <div className="relative">
              <Artwork
                className="!rounded-[13px] shadow-shadowKitLow outline outline-1 outline-silver"
                sound={record.appleAlbumData}
                width={224}
                height={224}
              />
              <Stars
                className={`absolute top-[184px] w-fit -left-8 shadow-stars outline outline-silver outline-[.5px] pr-2 pl-8 rounded-br-2xl rounded-tr-2xl`}
                rating={record.entry!.rating}
                soundName={record.appleAlbumData.attributes.name}
                artist={record.appleAlbumData.attributes.artistName}
              />

              {/* Avatar & Name */}
              <div className="flex items-center justify-end gap-2 w-full mb-2 -mt-4 pr-4">
                <p className="text-gray4 font-medium text-sm leading-[75%]">
                  {record.author.username}
                </p>
                <UserAvatar
                  className="outline outline-2 outline-silver "
                  imageSrc={record.author.image}
                  altText={`${record.author.username}'s avatar`}
                  width={40}
                  height={40}
                  user={record.author}
                />
              </div>

              {/* <EntryBlobAlbum className={"ml-3 w-full"} /> */}
              <motion.div
                whileHover={{ color: "rgba(0,0,0,1)" }}
                onClick={() => setReplyParent(record)}
                className="flex flex-col gap-2 pt-1"
              >
                <div className="flex flex-col w-[416px] bg-[#F4F4F4] rounded-[13px] relative px-4 pt-[11px] pb-[10px] gap-2 outline-silver outline outline-2">
                  {/* Content*/}
                  <div
                    className={`break-words w-full text-sm text-[#3C3C43]/60 leading-normal cursor-pointer`}
                  >
                    {record.entry?.text}
                  </div>

                  <LikeButton
                    handleLikeClick={handleLikeClick}
                    liked={liked}
                    className="absolute -bottom-2 -right-2"
                    likeCount={likeCount}
                    replyCount={record._count.replies}
                  />
                </div>
              </motion.div>
            </div>
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
