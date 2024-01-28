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

interface RenderArtifactsProps {
  soundId: string;
  sortOrder: SortOrder;
  range: number | null;
}

const DEFAULT_HEIGHT = 80;
const BASE_GAP = 24;
const GAP = 16;

const Artifacts: React.FC<RenderArtifactsProps> = ({
  soundId,
  sortOrder = "newest",
  range = null,
}) => {
  const { user, pages, activePage, setPages } = useInterfaceContext();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useArtifactsQuery(soundId, user?.id, sortOrder, range);
  const rowPositionRef = useRef<number>(0);

  const { target } = GetDimensions(activePage.name as PageName);

  // Helps calculate item height/size
  const listRef = useRef<List>(null);
  const rowHeights = useRef<{ [key: number]: number }>({});

  const activities = data ? data.pages.flatMap((page) => page.data) : [];

  const itemCount = hasNextPage ? activities.length + 1 : activities.length;

  // Helper to check if item is loaded -> for infinite scroll
  const isItemLoaded = (index: number) => {
    return !hasNextPage || index < activities.length;
  };

  // If we're already fetching more search, return empty callback
  const loadMoreItems = isFetchingNextPage
    ? () => {}
    : () => {
        console.log("Loading more search");
        return fetchNextPage();
      };

  // Measures row height and stores it in rowHeights
  const setRowHeight = (index: number, size: number) => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
    rowHeights.current = { ...rowHeights.current, [index]: size };
  };

  // Store scroll position on row click
  const handleRowClick = () => {
    pages[pages.length - 1].scrollPosition = rowPositionRef.current;
    console.log("storing scroll position", rowPositionRef.current);
  };

  // Create a row
  const Row = ({ index }: { index: number }) => {
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect();
        const height = rect.height + BASE_GAP + GAP;
        setRowHeight(index, height);
      }
    }, [index]);

    const activity = activities[index];
    const artifact = activity.artifact as ArtifactExtended;

    return (
      <motion.div
        ref={rowRef}
        onClick={handleRowClick}
        className={`flex flex-col bg-[#F4F4F4] relative w-full px-6 pt-6 pb-[19px] rounded-full gap-3 outline outline-1 outline-silver`}
      >
        <Entry artifact={artifact} />
      </motion.div>
    );
  };

  // Helper for row height
  const getRowHeight = (index: number) =>
    rowHeights.current[index] || DEFAULT_HEIGHT;

  // Get cumulative height of rows / store scroll position
  const getCumulativeHeight = (rowIndex: number) => {
    let totalHeight = 0;

    Object.keys(rowHeights.current).forEach((key) => {
      const numericKey = parseInt(key);
      if (!isNaN(numericKey) && numericKey < rowIndex) {
        totalHeight += rowHeights.current[numericKey] || 0; // Type assertion here
      }
    });

    console.log("initial scroll offset", totalHeight);
    return totalHeight;
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
          initialScrollOffset={activePage.scrollPosition}
          height={target.height}
          itemCount={activities.length}
          itemSize={getRowHeight}
          onItemsRendered={({ visibleStartIndex }) => {
            if (visibleStartIndex !== 0 && pages.length > 0) {
              rowPositionRef.current = getCumulativeHeight(visibleStartIndex);
              console.log("setting scroll position", rowPositionRef.current);
            }
          }}
          ref={(listInstance) => {
            ref(listInstance);
            //@ts-ignore
            listRef.current = listInstance;
          }}
          width={target.width}
          className={`mask`}
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

export default Artifacts;
