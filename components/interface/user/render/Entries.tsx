import React from "react";
import { useInterfaceContext } from "@/context/Interface";
import { GetDimensions } from "@/components/interface/Interface";
import { Virtuoso, StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { useEntry } from "@/hooks/usePage";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Entry } from "@/components/global/Entry";
import { useEntriesQuery } from "@/lib/helper/interface/user";
import { Author } from "@/types/global";

const springConfig = { damping: 34, stiffness: 224 };

const Entries = ({ pageUserId }: { pageUserId: string }) => {
  const { user, activePage, scrollContainerRef } = useInterfaceContext();
  const { handleSelectEntry } = useEntry();
  const { target } = GetDimensions(activePage.type);

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  // First card translations
  const xZero = useSpring(
    useTransform(scrollY, [0, 24], [-80, 0]),
    springConfig,
  );
  const yZero = useSpring(
    useTransform(scrollY, [0, 24], [112, 0]),
    springConfig,
  );
  const rotateZero = useSpring(
    useTransform(scrollY, [0, 24], [-2, 0]),
    springConfig,
  );

  // Second card translations
  const xOne = useSpring(
    useTransform(scrollY, [0, 24], [-80, 0]),
    springConfig,
  );
  const yOne = useSpring(
    useTransform(scrollY, [0, 24], [-328, 0]),
    springConfig,
  );
  const scaleOne = useSpring(
    useTransform(scrollY, [0, 24], [0.89, 1]),
    springConfig,
  );
  const rotateOne = useSpring(
    useTransform(scrollY, [0, 24], [4, 0]),
    springConfig,
  );

  // Capture the state of the virtuoso list
  const ref = React.useRef<VirtuosoHandle>(null);
  const state = React.useRef<StateSnapshot | undefined>(
    activePage.snapshot?.state,
  );
  const key = activePage.snapshot?.key;

  // Data fetching
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEntriesQuery(user!.id, pageUserId);

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
      itemContent={(index, entry) => {
        const isEven = index % 2 === 0;
        const authoredEntry = { ...entry, author: activePage.data as Author };
        return (
          <motion.div
            className={`relative w-fit px-28 ${isEven ? "mr-auto" : "ml-auto"}`}
            style={{
              y: index === 0 ? yZero : index === 1 ? yOne : 0,
              x: index === 0 ? xZero : index === 1 ? xOne : 0,
              scale: index === 1 ? scaleOne : 1,
              rotate: index === 0 ? rotateZero : index === 1 ? rotateOne : 0,
              zIndex: 10 - index,
            }}
            onClick={() => {
              ref.current?.getState((snapshot) => {
                activePage.snapshot = { state: snapshot, key: index };
              });
              handleSelectEntry(authoredEntry);
            }}
          >
            <Entry entry={authoredEntry} flip={index === 0 || index === 1} />
          </motion.div>
        );
      }}
      components={{
        Footer: () => <div className={`p-4`} />,
        // EmptyPlaceholder: () => <div>No artifacts available</div>,
      }}
    />
  );
};

export default Entries;
