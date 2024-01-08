import React from "react";
import { useWispsQuery } from "@/lib/apiHelper/user";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { ArtifactExtended } from "@/types/globalTypes";
import { Wisp } from "@/components/interface/user/sub/components/Wisp";

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

  const wisps = data ? data.pages.flatMap((page) => page.data) : [];

  if (!data) return;

  return (
    <div
      ref={containerRef}
      className={`pl-[144px] gap-8 absolute left-0 top-0 flex flex-wrap w-full h-full overflow-y-auto snap-y snap-mandatory p-4 pt-8 scrollbar-none`}
    >
      {wisps.map((artifact, index) => {
        const artifactExtended = artifact as ArtifactExtended;
        return <Wisp artifact={artifactExtended} key={artifact.id} />;
      })}
    </div>
  );
};

export default Wisps;
