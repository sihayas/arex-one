import React from "react";
import { useFeedQuery } from "@/lib/helper/feed";
import { useInterfaceContext } from "@/context/Interface";
import { Entry } from "@/components/index/items/Entry";
import { Wisp } from "@/components/index/items/Wisp";
import { Virtuoso } from "react-virtuoso";

const Feed = ({ userId, type }: { userId: string; type: string }) => {
  const { setIsLoading } = useInterfaceContext();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedQuery(userId);

  const entries = data ? data.pages.flatMap((page) => page.data) : [];
  console.log("Feed entries:", entries);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      setIsLoading(true);
      fetchNextPage()
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching next page:", error);
          setIsLoading(false);
        });
    }
  };

  return (
    <Virtuoso
      style={{ height: "100vh", width: "100%" }}
      data={entries}
      overscan={200}
      computeItemKey={(key: number) => `item-${key.toString()}`}
      endReached={handleEndReached}
      itemContent={(index, entry) => (
        <div
          className={`flex items-center justify-center pt-[96px]`}
          key={entry.id}
        >
          {entry.type === "artifact" ? (
            <Entry entry={entry} />
          ) : entry.type === "wisp" ? (
            <Wisp entry={entry} />
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
