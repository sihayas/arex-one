import React from "react";
import { useReviewsQuery } from "@/lib/api/albumAPI";
import { EntryAlbum } from "./EntryAlbum";
import { Session } from "next-auth/core/types";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { JellyComponent } from "@/components/global/Loading";

interface AlbumsProps {
  albumId: string;
  user: Session["user"];
}

const Albums: React.FC<AlbumsProps> = ({ albumId, user }) => {
  const sortOrder = "newest";
  const reviewsQuery = useReviewsQuery(albumId, user, sortOrder);
  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = reviewsQuery;

  const { scrollContainerRef } = useInterfaceContext();

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  useMotionValueEvent(scrollYProgress, "change", () => {
    const progress = scrollYProgress.get();

    if (progress > 0.9 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch((error) => {
        console.error("Error fetching next page:", error);
      });
    }
  });

  const flattenedReviews = reviewsData?.pages.flat() || [];

  return (
    // Gap-5 to align with statistics
    <div className="flex flex-col h-albums min-w-full items-center p-8 pt-8 gap-9">
      {flattenedReviews?.length > 0 ? (
        flattenedReviews.map((review) => (
          <EntryAlbum key={review.id} review={review} />
        ))
      ) : (
        <div className="p-2 text-xs uppercase text-gray2">
          {/* surrender the sound */}
        </div>
      )}
      {hasNextPage ? (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? (
            <JellyComponent
              className={"fixed left-[247px] bottom-8"}
              key="jelly"
              isVisible={isFetchingNextPage}
            />
          ) : (
            "more"
          )}
        </button>
      ) : (
        <div className="text-xs text-action uppercase tracking-widest">
          end of line
        </div>
      )}
    </div>
  );
};

export default Albums;
