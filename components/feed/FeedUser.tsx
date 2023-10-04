import { useFeedQuery } from "@/lib/api/feedAPI";
import { FeedEntry } from "@/components/feed/subcomponents/FeedEntry";
import { ActivityData } from "@/lib/global/interfaces";
import React from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { JellyComponent } from "@/components/global/Loading";

const FeedUser = ({
  userId,
  scrollContainerRef,
}: {
  userId?: string;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}) => {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedQuery(userId);
  // Track scrolling for infinite scroll
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

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
          page.map((activity: ActivityData) => (
            <>
              {activity.review ? (
                <FeedEntry key={activity.review.id} review={activity.review} />
              ) : (
                "No review available for this activity."
              )}
            </>
          )),
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
        <div className="text-xs text-action">end of line</div>
      )}
    </>
  );
};

export default FeedUser;
