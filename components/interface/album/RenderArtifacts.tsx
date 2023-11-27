import React from "react";
import { useReviewsQuery } from "@/lib/apiHandlers/albumAPI";
import ArtifactAlbum from "@/components/records/ArtifactAlbum";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { JellyComponent } from "@/components/global/Loading";

interface RenderArtifactsProps {
  soundId: string;
  sortOrder: "newest" | "positive" | "negative";
}

const RenderArtifacts: React.FC<RenderArtifactsProps> = ({
  soundId,
  sortOrder = "newest",
}) => {
  const { user } = useInterfaceContext();

  // Get bloomingActivities & flatten
  const {
    data: entries,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReviewsQuery(soundId, user!, sortOrder);

  const flattenedEntries = entries?.pages.flat() || [];

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
    <div className="flex flex-col h-full w-full items-center p-8 gap-9">
      {flattenedEntries?.length > 0 ? (
        flattenedEntries.map((entry) => (
          <ArtifactAlbum key={entry.id} artifact={entry} />
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
