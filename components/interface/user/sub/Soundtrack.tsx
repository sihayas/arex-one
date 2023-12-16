import React, { useEffect, useRef } from "react";
import { useSoundtrackQuery } from "@/lib/apiHelper/user";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useInterfaceContext } from "@/context/InterfaceContext";
import Image from "next/image";
import artworkURL from "@/components/global/ArtworkURL";
import Stars from "@/components/global/Stars";
import { User } from "@/components/artifacts/User";

const Soundtrack = ({ userId }: { userId: string }) => {
  const { scrollContainerRef } = useInterfaceContext();
  const heightContainerRef = useRef<HTMLDivElement>(null);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSoundtrackQuery(userId);

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  if (!data) return;
  return (
    <div
      className={`flex flex-col gap-8 w-full h-full overflow-scroll snap-y snap-mandatory`}
    >
      {allActivities.map((activity, index) => {
        if (!activity.artifact) return null;
        return <User artifact={activity.artifact} key={activity.id} />;
      })}
    </div>
  );
};

export default Soundtrack;
