import React from "react";
import { useEntriesQuery } from "@/lib/helper/user";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { Entry } from "@/components/interface/user/items/Entry";
import { ArtifactExtended } from "@/types/globalTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";

const Entries = ({ userId }: { userId: string }) => {
  const { scrollContainerRef } = useInterfaceContext();

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEntriesQuery(userId);

  const activities = data ? data.pages.flatMap((page) => page.data) : [];

  useMotionValueEvent(scrollYProgress, "change", async () => {
    const progress = scrollYProgress.get();

    if (progress > 0.75 && hasNextPage && !isFetchingNextPage) {
      try {
        await fetchNextPage();
      } catch (error) {
        console.error("Error fetching next page:", error);
      } finally {
      }
    }
  });

  return (
    <div className={`z-0 flex w-full flex-col -space-y-4 p-10 -mt-[242px]`}>
      {activities.map((activity, index) => {
        if (!activity.artifact) return null;
        const artifact = activity.artifact as ArtifactExtended;
        return <Entry artifact={artifact} key={activity.id} index={index} />;
      })}
    </div>
  );
};

export default Entries;
