import { useFeedQuery } from "@/lib/api/feedAPI";
import { FeedEntry } from "@/components/feed/subcomponents/FeedEntry";
import { ActivityData } from "@/lib/global/interfaces";
import React, { Fragment } from "react";
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

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  return (
    <>
      {error && "an error has occurred"}
      {allActivities.map((activity: ActivityData, i) => (
        <Fragment key={activity.id}>
          {activity.review ? (
            <FeedEntry review={activity.review} />
          ) : (
            "No review available for this activity."
          )}
        </Fragment>
      ))}
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
