import { useFeedQuery } from "@/lib/helper/feed";
import { Activity } from "@/types/dbTypes";
import React, { Fragment } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { ArtifactExtended } from "@/types/globalTypes";
import { useInterfaceContext } from "@/context/Interface";
import { Entry } from "@/components/feed/items/Entry";
import { Wisp } from "@/components/feed/items/Wisp";
import { Virtuoso } from "react-virtuoso";
import Tilt from "react-parallax-tilt";
import { StarIcon } from "@/components/icons";
import Image from "next/image";
import Avatar from "@/components/global/Avatar";

const Feed = ({ userId, type }: { userId: string; type: string }) => {
  const { setIsLoading } = useInterfaceContext();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeedQuery(
    userId,
    type,
  );

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      // Check if not already fetching
      setIsLoading(true); // Start loading before fetching
      fetchNextPage()
        .then(() => {
          setIsLoading(false); // Stop loading on success
        })
        .catch((error) => {
          console.error("Error fetching next page:", error);
          setIsLoading(false); // Ensure loading is stopped on failure
        });
    }
  };

  return (
    <>
      <Virtuoso
        // ref={ref}
        style={{ height: "100vh", width: "100%" }}
        data={allActivities}
        overscan={200}
        computeItemKey={(key: number) => `item-${key.toString()}`}
        endReached={handleEndReached}
        itemContent={(index, activity) => (
          <div
            className={`flex items-center justify-center pt-[96px]`}
            key={activity.id}
          >
            {activity.artifact && activity.artifact.type === "entry" ? (
              <Entry artifact={activity.artifact as ArtifactExtended} />
            ) : activity.artifact && activity.artifact.type === "wisp" ? (
              <Wisp artifact={activity.artifact as ArtifactExtended} />
            ) : (
              "No artifact available for this activity."
            )}
          </div>
        )}
        components={{
          Footer: () => <div className={`p-4`} />,
        }}
      />
    </>
  );
};

export default Feed;
