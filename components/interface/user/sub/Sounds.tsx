import React, { useEffect, useRef } from "react";
import { useSoundsQuery } from "@/lib/apiHelper/user";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { Sound } from "@/components/interface/user/sub/components/Sound";
import { ArtifactExtended } from "@/types/globalTypes";

const Sounds = ({ userId }: { userId: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSoundsQuery(userId);

  const artifacts = data ? data.pages.flatMap((page) => page.data) : [];

  if (!data) return;

  return (
    <div
      ref={containerRef}
      className={`pl-[208px] absolute right-0 top-0 flex flex-col items-center w-full h-full overflow-y-auto snap-y snap-mandatory p-4 scrollbar-none`}
    >
      {artifacts.map((artifact, index) => {
        const artifactExtended = artifact as ArtifactExtended;
        return (
          <Sound
            artifact={artifactExtended}
            key={artifact.id}
            containerRef={containerRef}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default Sounds;
