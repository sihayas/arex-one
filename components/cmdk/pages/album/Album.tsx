import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useEffect, useMemo } from "react";
import { useScroll } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";
import { useSession } from "next-auth/react";
import { EntryPreview } from "./subcomponents/EntryPreview";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useAlbumQuery } from "@/lib/api/albumAPI";
import { useReviewsQuery } from "@/lib/api/albumAPI";
import { debounce } from "lodash";
import { useDragLogic } from "@/hooks/useDragLogic";

export default function Album() {
  // CMDK Context
  const { data: session } = useSession();

  const { setPages, pages } = useCMDK();
  const { selectedAlbum } = useCMDKAlbum();
  const { scrollContainerRef, restoreScrollPosition, handleInfiniteScroll } =
    useScrollPosition();

  const setDebounced = useMemo(
    () =>
      debounce(({ newScale, newWidth }) => {
        setPages((prevPages) => {
          const newPages = [...prevPages];
          const activePageIndex = newPages.length - 1;
          newPages[activePageIndex] = {
            ...newPages[activePageIndex],
            dimensions: {
              minWidth: newWidth,
              height: 722,
            },
          };
          return newPages;
        });
      }, 100),
    []
  );

  // React Spring and Drag Logic
  const [{ scale, width }, set] = useSpring(() => ({ scale: 1, width: 722 }));
  const { bind: dragBind, x, y, scale: dragScale } = useDragLogic();

  // Shrink and width logic
  const scrollBind = useScroll(({ xy: [, y] }) => {
    let newScale = 1 - y / 1000;
    if (newScale > 1) newScale = 1;
    if (newScale < 0.5) newScale = 0.6; // CHATGPT HERE

    let newWidth = 722 + (y / 300) * (1066 - 722);
    if (newWidth < 722) newWidth = 722;
    if (newWidth > 1066) newWidth = 1066;

    // Apply the new scale and width immediately to the spring animation
    set({ scale: newScale, width: newWidth });

    // Defer updating the page dimensions
    setDebounced({ newScale, newWidth });
  });

  // Infinite Scroll Page Tracker
  useEffect(() => {}, []);

  const boxShadow = useMemo(() => {
    if (selectedAlbum?.colors[0]) {
      return `0px 0px 0px 0px ${selectedAlbum.colors[0]},0.025),
     0px 5px 12px 0px ${selectedAlbum.colors[0]},0.25),
     0px 22px 22px 0px ${selectedAlbum.colors[0]},0.22),
     0px 49px 29px 0px ${selectedAlbum.colors[0]},0.13),
     0px 87px 35px 0px ${selectedAlbum.colors[0]},0.04),
     0px 136px 38px 0px ${selectedAlbum.colors[0]},0.00)`;
    }
    return undefined;
  }, [selectedAlbum?.colors]);

  // Initialize album, fetch reviews (w/likes if authd), and infinite scroll
  const albumQuery = useAlbumQuery(selectedAlbum);
  const reviewsQuery = useReviewsQuery(selectedAlbum, session?.user);

  const { data, isLoading, isError } = albumQuery;
  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: isReviewsError,
  } = reviewsQuery;

  // Infinite Scroll Page Tracker
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      handleInfiniteScroll(fetchNextPage);
    }
  }, [
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    setPages,
    handleInfiniteScroll,
  ]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      setDebounced.cancel();
    };
  }, [setDebounced]);
  useEffect(restoreScrollPosition, [pages, restoreScrollPosition]);

  // Load and error handling
  if (!selectedAlbum || isLoading || isFetchingNextPage) {
    return <div>loading...</div>; // Replace with your preferred loading state
  }

  if (isError || isReviewsError) {
    return (
      <div>
        <button onClick={pages.pop}>go back</button>
        <button onClick={pages.pop}>retry</button>
      </div>
    );
  }

  const flattenedReviews = reviewsData?.pages.flat() || [];

  return (
    <animated.div
      {...scrollBind()}
      {...dragBind()}
      ref={scrollContainerRef}
      className="flex flex-col items-center rounded-[24px] h-full overflow-x-visible overflow-y-scroll scrollbar-none relative scale-x-150"
      style={{
        width: width.to((w) => `${w}px`),
        transform: dragScale.to((s) => `scale(${s})`),
        x,
        y,
      }}
    >
      {/* Top Section */}
      <animated.div
        style={{
          transform: scale.to(
            (value) =>
              `scale3d(${value}, ${value}, ${value}) translate3d(${
                (1 - value) * 67
              }rem, 0, 0)`
          ),
          transformOrigin: "center",
        }}
        className="sticky top-0"
      >
        {/* Album Artwork  */}
        <animated.img
          style={{
            borderRadius: scale.to((value) => `${24 + (1 - value) * -12}px`),
            boxShadow: boxShadow,
          }}
          src={selectedAlbum.artworkUrl}
          alt={`${selectedAlbum.attributes.name} artwork`}
          width={722}
          height={722}
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
        />

        {/* Album Info  */}
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <div className="text-3xl font-medium text-black">
            {selectedAlbum.attributes.name}
          </div>
          <div className="text-2xl text-gray2">
            {selectedAlbum.attributes.artistName}
          </div>
        </div>
      </animated.div>

      {/* Section Two / Entries  */}
      <div className="flex flex-col p-8 mt-4 gap-8 relative w-full">
        {/* Album Entries  */}
        <div className="flex flex-col gap-8 overflow-visible h-full pb-[60vh]">
          {flattenedReviews?.length > 0 ? (
            flattenedReviews.map((review) => (
              <EntryPreview key={review.id} review={review} />
            ))
          ) : (
            <div className="text-xs text-grey p-2">no entries</div>
          )}
        </div>

        {/* Infinite Loading Indicator  */}
        {isFetchingNextPage ? (
          <div className="">loading more reviews...</div>
        ) : hasNextPage ? (
          <button onClick={() => fetchNextPage()}>load More</button>
        ) : (
          <div className="text-xs pl-2 text-gray2">end of line</div>
        )}
      </div>
    </animated.div>
  );
}
