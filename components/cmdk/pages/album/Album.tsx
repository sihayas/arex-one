import Image from "next/image";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  LoveIcon,
  PlayIcon,
  ReviewIcon,
  StarIcon,
  StarsIcon,
} from "../../../icons";
import { RenderEntries } from "./subcomponents/RenderEntries";
import useCMDKContext from "../../../../hooks/useCMDK";
import useCMDKAlbum from "../../../../hooks/useCMDKAlbum";
import { AlbumData } from "@/lib/interfaces";
import { useEffect, useRef } from "react";

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
  console.log("fetchReviews response: ", response.data);
  return response.data;
}

export default function Album() {
  // CMDK Context
  const { setPages, bounce } = useCMDKContext();
  const { selectedAlbum, artworkUrl } = useCMDKAlbum();

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
      className="flex rounded-2xl flex-col w-full overflow-scroll scrollbar-none"
    >
      {/* Section One */}
      <div className="relative">
        <Image
          className="rounded-2xl rounded-b-none"
          src={artworkUrl}
          alt={`${selectedAlbum?.attributes.name} artwork`}
          width={720}
          height={720}
          quality={100}
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#FFF] to-transparent"></div>
        <div className="flex flex-col gap-2 absolute left-5 bottom-5">
          {/* Album Info  */}
          <div className="flex gap-1  text-white text-sm">
            <div className="font-bold drop-shadow-2xl">
              {selectedAlbum?.attributes.name} &middot;
            </div>
            <div>{selectedAlbum?.attributes.artistName}</div>
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
                <LoveIcon width={16} height={16} color={"#FFF"} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Two / Entries  */}
      <div className="flex flex-col w-full p-4 gap-4 relative">
        {/* Verdict  */}
        <div className="flex flex-col gap-2 p-4">
          {/* The Verdict  */}
          <div className="flex items-center gap-1">
            {/* put star here  */}
            <div className="flex items-center gap-1 py-1 px-2 bg-[#FDF1E5] rounded-full font-medium">
              <StarsIcon width={16} height={16} color={"#6B3815"} />
              <div className="text-xs text-[#6B3815]">classic</div>
            </div>
            <div className="text-grey text-xs font-bold"> /verdict</div>
          </div>

          {/* Verdict Notes  */}
          <div className="text-sm text-grey lowercase">
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
      <div className="absolute right-4 bottom-4">
        <ReviewIcon
          color={"#FFF"}
          onClick={() => {
            setPages((prevPages) => [...prevPages, "form"]);
            bounce();
          }}
        />
      </div>
    </div>
  );
}
