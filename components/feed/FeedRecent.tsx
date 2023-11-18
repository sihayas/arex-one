import { useRecentFeedQuery } from "@/lib/apiHandlers/feedAPI";
import { FeedRecord } from "@/components/records/RecordFeed";
import { Activity } from "@/types/dbTypes";
import React, { Fragment } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { JellyComponent } from "@/components/global/Loading";
import { RecordExtended } from "@/types/globalTypes";

const FeedRecent = ({
  userId,
  scrollContainerRef,
}: {
  userId: string;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}) => {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRecentFeedQuery(userId);

  // Track scrolling for infinite scroll
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

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  console.log(allActivities);
  return (
    <>
      {error && "an error has occurred"}
      {allActivities.map((activity: Activity, i) => (
        <Fragment key={activity.id}>
          {activity.record ? (
            <FeedRecord
              record={activity.record as RecordExtended}
              associatedType={activity.record.album ? "album" : "track"}
            />
          ) : activity.reply?.record ? (
            <FeedRecord
              record={activity.reply.record as RecordExtended}
              associatedType={activity.reply.record.album ? "album" : "track"}
            />
          ) : activity.heart?.record ? (
            <FeedRecord
              record={activity.heart.record as RecordExtended}
              associatedType={activity.heart.record.album ? "album" : "track"}
            />
          ) : (
            "No record available for this activity."
          )}
        </Fragment>
      ))}
      {/* Pagination */}
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

export default FeedRecent;
