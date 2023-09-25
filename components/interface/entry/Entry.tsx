import { useSession } from "next-auth/react";

import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";

import Replies from "@/components/interface/entry/sub/reply/Replies";
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

  const review = activePage.review;

  // If review album is different from selected album, fetch artwork
  const { artworkUrl, isLoading: isArtworkLoading } = useFetchArtworkUrl(
    review?.albumId,
    "726",
    "albumId",
  );

  return (
    <div className="w-full h-full">
      {review && artworkUrl ? (
        <>
          <motion.div
            style={{
              scale: springScale,
              willChange: "transform",
            }}
          >
            <EntryFull review={review} />
          </motion.div>
          <div className="p-8 flex flex-wrap gap-4">
            <Replies />
          </div>
        </>
      ) : null}
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
