import React, { useEffect, useRef } from "react";
import { useEntriesQuery } from "@/lib/apiHelper/user";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { Entry } from "@/components/interface/user/items/Entry";
import { ArtifactExtended } from "@/types/globalTypes";

const Entries = ({ userId }: { userId: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEntriesQuery(userId);

  const activities = data ? data.pages.flatMap((page) => page.data) : [];

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

  return (
    <div className={`flex flex-wrap gap-4 p-8 `}>
      {activities.map((activity, index) => {
        if (!activity.artifact) return null;
        const artifact = activity.artifact as ArtifactExtended;
        return <Entry artifact={artifact} key={activity.id} index={index} />;
      })}
    </div>
  );
};

export default Entries;
