import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useEffect, useMemo } from "react";
import { animated, SpringValue } from "@react-spring/web";
import { useSession } from "next-auth/react";
import { EntryAlbum } from "./subcomponents/EntryAlbum";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useAlbumQuery } from "@/lib/api/albumAPI";
import { useReviewsQuery } from "@/lib/api/albumAPI";
import useFetchArtworkUrl from "@/hooks/useFetchArtworkUrl";

interface AlbumProps {
  scale: SpringValue<number>;
}

const Album = ({ scale }: AlbumProps) => {
  // CMDK Context
  const { data: session } = useSession();

  const { setPages, pages } = useCMDK();
  const { selectedAlbum } = useCMDKAlbum();
  const { scrollContainerRef, restoreScrollPosition, handleInfiniteScroll } =
    useScrollPosition();

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

  // Initialize album, fetch reviews (w/likes if auth), and infinite scroll
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
  const { artworkUrl, isLoading: isArtworkLoading } = useFetchArtworkUrl(
    selectedAlbum?.id,
    "1444"
  );

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

  // useEffect(restoreScrollPosition, [pages, restoreScrollPosition]);

  // Load and error handling
  if (!selectedAlbum || isLoading || isFetchingNextPage || isArtworkLoading) {
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
      ref={scrollContainerRef}
      className="flex flex-col items-center rounded-[24px] h-full w-full relative"
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
          src={artworkUrl || "/public/images/default.png"}
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
      <div className="flex flex-col p-8 gap-8 relative w-full">
        {/* Album Entries  */}
        <div className="flex flex-col gap-8 overflow-visible h-full">
          {flattenedReviews?.length > 0 ? (
            flattenedReviews.map((review) => (
              <EntryAlbum key={review.id} review={review} />
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
};

export default Album;
