import React, { useState } from "react";
import { ReplyIcon } from "../../../../icons";
import { useSession } from "next-auth/react";
import { LikeButton, generateArtworkUrl } from "../../../generics";
import { ReviewData } from "@/lib/interfaces";
import { useCMDK } from "@/context/CMDKContext";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { Stars } from "../../../generics";
import { getAlbumById } from "@/lib/musicKit";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useDominantColor } from "@/hooks/useDominantColor";
import useHandleLikeClick from "@/hooks/useLike";
import { useHandleEntryClick } from "@/hooks/useHandleEntryClick";

interface EntryPreviewProfileProps {
  review: ReviewData;
}

const fetchArtworkUrl = async (albumId: string) => {
  const albumData = await getAlbumById(albumId);
  const artworkUrl = generateArtworkUrl(
    albumData.attributes.artwork.url,
    "480"
  );

  return artworkUrl;
};

export const EntryPreviewProfile: React.FC<EntryPreviewProfileProps> = ({
  review,
}) => {
  const [dominantColor, setDominantColor] = useState("");
  const { getDominantColor } = useDominantColor();

  const { data: session } = useSession();
  const { setPages, bounce } = useCMDK();
  const { selectedAlbum } = useCMDKAlbum();
  const { setThreadcrumbs } = useThreadcrumb();

  const replyCount = review.replies.length;

  const { liked, likeCount, handleLikeClick } = useHandleLikeClick(
    review.likedByUser,
    review.likes,
    "/api/review/postLike",
    "reviewId",
    review.id,
    session
  );

  const handleEntryClick = useHandleEntryClick(review.id);

  // If review album is different from selected album, fetch artwork
  const { data: artworkUrl, isLoading: isArtworkLoading } = useQuery(
    ["albumArtworkUrl", review?.albumId],
    () => fetchArtworkUrl(review?.albumId),
    {
      enabled: !!review?.albumId && selectedAlbum?.id !== review?.albumId,
    }
  );

  return (
    <div className="flex flex-col gap-2 w-[484px] overflow-visible pb-8 z-10">
      <Image
        className="rounded-[16px]"
        src={artworkUrl || selectedAlbum?.artworkUrl || "/images/default.webp"}
        alt={`${selectedAlbum?.attributes.name} artwork`}
        width={240}
        height={240}
        onDragStart={(e) => e.preventDefault()}
        onLoad={(event) =>
          setDominantColor(getDominantColor(event.target as HTMLImageElement))
        }
        style={{
          boxShadow: `0px 0px 0px 0px ${dominantColor}, 0.15), 0px 2px 4px 0px ${dominantColor}, 0.15), 0px 7px 7px 0px ${dominantColor}, 0.13), 0px 16px 10px 0px ${dominantColor}, 0.07), 0px 29px 12px 0px ${dominantColor}, 0.02), 0px 45px 13px 0px ${dominantColor}, 0.00)`,
        }}
      />
      {/* Review Content  */}
      <div className="flex relative">
        <div
          onClick={handleEntryClick}
          className={`w-full text-[13px] leading-normal px-4 py-2 bg-white text-black shadow-entry border border-silver rounded-2xl rounded-bl-[4px] break-words overflow-visible cursor-pointer transition-all duration-300 hover:scale-[102%] z-20`}
        >
          {review.content}
        </div>
        <div className="absolute z-0 -left-5 -top-5">
          <Stars rating={review.rating} />
        </div>

        {/* Reply Count & Like Count */}
        <div className="absolute flex  gap-2 -right-3 -bottom-6 z-30">
          {/* Reply Count  */}
          <div className="flex mt-1.5 items-center gap-1 px-1 py-[2px] rounded-full max-h-4 bg-white border border-silver">
            <ReplyIcon width={8} height={8} color={"#999"} />
            <div className="text-[10px] text-gray2">{replyCount}</div>
          </div>

          {/* Like Count  */}
          <div className="flex flex-col items-center">
            <LikeButton handleLikeClick={handleLikeClick} liked={liked} />
            <div className=" text-[10px] text-gray2">{likeCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
