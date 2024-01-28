import React, { useEffect, useRef } from "react";
import { VariableSizeList as List } from "react-window";
import { useArtifactsQuery } from "@/lib/apiHelper/album";
import Entry from "@/components/interface/sound/items/Entry";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { ArtifactExtended } from "@/types/globalTypes";
import { GetDimensions } from "@/components/interface/Interface";
import { PageName } from "@/context/InterfaceContext";
import InfiniteLoader from "react-window-infinite-loader";
import { SortOrder } from "@/components/interface/sound/Sound";
import { motion } from "framer-motion";
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
  const { user, pages, activePage, setPages } = useInterfaceContext();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useArtifactsQuery(soundId, user?.id, sortOrder, range);

  const ref = React.useRef<VirtuosoHandle>(null);
  const state = React.useRef<StateSnapshot | undefined>(
    activePage.sound?.snapshot?.state,
  );
  const key = activePage.sound?.snapshot?.key;

  const { target } = GetDimensions(activePage.name as PageName);

  const activities = data ? data.pages.flatMap((page) => page.data) : [];

  // const itemCount = hasNextPage ? activities.length + 1 : activities.length;

  return (
    <div className={`mt-1 h-max w-full`}>
      <Virtuoso
        key={key}
        ref={ref}
        style={{ height: target.height }}
        data={activities}
        overscan={200}
        restoreStateFrom={state.current}
        computeItemKey={(key: number) => `item-${key.toString()}`}
        endReached={hasNextPage ? fetchNextPage : undefined}
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
            className={`p-8`}
          >
            <div
              className={`flex flex-col bg-[#F4F4F4] relative w-full px-6 pt-6 pb-[19px] rounded-full gap-3 outline outline-1 outline-silver`}
            >
              <Entry artifact={activity.artifact} />
            </div>
          </div>
        )}
        components={{
          Footer: () => isFetchingNextPage && <div>Loading more...</div>,
          EmptyPlaceholder: () => <div>No artifacts available</div>,
        }}
      />
    </div>
  );
};

export default Artifacts;

// const Row = ({ index }: { index: number }) => {
//   const activity = activities[index];
//   const artifact = activity.artifact as ArtifactExtended;
//
//   return (
//     <motion.div
//       ref={rowRef}
//       onClick={handleRowClick}
//       className={`flex flex-col bg-[#F4F4F4] relative w-full px-6 pt-6 pb-[19px] rounded-full gap-3 outline outline-1 outline-silver`}
//     >
//       <Entry artifact={artifact} />
//     </motion.div>
//   );
// };
