import { useRecentFeedQuery } from "@/lib/api/feed";
import { Feed } from "@/components/artifacts/Feed";
import { Activity } from "@/types/dbTypes";
import React, { Fragment } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { JellyComponent } from "@/components/global/Loading";
import { ArtifactExtended } from "@/types/globalTypes";

const Recent = ({
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
          {activity.artifact ? (
            <Feed artifact={activity.artifact as ArtifactExtended} />
          ) : activity.reply?.artifact ? (
            <Feed artifact={activity.reply.artifact as ArtifactExtended} />
          ) : activity.heart?.artifact ? (
            <Feed artifact={activity.heart.artifact as ArtifactExtended} />
          ) : (
            "No artifact available for this activity."
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

export default Recent;
