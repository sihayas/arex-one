import React from "react";
import { useEntriesQuery } from "@/lib/helper/interface/sound";
import { useInterfaceContext } from "@/context/Interface";
import { GetDimensions } from "@/components/interface/Interface";
import { SortOrder } from "@/components/interface/sound/Sound";
import { Virtuoso, StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { useEntry } from "@/hooks/usePage";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Entry } from "@/components/global/Entry";

interface RenderEntriesProps {
  soundId: string;
  sortOrder: SortOrder;
  range: number | null;
}

const springConfig = { damping: 34, stiffness: 224 };

const Entries: React.FC<RenderEntriesProps> = ({
  soundId,
  sortOrder = "newest",
  range = null,
}) => {
  const { user, activePage, scrollContainerRef } = useInterfaceContext();
  const { openEntryPage } = useEntry();
  const { target } = GetDimensions(activePage.type);

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  const scale = useSpring(
    useTransform(scrollY, [0, 24], [0.74, 1]),
    springConfig,
  );
  // first card translations
  const xZero = useSpring(
    useTransform(scrollY, [0, 24], [62, 0]),
    springConfig,
  );
  const yZero = useSpring(
    useTransform(scrollY, [0, 24], [-78, 0]),
    springConfig,
  );
  const rotateZero = useSpring(
    useTransform(scrollY, [0, 24], [4, 0]),
    springConfig,
  );

  // second card translations
  const xOne = useSpring(useTransform(scrollY, [0, 24], [24, 0]), springConfig);
  const yOne = useSpring(
    useTransform(scrollY, [0, 24], [-296, 0]),
    springConfig,
  );
  const rotateOne = useSpring(
    useTransform(scrollY, [0, 24], [-4, 0]),
    springConfig,
  );

  // capture the state of the virtuoso list
  const ref = React.useRef<VirtuosoHandle>(null);
  const state = React.useRef<StateSnapshot | undefined>(
    activePage.snapshot?.state,
  );
  const key = activePage.snapshot?.key;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEntriesQuery(soundId, user!.id, sortOrder, "mid");
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
          style={{
            scale: index === 0 ? scale : index === 1 ? scale : 1,
            y: index === 0 ? yZero : index === 1 ? yOne : 0,
            x: index === 0 ? xZero : index === 1 ? xOne : 0,
            zIndex: index === 0 ? 20 : index === 1 ? -10 : 0,
            rotate: index === 0 ? rotateZero : index === 1 ? rotateOne : 0,
          }}
          onClick={() => {
            ref.current?.getState((snapshot) => {
              activePage.snapshot = { state: snapshot, key: index };
            });
            openEntryPage(entry);
          }}
          className={`w-fit ml-auto pr-[72px] pt-[72px]`}
        >
          <Entry entry={entry} flip={true} />
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
