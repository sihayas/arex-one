import React, { Fragment } from "react";
import { useArtifactsQuery } from "@/lib/apiHelper/album";
import Album from "@/components/artifacts/Album";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { AlbumData } from "@/types/appleTypes";
import { Activity } from "@/types/dbTypes";
import { ArtifactExtended } from "@/types/globalTypes";

interface RenderArtifactsProps {
  soundId: string;
  sortOrder: "newest" | "highlights" | "positive" | "critical";
}

const RenderArtifacts: React.FC<RenderArtifactsProps> = ({
  soundId,
  sortOrder = "newest",
}) => {
  const { user } = useInterfaceContext();
  const userId = user?.id;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useArtifactsQuery(soundId, userId, sortOrder);

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  // Initialize infinite scroll
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

  return (
    // Gap-5 to align with statistics
    <div className="flex flex-col h-full w-full items-center p-8 gap-9 overflow-scroll">
      {allActivities.map((activity: Activity) => (
        <Fragment key={activity.id}>
          {activity.artifact ? (
            <Album artifact={activity.artifact as ArtifactExtended} />
          ) : (
            "No artifact available for this activity."
          )}
        </Fragment>
      ))}
      {/* End */}
      {hasNextPage ? (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "loading" : "more"}
        </button>
      ) : (
        <div className="flex justify-center items-center">
          <svg width="100%" height="2">
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="10"
                height="2"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="rgb(255,94,0)" />
              </pattern>
            </defs>
            <rect width="100%" height="2" fill="url(#dots)" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default RenderArtifacts;
