import Image from "next/image";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AsteriskIcon,
  PlayIcon,
  ReviewIcon,
  StarIcon,
  StarsIcon,
} from "../../../icons";
import { RenderEntries } from "./subcomponents/RenderEntries";
import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { AlbumData } from "@/lib/interfaces";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

async function initializeAlbum(album: AlbumData) {
  const response = await axios.post(`/api/album/postAlbum`, album);
  return response.data;
}

async function fetchReviews({
  pageParam = 1,
  queryKey,
  sort = "rating_high_to_low",
}: {
  pageParam?: number;
  queryKey: [string, string | undefined];
  sort?: string;
}) {
  const [, albumId] = queryKey;
  const response = await axios.get(
    `/api/album/getReviews?albumId=${albumId}&page=${pageParam}&sort=${sort}`
  );
  return response.data;
}

export default function Album() {
  // CMDK Context
  const { setPages, bounce, pages } = useCMDK();
  const { selectedAlbum } = useCMDKAlbum();

  const boxShadow = selectedAlbum?.shadowColor
    ? `-90px 73px 46px ${selectedAlbum?.shadowColor},0.01),
     -51px 41px 39px ${selectedAlbum.shadowColor},0.05),
     -22px 18px 29px ${selectedAlbum.shadowColor},0.08),
     -6px 5px 16px ${selectedAlbum.shadowColor},0.1),
     0px 0px 0px ${selectedAlbum.shadowColor},0.1)`
    : undefined;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize album and mark as viewed
  const albumQuery = useQuery(
    ["album", selectedAlbum?.id],
    () =>
      selectedAlbum ? initializeAlbum(selectedAlbum) : Promise.resolve({}),
    {
      enabled: !!selectedAlbum, // Query will not run unless selectedAlbum is defined
    }
  );

  // Fetch reviews for the album
  const reviewsQuery = useInfiniteQuery(
    ["reviews", selectedAlbum?.id],
    fetchReviews,
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.length === 10 ? pages.length + 1 : false;
      },
      enabled: !!selectedAlbum, // Query will not run unless selectedAlbum is defined
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        toast.success("loaded reviews");
      },
    }
  );

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
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      if (
        scrollContainer &&
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // Load and error handling
  if (!selectedAlbum || isLoading || isFetchingNextPage) {
    return <div>Loading...</div>; // Replace with your preferred loading state
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
    <div
      ref={scrollContainerRef}
      className="flex flex-col items-center rounded-[32px] z-0 w-full overflow-scroll scrollbar-none bg-white"
      style={{
        boxShadow: boxShadow,
      }}
    >
      {/* Section One */}
      <div className="relative">
        <Image
          className="rounded-2xl rounded-b-none"
          src={selectedAlbum.artworkUrl}
          alt={`${selectedAlbum.attributes.name} artwork`}
          width={800}
          height={800}
        />

        <div className="absolute flex gap-4 p-4 left-4 bottom-4">
          {/* Album Info  */}
          <div className="flex flex-col gap-1 text-white tracking-tight">
            <div className="text-end">
              {selectedAlbum.attributes.artistName}
            </div>
            <button
              onClick={() => {
                setPages((prevPages) => [...prevPages, { name: "form" }]);
                bounce();
              }}
              className="font-bold text-2xl transition-all duration-300 hover:scale-105"
            >
              + {selectedAlbum.attributes.name}
            </button>
          </div>
        </div>
      </div>

      {/* Section Two / Entries  */}
      <div className="flex flex-col p-4 gap-4 relative rounded-2xl -translate-y-4 bg-white shadow-defaultLow -mb-4 w-full">
        {/* Verdict  */}
        <div className="flex flex-col gap-4 p-2">
          {/* The Verdict  */}
          <div className="flex items-center gap-2">
            {/* Stars  */}
            <div className="flex items-center gap-1">
              <div className="text-xl text-grey font-semibold">4.2</div>
              <StarsIcon width={24} height={24} color={"#999"} />
            </div>
            {/* Album Metadata  */}
            <div className="flex items-center gap-4 ml-2">
              {/* Play Count */}
              <div className="flex flex-col gap-1">
                <div className="text-xs text-grey">+ heard by</div>
                <div className="font-semibold text-sm text-grey">400</div>
              </div>
              {/* Loved count */}
              <div className="flex flex-col gap-1">
                <div className="text-xs text-grey">* loved by</div>
                <div className="font-semibold text-sm text-grey">20</div>
              </div>
            </div>
          </div>

          {/* Verdict Notes  */}
          <div className="text-sm text-grey">verdict pending</div>
        </div>

        {/* Album Entries  */}
        <div className="flex h-full">
          <RenderEntries reviews={flattenedReviews} />
        </div>
        {/* Loading Indicator  */}
        {isFetchingNextPage ? (
          <div className="">loading more reviews...</div>
        ) : hasNextPage ? (
          <button onClick={() => fetchNextPage()}>Load More</button>
        ) : (
          <div className="">youve reached the end</div>
        )}
      </div>
    </div>
  );
}
