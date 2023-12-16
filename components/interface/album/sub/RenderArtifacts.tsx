import React, { useEffect, useRef } from "react";
import { VariableSizeList as List } from "react-window";
import { useArtifactsQuery } from "@/lib/apiHelper/album";
import Album from "@/components/artifacts/Album";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { ArtifactExtended } from "@/types/globalTypes";
import { GetDimensions } from "@/components/interface/Interface";
import { PageName, Page } from "@/context/InterfaceContext";
import InfiniteLoader from "react-window-infinite-loader";

interface RenderArtifactsProps {
  soundId: string;
  sortOrder: "newest" | "highlights" | "positive" | "critical";
  isOpen: boolean;
}

const DEFAULT_HEIGHT = 80;
const BASE_GAP = 24;
const GAP = 16;

const RenderArtifacts: React.FC<RenderArtifactsProps> = ({
  soundId,
  sortOrder = "newest",
  isOpen,
}) => {
  const { user, pages } = useInterfaceContext();
  const userId = user?.id;

  const activePage: Page = pages[pages.length - 1];
  const activePageName: PageName = activePage.name as PageName;
  const { target } = GetDimensions(activePageName);

  // Helps calculate item height/size
  const listRef = useRef<List>(null);
  const rowHeights = useRef<{ [key: number]: number }>({});

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useArtifactsQuery(soundId, userId, sortOrder);

  const allActivities = data ? data.pages.flatMap((page) => page.data) : [];

  const itemCount = hasNextPage
    ? allActivities.length + 1
    : allActivities.length;

  const isItemLoaded = (index: number) => {
    const loaded = !hasNextPage || index < allActivities.length;
    return loaded;
  };

  // If we're already fetching more items, return empty callback
  const loadMoreItems = isFetchingNextPage
    ? () => {}
    : () => {
        console.log("Loading more items");
        return fetchNextPage();
      };

  const setRowHeight = (index: number, size: number) => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
    rowHeights.current = { ...rowHeights.current, [index]: size };
  };

  const getRowHeight = (index: number) =>
    rowHeights.current[index] || DEFAULT_HEIGHT;

  const Row = ({ index }: { index: number }) => {
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect();
        const height = rect.height + BASE_GAP + GAP;
        setRowHeight(index, height);
      }
    }, [index]);

    const activity = allActivities[index];
    const artifact = activity.artifact as ArtifactExtended;

    return (
      <div
        ref={rowRef}
        className={`flex flex-col bg-[#F4F4F4] items-center justify-center relative w-full px-6 pt-[18px] pb-[19px] rounded-[32px]`}
      >
        <Album artifact={artifact} />
      </div>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      threshold={12}
    >
      {({ onItemsRendered, ref }) => (
        <List
          style={{
            pointerEvents: isOpen ? "auto" : "none",
          }}
          height={target.height}
          itemCount={allActivities.length}
          itemSize={getRowHeight}
          onItemsRendered={onItemsRendered}
          ref={(listInstance) => {
            ref(listInstance);
            //@ts-ignore
            listRef.current = listInstance;
          }}
          width={target.width}
        >
          {({ index, style }) => (
            <div
              className={index % 2 === 0 ? "RowEven" : "RowOdd"}
              style={{
                ...style,
                //@ts-ignore
                top: `${parseFloat(style.top + 56)}px`,
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
            >
              <Row index={index} />
            </div>
          )}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default RenderArtifacts;
