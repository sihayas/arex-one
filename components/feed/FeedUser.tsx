import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchFeedAndMergeAlbums } from "@/lib/api/feedAPI";
import { FeedEntry } from "@/components/feed/subcomponents/FeedEntry";
import { ActivityData } from "@/lib/global/interfaces";
import React from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const FeedUser = ({
  userId,
  scrollContainerRef,
}: {
  userId?: string;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}) => {
  // Track scrolling for infinite scroll
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ["feed", userId],
      ({ pageParam = 1 }) => {
        if (!userId) {
          return Promise.reject(new Error("User ID is undefined"));
        }
        return fetchFeedAndMergeAlbums(userId, pageParam);
      },
      {
        getNextPageParam: (lastPage, pages) => pages.length,
        enabled: !!userId,
      },
    );

  useMotionValueEvent(scrollYProgress, "change", () => {
    const progress = scrollYProgress.get();

    if (progress > 0.9 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <>
      {error && "an error has occurred"}
      {data &&
        data.pages.map((page, i) =>
          page.map((activity: ActivityData, index: number) => (
            <>
              {activity.review ? (
                <FeedEntry review={activity.review} />
              ) : (
                "No review available for this activity."
              )}
            </>
          )),
        )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      )}
    </>
  );
};

export default FeedUser;
