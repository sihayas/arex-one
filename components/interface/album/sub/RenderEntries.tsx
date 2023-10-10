import React from "react";
import { useReviewsQuery } from "@/lib/api/albumAPI";
import { EntryAlbum } from "./EntryAlbum";
import { Session } from "next-auth/core/types";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { JellyComponent } from "@/components/global/Loading";
import AnimatedCircle from "@/components/global/AnimatedCircle";

interface RenderEntriesProps {
  soundId: string;
  user: Session["user"];
  sortOrder: "newest" | "positive" | "negative";
}

const RenderEntries: React.FC<RenderEntriesProps> = ({
  soundId,
  user,
  sortOrder = "newest",
}) => {
  // Get entries & flatten
  const {
    data: entries,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReviewsQuery(soundId, user, sortOrder);

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
    <div className="flex flex-col h-albums min-w-full items-center p-8 pt-8 gap-9">
      {flattenedEntries?.length > 0 ? (
        flattenedEntries.map((entry) => (
          <EntryAlbum key={entry.id} review={entry} />
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
          <AnimatedCircle />
        </div>
      )}
    </div>
  );
};

export default RenderEntries;
