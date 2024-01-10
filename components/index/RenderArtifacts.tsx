import { useFeedQuery } from "@/lib/apiHelper/feed";
import { Activity } from "@/types/dbTypes";
import React, { Fragment } from "react";
import { AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { ArtifactExtended } from "@/types/globalTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { Entry } from "@/components/index/Entry";
import { Wisp } from "@/components/index/Wisp";

const RenderArtifacts = ({
  userId,
  scrollContainerRef,
  type,
}: {
  userId: string;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  type: string;
}) => {
  const { setIsLoading } = useInterfaceContext();

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedQuery(userId, type);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  useMotionValueEvent(scrollYProgress, "change", async () => {
    const progress = scrollYProgress.get();

    if (progress > 0.9 && hasNextPage && !isFetchingNextPage) {
      try {
        setIsLoading(true);
        await fetchNextPage();
      } catch (error) {
        console.error("Error fetching next page:", error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  return (
    <>
      {allActivities.map((activity: Activity) => (
        <Fragment key={activity.id}>
          {activity.artifact && activity.artifact.type === "entry" ? (
            <Entry artifact={activity.artifact as ArtifactExtended} />
          ) : activity.artifact && activity.artifact.type === "wisp" ? (
            <Wisp artifact={activity.artifact as ArtifactExtended} />
          ) : (
            "No artifact available for this activity."
          )}
        </Fragment>
      ))}
    </>
  );
};

export default RenderArtifacts;

// {allActivities.map((activity: Activity, i) => (
//     <Fragment key={activity.id}>
//       {activity.artifact ? (
//           <Feed artifact={activity.artifact as ArtifactExtended} />
//       ) : activity.reply?.artifact ? (
//           <Feed artifact={activity.reply.artifact as ArtifactExtended} />
//       ) : activity.heart?.artifact ? (
//           <Feed artifact={activity.heart.artifact as ArtifactExtended} />
//       ) : (
//           "No artifact available for this activity."
//       )}
//     </Fragment>
// ))}
