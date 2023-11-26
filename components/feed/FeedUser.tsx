import { useFeedQuery } from "@/lib/apiHandlers/feedAPI";
import { FeedRecord } from "@/components/records/RecordFeed";
import { Activity, Record } from "@/types/dbTypes";
import React, { Fragment } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { JellyComponent } from "@/components/global/Loading";
import { RecordExtended } from "@/types/globalTypes";

const FeedUser = ({
  userId,
  scrollContainerRef,
}: {
  userId: string;
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
      fetchNextPage().catch((error) => {
        console.error("Error fetching next page:", error);
      });
    }
  });

  const records = data ? data.pages.flatMap((page) => page.data) : [];
  console.log("records", records);

  return (
    <>
      {error && "an error has occurred"}
      {records.map((record: Record, i) => (
        <Fragment key={record.id}>
          <FeedRecord
            record={record as RecordExtended}
            associatedType={record?.album ? "album" : "track"}
          />
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

export default FeedUser;
