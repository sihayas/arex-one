import React, { useEffect } from "react";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { RecordExtended } from "@/types/globalTypes";
import useHandleLikeClick from "@/hooks/useInteractions/useHandleLike";
import { Artwork } from "@/components/feed/subcomponents/Artwork";
import UserAvatar from "@/components/global/UserAvatar";
import LikeButton from "@/components/global/LikeButton";
import Stars from "@/components/global/Stars";
import { EntryBlobAlbum } from "@/components/icons";
import { useUser } from "@supabase/auth-helpers-react";
import RenderReplies from "@/components/interface/entry/sub/reply/RenderReplies";
import ReplyInput from "./sub/reply/ReplyInput";

export const Entry = () => {
  const { pages, scrollContainerRef } = useInterfaceContext();
  const { setReplyParent } = useThreadcrumb();
  const user = useUser();

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const scale = useTransform(scrollY, [0, 12], [0.93, 1]);
  const springScale = useSpring(scale, { damping: 20, stiffness: 200 });

  const activePage = pages[pages.length - 1];
  const record = activePage.record as RecordExtended;

  useEffect(() => {
    if (record) {
      setReplyParent(record);
      console.log("set reply parent to record");
    }
  }, [record, setReplyParent]);

  const { liked, handleLikeClick, likeCount } = useHandleLikeClick(
    record.likedByUser,
    record._count.likes,
    "/api/record/entry/post/like",
    "reviewId",
    record.id,
    user?.id
  );

  return (
    <div className="w-full h-full relative">
      {record ? (
        <motion.div
          style={{
            willChange: "transform",
          }}
        >
          {/* EntryFull content starts here */}
          <div className="flex flex-col items-center p-8 relative ">
            <div className="relative">
              <Artwork
                className="!rounded-[16px]"
                sound={record.appleAlbumData}
                width={480}
                height={480}
              />
              <Stars
                className={`absolute top-[291px] w-fit -left-8 shadow-stars outline outline-silver outline-[.5px] pr-2 pl-8 rounded-br-2xl rounded-tr-2xl`}
                rating={record.entry!.rating}
                soundName={record.appleAlbumData.attributes.name}
                artist={record.appleAlbumData.attributes.artistName}
              />

              {/* Avatar & Name */}
              <div className="flex items-center gap-2 w-full -mt-[85px] ml-4 mb-2">
                <UserAvatar
                  className="outline outline-[1.5px] outline-white "
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

              <EntryBlobAlbum className={"ml-3 w-full"} />
              <div className="flex flex-col gap-2">
                <div className="flex flex-col w-[416px] bg-[#F4F4F4] rounded-[13px] relative px-4 pt-[11px] pb-[10px] gap-2 shadow-sm">
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
              </div>
            </div>
          </div>
          {/* EntryFull content ends here */}
          <RenderReplies />
          <ReplyInput />
        </motion.div>
      ) : null}
    </div>
  );
};

export default Entry;
