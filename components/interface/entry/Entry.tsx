import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

import { useThreadcrumb } from "@/context/Threadcrumbs";
import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";

import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

import { ReviewData } from "@/lib/global/interfaces";
import RenderReplies from "./sub/reply/RenderReplies";
import { Page, useInterfaceContext } from "@/context/InterfaceContext";
import { EntryFull } from "@/components/interface/entry/sub/EntryFull";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export const Entry = () => {
  const { data: session } = useSession();
  const { pages, scrollContainerRef } = useInterfaceContext();

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const scale = useTransform(scrollY, [0, 12], [0.867, 1]);
  const springScale = useSpring(scale, { damping: 20, stiffness: 200 });

  const activePage: Page = pages[pages.length - 1];

  // Context
  const { setReplyParent, threadcrumbs, setThreadcrumbs } = useThreadcrumb();

  const review = activePage.review;

  // Set default reply parent
  useEffect(() => {
    if (review) {
      setReplyParent(review);
    }
  }, [review, setReplyParent]);

  // If review album is different from selected album, fetch artwork
  const { artworkUrl, isLoading: isArtworkLoading } = useFetchArtworkUrl(
    review?.albumId,
    "726",
    "albumId",
  );

  if (!review || !artworkUrl) return null;

  return (
    <div className="w-full h-full">
      <motion.div style={{ scale: springScale, willChange: "transform" }}>
        <EntryFull review={review} />
      </motion.div>
      <RenderReplies threadcrumbs={threadcrumbs} />
    </div>
  );
};

export default Entry;

// const reviewId = activePage.review?.id;
//
// // Get review data
// const {
//   data: review,
//   error,
//   isLoading,
// } = useQuery(
//   ["review", reviewId, session?.user.id],
//   async () => {
//     const response: AxiosResponse<ReviewData> = await axios.get(
//       `/api/review/get/byId?id=${reviewId}&userId=${session?.user.id}`,
//     );
//     return response.data;
//   },
//   {
//     enabled: !!reviewId,
//   },
// );
