import React, { useEffect, useRef } from "react";
import { useSoundtrackQuery } from "@/lib/apiHelper/user";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { User } from "@/components/artifacts/User";
import { ArtifactExtended } from "@/types/globalTypes";

const Soundtrack = ({ userId }: { userId: string }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSoundtrackQuery(userId);

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  if (!data) return;
  return (
    <div
      ref={containerRef}
      className={`absolute right-0 top-0 flex flex-col items-center w-[352px] h-[608px] overflow-y-auto snap-y snap-mandatory p-4 scrollbar-none `}
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

export default Soundtrack;
