import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAlbumsByIds } from "@/lib/musicKit";
import { AlbumData } from "@/lib/interfaces";
import { SoundPreview } from "./sound/SoundPreview";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { useCMDK } from "@/context/CMDKContext";

export const useTrendingAlbumsDetails = (page: number) => {
  const albumIdsQuery = useQuery(["trendingAlbums", page], async () => {
    const { data } = await axios.get(
      `/api/index/getTrendingAlbums?page=${page}`
    );
    return data;
  });

  const albumDetailsQuery = useQuery(
    ["albumDetails", albumIdsQuery.data || []],
    () => getAlbumsByIds(albumIdsQuery.data || []),
    {
      enabled: !!albumIdsQuery.data?.length, // Only run the query if 'albumIds' is not an empty array
    }
  );

  return { albumIdsQuery, albumDetailsQuery };
};

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { setPages, pages } = useCMDK();

  const handleScroll = debounce(() => {
    const currentScrollPosition = scrollContainerRef.current?.scrollTop;
    setPages((prevPages) => {
      const currentPage = { ...prevPages[prevPages.length - 1] };
      currentPage.scrollPosition = currentScrollPosition;
      return [...prevPages.slice(0, -1), currentPage];
    });
  }, 100); // Delay scroll position update to prevent lag.

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const currentPage = pages[pages.length - 1];

    if (scrollContainer && currentPage.scrollPosition) {
      scrollContainer.scrollTop = currentPage.scrollPosition;
    }
  }, [pages]);

  const { albumIdsQuery, albumDetailsQuery } = useTrendingAlbumsDetails(1);

  const isLoading = albumIdsQuery.isLoading || albumDetailsQuery.isLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(albumDetailsQuery.data);

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col bg-white w-full h-full rounded-[32px] border border-silver overflow-scroll items-end p-8 scrollbar-none gap-4"
    >
      {albumDetailsQuery.data.map((album: AlbumData) => (
        <SoundPreview key={album.id} {...album} />
      ))}
    </div>
  );
}
