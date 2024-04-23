import React from "react";
import { useFeedQuery } from "@/lib/helper/feed";
import { useInterfaceContext } from "@/context/Interface";
import { Entry } from "@/components/global/Entry";
import { Virtuoso } from "react-virtuoso";
import Avatar from "@/components/global/Avatar";

const Feed = ({ userId, type }: { userId: string; type: string }) => {
  const { setIsLoading } = useInterfaceContext();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedQuery(userId);

  const entries = data ? data.pages.flatMap((page) => page.data) : [];

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
      data={entries}
      overscan={200}
      computeItemKey={(key: number) => `item-${key.toString()}`}
      endReached={handleEndReached}
      itemContent={(index, entry) => {
        const color = entry.sound_data.attributes.artwork.bgColor;
        return (
          <div
            className={`flex items-center justify-center pt-[96px]`}
            key={entry.id}
          >
            <div className={`-ml-12 relative flex w-[352px] items-end gap-2`}>
              <Avatar
                className={`border-silver z-10 border`}
                imageSrc={entry.author.image}
                altText={`${entry.author.username}'s avatar`}
                width={40}
                height={40}
                user={entry.author}
              />

              {entry.type === "artifact" && <Entry entry={entry} />}

              <p
                className={`text-gray2 absolute -bottom-7 left-[68px] font-medium mix-blend-darken z-0`}
              >
                {entry.author.username}
              </p>
              <div
                style={{ background: `#${color}` }}
                className={`ambien absolute left-[48px] -z-50 h-[432px] w-[304px]`}
              />
            </div>
          </div>
        );
      }}
      components={{
        Footer: () => <div className={`p-4`} />,
      }}
    />
  );
};

export default Feed;
