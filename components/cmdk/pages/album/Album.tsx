import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { StarsIcon } from "../../../icons";
import { useCMDK } from "@/context/CMDKContext";
import { useCMDKAlbum } from "@/context/CMDKAlbum";
import { AlbumData } from "@/lib/interfaces";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useScroll } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";
import { useSession } from "next-auth/react";
import { EntryPreview } from "./subcomponents/EntryPreview";

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
  queryKey: [string, string | undefined, string | undefined];
  sort?: string;
}) {
  const [, albumId, userId] = queryKey;
  const response = await axios.get(
    `/api/album/getReviews?albumId=${albumId}&page=${pageParam}&sort=${sort}&userId=${userId}`
  );
  return response.data;
}

export default function Album() {
  // CMDK Context
  const { setPages, bounce, pages } = useCMDK();
  const { selectedAlbum } = useCMDKAlbum();
  const { data: session } = useSession();

  const [{ scale }, setScale] = useSpring(() => ({ scale: 1 }));

  // Shrink the album cover on scroll
  const bind = useScroll(({ xy: [, y] }) => {
    let newScale = 1 - y / 900; // Larger numbers = slower shrink.
    if (newScale > 1) newScale = 1;
    if (newScale < 0.5) newScale = 0.32; // Set a minimum size to prevent disappearing.

    setScale({ scale: newScale });
  });

  const boxShadow = useMemo(() => {
    if (selectedAlbum?.shadowColor) {
      return `0px 0px 0px 0px ${selectedAlbum?.shadowColor},0.025),
     0px 5px 12px 0px ${selectedAlbum.shadowColor},0.25),
     0px 22px 22px 0px ${selectedAlbum.shadowColor},0.22),
     0px 49px 29px 0px ${selectedAlbum.shadowColor},0.13),
     0px 87px 35px 0px ${selectedAlbum.shadowColor},0.04),
     0px 136px 38px 0px ${selectedAlbum.shadowColor},0.00)`;
    }
    return undefined;
  }, [selectedAlbum?.shadowColor]);

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
    ["reviews", selectedAlbum?.id, session?.user.id],
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

  // Call both queries
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
    <div
      {...bind()}
      ref={scrollContainerRef}
      className="flex flex-col items-center rounded-[32px] z-0 w-full bg-white overflow-scroll scrollbar-none"
      // style={{
      //   boxShadow: boxShadow,
      // }}
    >
      {/* Section One / Album Art */}
      <div className="sticky top-0">
        <animated.div
          style={{
            transform: scale.to((value) => `scale(${value})`),
            paddingRight: scale.to((value) => `${(1 - value) * 148}px`),
            paddingTop: scale.to((value) => `${(1 - value) * 148}px`),
            transformOrigin: "right top", // scales towards the right
          }}
        >
          <animated.img
            style={{
              borderRadius: scale.to((value) => `${(1 - value) * 128}px`),
              boxShadow: boxShadow,
            }}
            src={selectedAlbum.artworkUrl}
            alt={`${selectedAlbum.attributes.name} artwork`}
            width={800}
            height={800}
            onDragStart={(e) => e.preventDefault()}
          />
          {/* Album Information  */}
          <div className="absolute left-8 bottom-8 flex flex-col gap-1 text-white tracking-tight">
            <div className="text-end ">
              {/* {selectedAlbum.attributes.artistName} */}
            </div>
            <button
              onClick={() => {
                setPages((prevPages) => [...prevPages, { name: "form" }]);
                bounce();
              }}
              className="font-bold text-2xl transition-all duration-300 hover:scale-105"
            >
              {/* + {selectedAlbum.attributes.name} */}
            </button>
          </div>
        </animated.div>
      </div>

      {/* Section Two / Entries  */}
      <div className="flex flex-col p-8 gap-8 relative w-full">
        {/* Stats  */}
        <div className="flex flex-col gap-8 p-2">
          <div className="flex items-center gap-8">
            {/* Stars  */}
            <div className="flex items-center gap-1">
              <div className="text-xl text-gray1 font-semibold">4.2</div>
              <StarsIcon width={24} height={24} color={"#777"} />
            </div>
            {/* Stats  */}
            <div className="flex items-center gap-4">
              {/* Play Count */}
              <div className="flex flex-col gap-1">
                <div className="text-xs text-gray1">+ heard by</div>
                <div className="font-semibold text-sm text-gray1 text-end">
                  400
                </div>
              </div>
              {/* Loved count */}
              <div className="flex flex-col gap-1">
                <div className="text-xs text-gray1">* loved by</div>
                <div className="font-semibold text-sm text-gray1 text-end">
                  20
                </div>
              </div>
            </div>
          </div>

          {/* Verdict Notes  */}
          <div className="text-sm text-gray1 w-[484px] line-clamp-3">
            With Nectar Jojis full metamorphosis from a meme-laden internet
            artist to a commendable musician takes flight. In a poignant
            exercise of introspection, the album unfurls like a lucid dream of
            melancholic electronica and R&B, veiled in lo-fi textures that waft
            over you like the scent of midnight cherry blossoms. Jojis voice, at
            once haunted and angelic, guides us through a labyrinth of his
            deepest emotions - a startling encounter with vulnerability that
            remains the albums spine. Notably, the production oscillates between
            sparse minimalism and rich, layered tapestries of sound, providing
            an auditory playground that keeps the listener tethered yet
            continually guessing. Joji dares to push his artistic boundaries in
            Nectar making it a poignant, disquietingly beautiful chronicle of
            human sentiment. In this body of work, the line between the
            sweetness of life (the nectar) and the stings of reality are
            blurred, leaving an aftertaste that lingers long after the music
            stops.
          </div>
        </div>

        {/* Album Entries  */}
        <div className="flex flex-col gap-6 overflow-visible h-full">
          {flattenedReviews && flattenedReviews.length > 0 ? (
            flattenedReviews.map((review) => {
              return (
                <div key={review.id}>
                  <EntryPreview key={review.id} review={review} />
                </div>
              );
            })
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
    </div>
  );
}
