import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAlbumsByIds } from "@/lib/musicKit";
import { AlbumData } from "@/lib/interfaces";
import { SoundPreview } from "./sound/SoundPreview";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { useCMDK } from "@/context/CMDKContext";
import { useScrollPosition } from "@/hooks/useScrollPosition";

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
  const { pages } = useCMDK();

  const { scrollContainerRef, saveScrollPosition, restoreScrollPosition } =
    useScrollPosition();

  useEffect(restoreScrollPosition, [pages, restoreScrollPosition]);
  useEffect(saveScrollPosition, [pages, saveScrollPosition]);

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
