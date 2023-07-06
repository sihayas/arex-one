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
import { motion, useTransform, useViewportScroll } from "framer-motion";

async function initializeAlbum(album: AlbumData) {
  console.log("Initializing album...");
  const response = await axios.post(`/api/album/postAlbum`, album);
  console.log("Album initialized");
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
  // console.log("fetchReviews response: ", response.data);
  return response.data;
}

export default function Album() {
  // CMDK Context
  const { setPages, bounce } = useCMDK();
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
  const { data, isLoading, isError } = useQuery(
    ["album", selectedAlbum?.id],
    () =>
      selectedAlbum ? initializeAlbum(selectedAlbum) : Promise.resolve({}),
    {
      enabled: !!selectedAlbum, // Query will not run unless selectedAlbum is defined
    }
  );

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(["reviews", selectedAlbum?.id], fetchReviews, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 10 ? pages.length + 1 : false;
    },
    enabled: !!selectedAlbum, // Query will not run unless selectedAlbum is defined
  });

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

  const flattenedReviews = reviewsData?.pages.flat() || [];

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col items-center rounded-2xl z-0 w-full overflow-scroll scrollbar-none bg-white"
      style={{
        boxShadow: boxShadow,
      }}
    >
      {/* Section One */}
      <div className="relative">
        <Image
          className="rounded-2xl rounded-b-none"
          src={selectedAlbum!.artworkUrl}
          alt={`${selectedAlbum?.attributes.name} artwork`}
          width={800}
          height={800}
          // quality={100}
        />

        <div className="absolute flex flex-col gap-2 p-4 left-4 bottom-8 bg-blurEntry rounded-2xl backdrop-blur-2xl border border-silver">
          {/* Album Info  */}
          <div className="flex flex-col text-white text-sm">
            <div className="font-medium">
              {selectedAlbum?.attributes.artistName}
            </div>
            <div>{selectedAlbum?.attributes.name}</div>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="text-xl text-white font-semibold">4.2</div>
              <StarIcon width={24} height={24} color={"#FFF"} />
            </div>

            {/* Album Metadata  */}
            <div className="flex items-center gap-4">
              {/* Play Count */}
              <div className="flex items-center gap-1">
                <div className=" text-xs text-white">400</div>
                <PlayIcon width={16} height={16} color={"#FFF"} />
              </div>
              {/* Loved count */}
              <div className="flex items-center gap-1">
                <div className=" text-xs text-white">400</div>
                <AsteriskIcon width={16} height={16} color={"#FFF"} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Two / Entries  */}
      <div className="flex flex-col w-[92%] p-4 gap-4 relative rounded-2xl -translate-y-4 bg-white shadow-defaultLow -mb-4">
        {/* Verdict  */}
        <div className="flex flex-col gap-4 p-2">
          {/* The Verdict  */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 py-1 px-2 bg-[#FDF1E5] rounded-full font-medium">
              <StarsIcon width={16} height={16} color={"#6B3815"} />
              <div className="text-xs text-[#6B3815]">classic</div>
            </div>
          </div>

          {/* Verdict Notes  */}
          <div className="text-sm text-grey">
            In Smithereens, Joji masterfully navigates the labyrinth of human
            emotions with his signature blend of melancholic pop. His soft yet
            emotive voice, backed by minimalist lo-fi beats and ethereal synths,
            guides listeners through poignant tales of love, loss, and longing.
            The album is akin to a late-night intimate conversation, its honesty
            and vulnerability resonating long after the last note. Smithereens
            isnt just music-its an emotional journey, a raw, introspective
            exploration of lifes complexities through Jojis unique lens.
          </div>
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
      <div className="absolute right-4 bottom-8 bg-blurEntry backdrop-blur-md rounded-full">
        <ReviewIcon
          color={"#FFF"}
          onClick={() => {
            setPages((prevPages) => [...prevPages, { name: "form" }]);

            bounce();
          }}
        />
      </div>
    </div>
  );
}
