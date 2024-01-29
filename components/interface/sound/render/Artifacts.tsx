import React from "react";
import { useArtifactsQuery } from "@/lib/apiHelper/album";
import Entry from "@/components/interface/sound/items/Entry";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { GetDimensions } from "@/components/interface/Interface";
import { PageName } from "@/context/InterfaceContext";
import { SortOrder } from "@/components/interface/sound/Sound";
import { Virtuoso, StateSnapshot, VirtuosoHandle } from "react-virtuoso";

interface RenderArtifactsProps {
  soundId: string;
  sortOrder: SortOrder;
  range: number | null;
}

const Artifacts: React.FC<RenderArtifactsProps> = ({
  soundId,
  sortOrder = "newest",
  range = null,
}) => {
  const { user, activePage } = useInterfaceContext();
  const { data, fetchNextPage, hasNextPage } = useArtifactsQuery(
    soundId,
    user?.id,
    sortOrder,
    range,
  );

  const ref = React.useRef<VirtuosoHandle>(null);
  const state = React.useRef<StateSnapshot | undefined>(
    activePage.sound?.snapshot?.state,
  );
  const key = activePage.sound?.snapshot?.key;

  const { target } = GetDimensions(activePage.name as PageName);

  const activities = data ? data.pages.flatMap((page) => page.data) : [];

  const handleEndReached = () => {
    if (hasNextPage) {
      fetchNextPage()
        .then(() => {
          // Handle successful fetch
        })
        .catch((error) => {
          // Handle any errors that occur during fetch
          console.error("Error fetching next page:", error);
        });
    }
  };

  return (
    <div className={`mt-1 h-max w-full snap-start mask`}>
      <Virtuoso
        key={key}
        ref={ref}
        className={`scrollbar-none`}
        style={{ height: target.height }}
        data={activities}
        overscan={200}
        restoreStateFrom={state.current}
        computeItemKey={(key: number) => `item-${key.toString()}`}
        endReached={handleEndReached}
        itemContent={(index, activity) => (
          <div
            onClick={() => {
              ref.current?.getState((snapshot) => {
                activePage.sound!.snapshot = {
                  state: snapshot,
                  key: index,
                };
              });
            }}
            className={`p-8 pb-4`}
          >
            <Entry artifact={activity.artifact} />
          </div>
        )}
        components={
          {
            // Footer: () => isFetchingNextPage && <div>Loading more...</div>,
            // EmptyPlaceholder: () => <div>No artifacts available</div>,
          }
        }
      />
    </div>
  );
};

export default Artifacts;
