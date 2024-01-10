import React, { useEffect, useRef } from "react";
import { VariableSizeList as List } from "react-window";
import { useArtifactsQuery } from "@/lib/apiHelper/album";
import Entry from "@/components/interface/album/items/Entry";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { ArtifactExtended } from "@/types/globalTypes";
import { GetDimensions } from "@/components/interface/Interface";
import { PageName, Page } from "@/context/InterfaceContext";
import InfiniteLoader from "react-window-infinite-loader";
import { SortOrder } from "@/components/interface/album/Album";

interface RenderArtifactsProps {
  soundId: string;
  sortOrder: SortOrder;
  isOpen: boolean;
}

const DEFAULT_HEIGHT = 80;
const BASE_GAP = 24;
const GAP = 16;

const Artifacts: React.FC<RenderArtifactsProps> = ({
  soundId,
  sortOrder = "newest",
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

  const activities = data ? data.pages.flatMap((page) => page.data) : [];

  const itemCount = hasNextPage ? activities.length + 1 : activities.length;

  // Helper to check if item is loaded -> for infinite scroll
  const isItemLoaded = (index: number) => {
    const loaded = !hasNextPage || index < activities.length;
    return loaded;
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

  // Calculate row height
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
      <div
        ref={rowRef}
        className={`flex flex-col bg-[#E5E5E5] items-center justify-center relative w-full px-6 pb-[19px] rounded-full gap-3`}
      >
        <Entry artifact={artifact} />
      </div>
    );
  };

  // Helper to get row height
  const getRowHeight = (index: number) =>
    rowHeights.current[index] || DEFAULT_HEIGHT;

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
      threshold={12}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={target.height}
          itemCount={activities.length}
          itemSize={getRowHeight}
          onItemsRendered={onItemsRendered}
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
