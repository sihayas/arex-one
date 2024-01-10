import React from "react";
import { useWispsQuery } from "@/lib/apiHelper/user";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { ArtifactExtended } from "@/types/globalTypes";
import { Wisp } from "@/components/interface/user/items/Wisp";

const Wisps = ({ userId }: { userId: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWispsQuery(userId);

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

  const activities = data ? data.pages.flatMap((page) => page.data) : [];

  return (
    <div
      ref={containerRef}
      className={`pl-[144px] gap-8 absolute left-0 top-0 flex flex-wrap w-full h-full overflow-y-auto snap-y snap-mandatory p-4 pt-8 scrollbar-none`}
    >
      {activities.map((activity, index) => {
        if (!activity.artifact) return null;
        const artifact = activity.artifact as ArtifactExtended;
        return <Wisp artifact={artifact} key={artifact.id} />;
      })}
    </div>
  );
};

export default Wisps;
