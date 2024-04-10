import React from "react";
import { useEntriesQuery } from "@/lib/helper/interface/user";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { Entry } from "@/components/interface/user/items/Entry";
import { EntryExtended } from "@/types/globalTypes";
import { useInterfaceContext } from "@/context/Interface";

const Entries = ({ pageUserId }: { pageUserId: string }) => {
  const { scrollContainerRef, user } = useInterfaceContext();

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEntriesQuery(user?.id, pageUserId);

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

  return activities.map((activity, index) => {
    return (
      <Entry
        entry={activity.entry as EntryExtended}
        key={activity.id}
        index={index}
      />
    );
  });
};

export default Entries;
