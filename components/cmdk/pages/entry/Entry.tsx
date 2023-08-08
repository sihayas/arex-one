import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosResponse } from "axios";
import { ReviewData } from "../../../../lib/interfaces";
import { UserAvatar, ReplyInput } from "../../generics";
import { RenderReplies } from "./subcomponents/RenderReplies";
import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useQuery } from "@tanstack/react-query";
import { useThreadcrumb } from "@/context/Threadcrumbs";
import { EntryFull } from "./subcomponents/EntryFull";
import useFetchArtworkUrl from "@/hooks/useFetchArtworkUrl";
import { animated, SpringValue } from "@react-spring/web";

export const Entry = () => {
  const { data: session } = useSession();
  // Context
  const { activePage } = useCMDK();
  const { setReplyParent, threadcrumbs, setThreadcrumbs } = useThreadcrumb();

  const firstThreadcrumb = activePage.threadcrumbs?.[0];

  // If reviewId changes [first item in threadcrumbs], re-render Entry
  useEffect(() => {
    if (activePage.threadcrumbs && firstThreadcrumb) {
      setThreadcrumbs(activePage.threadcrumbs);
    }
  }, [activePage.threadcrumbs, firstThreadcrumb, setThreadcrumbs]);

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
        `/api/review/getById?id=${reviewId}&userId=${session?.user?.id || ""}`
      );
      return response.data;
    },
    {
      enabled: !!reviewId, // <- only fetch if reviewId is truthy
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (review) {
      setReplyParent(review);
    }
  }, [review, setReplyParent]);

  // If review album is different from selected album, fetch artwork
  const { artworkUrl, isLoading: isArtworkLoading } = useFetchArtworkUrl(
    review?.albumId,
    "1032"
  );

  if (!review || !artworkUrl) return null;

  return (
    <>
      <EntryFull review={review} artworkUrl={artworkUrl} />

      {/* Replies  */}
      {/* <RenderReplies threadcrumbs={threadcrumbs} /> */}

      {/* Reply Input  */}
      {/* <div className="w-[470px] fixed bottom-8 left-8 flex items-center gap-2 bg-blurEntry backdrop-blur-sm p-1 rounded-full shadow-sm z-20 border border-silver">
        <UserAvatar
          className="border-2 border-white rounded-full"
          imageSrc={review.author?.image}
          altText={`${review.author?.name}'s avatar`}
          width={28}
          height={28}
        />
        <ReplyInput />
      </div> */}
    </>
  );
};

export default Entry;
