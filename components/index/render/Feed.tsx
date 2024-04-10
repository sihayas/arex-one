import { useFeedQuery } from "@/lib/helper/feed";

import React from "react";

import { EntryExtended } from "@/types/globalTypes";
import { useInterfaceContext } from "@/context/Interface";
import { Entry } from "@/components/index/items/Entry";
import { Wisp } from "@/components/index/items/Wisp";
import { Virtuoso } from "react-virtuoso";

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
    <Virtuoso
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
          {activity.entry && activity.entry.type === "artifact" ? (
            <Entry entry={activity.entry as EntryExtended} />
          ) : activity.entry && activity.entry.type === "wisp" ? (
            <Wisp entry={activity.entry as EntryExtended} />
          ) : (
            "No artifact available for this activity."
          )}
        </div>
      )}
      components={{
        Footer: () => <div className={`p-4`} />,
      }}
    />
  );
};

export default Feed;
