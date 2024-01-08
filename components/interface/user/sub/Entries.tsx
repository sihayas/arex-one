import React, { useEffect, useRef } from "react";
import { useEntriesQuery } from "@/lib/apiHelper/user";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { User } from "@/components/artifacts/User";
import { ArtifactExtended } from "@/types/globalTypes";

const Entries = ({ userId }: { userId: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEntriesQuery(userId);

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  useMotionValueEvent(scrollYProgress, "change", async () => {
    const progress = scrollYProgress.get();

    if (progress > 0.9 && hasNextPage && !isFetchingNextPage) {
      try {
        await fetchNextPage();
      } catch (error) {
        console.error("Error fetching next page:", error);
      } finally {
      }
    }
  });

  if (!data) return;

  return (
    <div
      ref={containerRef}
      className={`pl-[144px] absolute right-0 top-0 flex flex-wrap gap-8 w-full h-full overflow-y-auto snap-y snap-mandatory p-4 scrollbar-none`}
    >
      {allActivities.map((activity, index) => {
        if (!activity.artifact) return null;
        const artifact = activity.artifact as ArtifactExtended;
        return (
          <User
            artifact={artifact}
            key={activity.id}
            containerRef={containerRef}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default Entries;
