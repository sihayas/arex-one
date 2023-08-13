import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { useEffect, useMemo } from "react";
import { animated, SpringValue } from "@react-spring/web";
import { useSession } from "next-auth/react";
import { EntryAlbum } from "./subcomponents/EntryAlbum";
import { useScrollPosition } from "@/hooks/global/useScrollPosition";
import { useAlbumQuery } from "@/lib/api/albumAPI";
import { useReviewsQuery } from "@/lib/api/albumAPI";
import useFetchArtworkUrl from "@/hooks/global/useFetchArtworkUrl";
import { OpenAIIcon } from "@/components/icons";
import { useDragLogic } from "@/hooks/npm/useDragAlbumLogic";

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
  const { bind, x, activeSection } = useDragLogic();

  const boxShadow = useMemo(() => {
    if (selectedAlbum?.colors[0]) {
      return `0px 0px 0px 0px ${selectedAlbum.colors[0]}, 0.11),
        9px 11px 32px 0px ${selectedAlbum.colors[0]}, 0.11),
        37px 45px 58px 0px ${selectedAlbum.colors[0]}, 0.09),
        83px 100px 78px 0px ${selectedAlbum.colors[0]}, 0.05),
        148px 178px 93px 0px ${selectedAlbum.colors[0]}, 0.02),
        231px 279px 101px 0px ${selectedAlbum.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedAlbum?.colors]);

  // Initialize album and infinite scroll
  const albumQuery = useAlbumQuery(selectedAlbum);

  // Fetch reviews
  const sortOrder =
    activeSection === 0 ? "rating_high_to_low" : "rating_low_to_high";
  const reviewsQuery = useReviewsQuery(
    selectedAlbum!,
    session!.user,
    sortOrder
  );

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

  const ReviewSection = ({ reviews, isActive }) => (
    <div
      className={`flex flex-col gap-8 overflow-visible h-full ${
        isActive
          ? "opacity-100 transition-opacity duration-300"
          : "opacity-0 transition-opacity duration-300"
      }`}
    >
      {reviews?.length > 0 ? (
        reviews.map((review) => <EntryAlbum key={review.id} review={review} />)
      ) : (
        <div className="text-xs text-gray2 p-2">surrender the sound.</div>
      )}
    </div>
  );

  return (
    <animated.div
      ref={scrollContainerRef}
      className="flex flex-col items-center h-full w-full"
    >
      {/* Top Section */}
      <animated.div
        style={{
          transform: scale.to(
            (value) =>
              `scale3d(${value}, ${value}, ${value}) translate3d(${
                (1 - value) * -69.25
              }rem, ${(1 - value) * 12}rem, 0)`
          ),
          transformOrigin: "top center",
        }}
        className="sticky top-0 z-50"
      >
        {/* Album Artwork  */}
        <animated.img
          style={{
            borderRadius: scale.to((value) => `${20 + (1 - value) * -12}px`),
            boxShadow: boxShadow,
          }}
          src={artworkUrl || "/public/images/default.png"}
          alt={`${selectedAlbum.attributes.name} artwork`}
          width={800}
          height={800}
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
        />
        {/* Album Metadata  */}
        <animated.div
          style={{
            transform: scale.to(
              (value) => `scale3d(${1 / value}, ${1 / value}, ${1 / value})`
            ),
            transformOrigin: "center",
          }}
          className="absolute grid items-center top-[920px] ml-[192px] w-[416px] gap-8"
        >
          {/* Album Details  */}
          <div className="flex flex-col gap-2 items-center justify-center">
            <p className="text-sm text-black font-medium">{data.album.name}</p>
            <p className="text-sm text-gray2">{data.album.artist}</p>
          </div>
          {/* Rating  */}
          <div className="flex items-center justify-center justify-self-center w-9 h-9 border border-silver text-sm text-black rounded-full font-medium">
            {data.album.averageRating}
          </div>

          {/* Consensus  */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <OpenAIIcon width={16} height={16} color={"#999"} />
              <p className="font-medium text-gray2 text-xs">CONSENSUS</p>
            </div>

            {data.album.notes ? (
              <div className="text-xs text-gray2">{data.album.notes}</div>
            ) : (
              <div className="ml-6 text-xs text-gray3">COMING SOON</div>
            )}
          </div>
        </animated.div>
      </animated.div>

      {/* Section Two / Entries  */}
      <animated.div
        {...bind()}
        style={{
          transform: x.to((val) => `translateX(${val}px)`),
        }}
        className="flex p-12 gap-8 ml-[1004px] w-full h-[48rem] relative"
      >
        {/* Section Headers */}
        <animated.div
          {...bind()}
          style={{
            transform: x.to((val) => `translateX(${403 + val * 0.031}px)`),
          }}
          className="absolute top-4 left-16 flex gap-4"
        >
          <div
            className={`text-sm font-medium ${
              activeSection === 0 ? "text-black" : "text-gray3"
            }`}
          >
            highlights
          </div>
          <div
            className={`text-sm font-medium ${
              activeSection === 1 ? "text-black" : "text-gray3"
            }`}
          >
            low / high
          </div>
        </animated.div>

        {/* Highlights Section */}
        <div
          className={`flex flex-col gap-8 overflow-visible h-full ${
            activeSection === 0
              ? "opacity-100 transition-opacity duration-300"
              : "opacity-0 transition-opacity duration-300"
          }`}
        >
          {flattenedReviews?.length > 0 ? (
            flattenedReviews.map((review) => (
              <EntryAlbum key={review.id} review={review} />
            ))
          ) : (
            <div className="text-xs text-gray2 p-2">surrender the sound.</div>
          )}
        </div>

        {/* High to Low */}
        <div
          className={`flex flex-col gap-8 overflow-visible h-full ${
            activeSection === 1
              ? "opacity-100 transition-opacity duration-300"
              : "opacity-0 transition-opacity duration-300"
          }`}
        >
          {flattenedReviews?.length > 0 ? (
            flattenedReviews.map((review) => (
              <EntryAlbum key={review.id} review={review} />
            ))
          ) : (
            <div className="text-xs text-gray2 p-2">surrender the sound.</div>
          )}
        </div>

        {/* Infinite Loading Indicator  */}
        {/* {isFetchingNextPage ? (
          <div className="">loading more reviews...</div>
        ) : hasNextPage ? (
          <button onClick={() => fetchNextPage()}>load More</button>
        ) : (
          <div className="text-xs pl-2 text-gray2">end of line</div>
        )} */}
      </animated.div>
    </animated.div>
  );
};

export default Album;
