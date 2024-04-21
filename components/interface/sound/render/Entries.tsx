import React from "react";
import { useEntriesQuery } from "@/lib/helper/interface/sound";
import { useInterfaceContext } from "@/context/Interface";
import { GetDimensions } from "@/components/interface/Interface";
import { SortOrder } from "@/components/interface/sound/Sound";
import { Virtuoso, StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { useEntry } from "@/hooks/usePage";
import { AlbumData } from "@/types/appleTypes";
import { motion } from "framer-motion";
import { Entry } from "@/components/global/Entry";

interface RenderEntriesProps {
  soundId: string;
  sortOrder: SortOrder;
  range: number | null;
}

const Entries: React.FC<RenderEntriesProps> = ({
  soundId,
  sortOrder = "newest",
  range = null,
}) => {
  const { user, activePage } = useInterfaceContext();
  const { handleSelectEntry } = useEntry();
  const { target } = GetDimensions(activePage.type);

  const sound = activePage.data as AlbumData;

  // Capture the state of the virtuoso list
  const ref = React.useRef<VirtuosoHandle>(null);
  const state = React.useRef<StateSnapshot | undefined>(
    activePage.snapshot?.state,
  );
  const key = activePage.snapshot?.key;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEntriesQuery(soundId, user?.id, sortOrder, range);

  const entries = data ? data.pages.flatMap((page) => page.data) : [];

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
        .then(() => {})
        .catch((error) => {
          console.error("Error fetching next page:", error);
        });
    }
  };

  if (!entries || !sound) return null;

  const url = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    88 * 2.5,
    88 * 2.5,
  );

  return (
    <Virtuoso
      key={key}
      ref={ref}
      style={{ height: target.height }}
      data={entries}
      overscan={200}
      restoreStateFrom={state.current}
      computeItemKey={(key: number) => `item-${key.toString()}`}
      endReached={handleEndReached}
      itemContent={(index, entry) => (
        <motion.div
          onClick={() => {
            ref.current?.getState((snapshot) => {
              activePage.snapshot = { state: snapshot, key: index };
            });
            handleSelectEntry(entry);
          }}
          className={`cloud-shadow ${index % 2 !== 0 ? "mr-[128px]" : "mr-8"} ${
            index === 0 && "pt-8"
          }`}
        >
          <Entry entry={entry} />
        </motion.div>
      )}
      components={{
        Footer: () => <div className={`p-4`} />,
        // EmptyPlaceholder: () => <div>No artifacts available</div>,
      }}
    />
  );
};

export default Entries;

// const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
//     artifact.heartedByUser,
//     artifact._count.hearts,
//     "/api/artifact/entry/post/",
//     "recordId",
//     artifact.id,
//     artifact.author.id,
//     user?.id,
// );
