import Image from "next/image";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoveIcon, PlayIcon, ReviewIcon, StarIcon } from "../../../icons";
import { RenderEntries } from "./subcomponents/RenderEntries";
import useCMDKContext from "../../../../hooks/useCMDK";
import useCMDKAlbum from "../../../../hooks/useCMDKAlbum";
import { AlbumData } from "@/lib/interfaces";

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
  } = useInfiniteQuery(["reviews", selectedAlbum?.id], fetchReviews, {
    getNextPageParam: (lastPage, pages) => {
      // If the last page has 10 reviews, there might be another page.
      // Replace "10" with the actual page size you are using on the server side.
      return lastPage.length === 10 ? pages.length + 1 : false;
    },
    enabled: !!selectedAlbum, // Query will not run unless selectedAlbum is defined
  });

  const flattenedReviews = reviewsData?.pages.flat() || [];

  return (
    <div className="flex rounded-2xl flex-col w-full h-full overflow-scroll scrollbar-none">
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

        <div className="flex gap-1 w-fit text-white text-sm absolute left-4 bottom-4">
          <div className="font-bold drop-shadow-2xl">
            {selectedAlbum?.attributes.name} &middot;
          </div>
          <div>{selectedAlbum?.attributes.artistName}</div>
        </div>
      </div>

      {/* Section Two / Entries  */}
      <div className="flex flex-col w-full p-4 gap-4 relative">
        {/* Album Rating  */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="text-xl text-black font-semibold">4.2</div>
            <StarIcon width={24} height={24} color={"#333"} />
          </div>

          {/* Album Metadata  */}
          <div className="flex items-center gap-4">
            {/* Play Count */}
            <div className="flex items-center gap-1">
              <div className=" text-xs text-grey">400</div>
              <PlayIcon width={16} height={16} color={"#999"} />
            </div>
            {/* Loved count */}
            <div className="flex items-center gap-1">
              <div className=" text-xs text-grey">400</div>
              <LoveIcon width={16} height={16} color={"#999"} />
            </div>
          </div>
        </div>

        {/* Verdict  */}
        <div className="flex flex-col gap-2">
          {/* The Verdict  */}
          <div className="flex items-center gap-1">
            <div className="px-[9px] py-1 rounded-full bg-[#000] text-sm text-white flex items-center justify-center font-medium max-w-fit">
              C
            </div>
            <div className="text-black text-xs font-bold"> /verdict</div>
          </div>

          {/* Verdict Notes  */}
          <div className="text-sm text-black lowercase">
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
        {hasNextPage && (
          <button onClick={() => fetchNextPage()}>Load more</button>
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
