import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { useInterface } from "@/context/Interface";
import { useSound } from "@/context/Sound";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { useScrollPosition } from "@/hooks/handleInteractions/useScrollPosition";

import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { SpringValue } from "@react-spring/web";

import { EntryFull } from "./sub/EntryFull";
import { ReviewData } from "../../../../lib/global/interfaces";
import { ArrowIcon } from "@/components/icons";
import RenderReplies from "./sub/reply/RenderReplies";

interface EntryProps {
  translateY: SpringValue<number>;
}

export const Entry = ({ translateY }: EntryProps) => {
  const { data: session } = useSession();
  // Context
  const { activePage } = useInterface();
  const {
    setReplyParent,
    threadcrumbs,
    setThreadcrumbs,
    openThreads,
    setOpenThreads,
  } = useThreadcrumb();

  const { scrollContainerRef } = useScrollPosition();

  const firstThreadcrumb = activePage.threadcrumbs?.[0];

  const reviewId = threadcrumbs ? threadcrumbs[0] : null;

  // Get review data
  const {
    data: review,
    error,
    isLoading,
  } = useQuery(
    ["review", reviewId, session?.user?.id],
    async () => {
      const response: AxiosResponse<ReviewData> = await axios.get(
        `/api/review/get/byId?id=${reviewId}&userId=${session?.user?.id || ""}`
      );
      return response.data;
    },
    {
      enabled: !!reviewId,
    }
  );

  // Set default reply parent
  useEffect(() => {
    if (review) {
      setReplyParent(review);
    }
  }, [review, setReplyParent]);

  // If reviewId changes [first item in threadcrumbs], re-render Entry
  useEffect(() => {
    if (activePage.threadcrumbs && firstThreadcrumb) {
      setThreadcrumbs(activePage.threadcrumbs);
    }
  }, [activePage.threadcrumbs, firstThreadcrumb, setThreadcrumbs]);

  // If review album is different from selected album, fetch artwork
  const { artworkUrl, isLoading: isArtworkLoading } = useFetchArtworkUrl(
    review?.albumId,
    "726",
    "albumId"
  );

  const handleOpenThreadsClick = () => {
    setOpenThreads((prev) => !prev);
  };

  if (!review || !artworkUrl) return null;

  return (
    <>
      <EntryFull review={review} artworkUrl={artworkUrl} />
      <div
        onClick={handleOpenThreadsClick}
        className="fixed flex flex-col items-center left-1/2 transform -translate-x-1/2 bottom-0 cursor-pointer z-10"
      >
        <div className="text-gray2 font-medium text-xs">
          {review._count.replies} CHAINS
        </div>
        <ArrowIcon
          className=" rotate-[90deg]"
          width={24}
          height={24}
          color={"#ccc"}
        />
      </div>

      {openThreads && <RenderReplies threadcrumbs={threadcrumbs} />}
    </>
  );
};

export default Entry;
