import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { StarsIcon } from "../../../icons";
import { useEffect, useMemo } from "react";
import { useScroll } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";
import { useSession } from "next-auth/react";
import { EntryPreview } from "./subcomponents/EntryPreview";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useAlbumQuery } from "@/lib/api/albumAPI";
import { useReviewsQuery } from "@/lib/api/albumAPI";

export default function Album() {
  // CMDK Context
  const { setPages, bounce, pages } = useCMDK();
  const { selectedAlbum } = useCMDKAlbum();
  const { data: session } = useSession();

  const {
    scrollContainerRef,
    saveScrollPosition,
    restoreScrollPosition,
    handleInfiniteScroll,
  } = useScrollPosition();

  // Define a new spring state for the width along with scale
  const [{ scale, width }, set] = useSpring(() => ({ scale: 1, width: 658 }));

  // Shrink the album cover on scroll
  const bind = useScroll(({ xy: [, y] }) => {
    let newScale = 1 - y / 1000; // Larger numbers = slower shrink.
    if (newScale > 1) newScale = 1;
    if (newScale < 0.5) newScale = 0.5;

    let newWidth = 658 + (y / 200) * (930 - 658);
    if (newWidth < 658) newWidth = 658;
    if (newWidth > 930) newWidth = 930; // Max width

    set({ scale: newScale, width: newWidth });

    saveScrollPosition();
  });

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

  // Initialize album and mark as viewed
  const albumQuery = useAlbumQuery(selectedAlbum);
  // Fetch reviews for the album
  const reviewsQuery = useReviewsQuery(selectedAlbum, session?.user);

  // Call initialize album and fetch reviews
  const { data, isLoading, isError } = albumQuery;
  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: isReviewsError,
  } = reviewsQuery;

  useEffect(restoreScrollPosition, [pages, restoreScrollPosition]);

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
      {...bind()}
      ref={scrollContainerRef}
      className="flex flex-col items-center rounded-[24px] w-[658px] bg-white overflow-scroll scrollbar-none"
      style={{
        width: width.to((w) => `${w}px`), // use the new spring state as the width
      }}
    >
      {/* Section One / Album Art */}
      <animated.div
        style={{
          transform: scale.to((value) => `scale(${value})`),
          top: scale.to((value) => `${(1 - value) * 64}px`),
          translateX: scale.to((value) => `${(1 - value) * 418}px`), // 418 edge
          transformOrigin: "top right", // scales towards the right
        }}
        className="sticky top-0"
      >
        <animated.img
          style={{
            borderRadius: scale.to((value) => `${24 + (1 - value) * 12}px`),
            boxShadow: boxShadow,
          }}
          src={selectedAlbum.artworkUrl}
          alt={`${selectedAlbum.attributes.name} artwork`}
          width={658}
          height={658}
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
        />
      </animated.div>

      {/* Section Two / Entries  */}
      <div className="flex flex-col p-8 mt-4 gap-8 relative w-full">
        {/* Album Entries  */}
        <div className="flex flex-col gap-10 overflow-visible h-full pb-[100vh]">
          {flattenedReviews?.length > 0 ? (
            flattenedReviews.map((review) => (
              <EntryPreview key={review.id} review={review} />
            ))
          ) : (
            // If there are no entries, display this message
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
