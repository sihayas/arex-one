import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAlbumsByIds } from "@/lib/musicKit";
import { AlbumData, ReviewData } from "@/lib/interfaces";
import { SoundPreview } from "./sound/SoundPreview";
import { useCMDK } from "@/context/CMDKContext";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { SpotlightIcon, BloomIcon } from "@/components/icons";
import Button from "./sound/Button";
import { useState } from "react";
import { EntryPreview } from "./entry/EntryPreview";
export const useTrendingAlbumsDetails = (page: number) => {
  // Grab trending albums from redis
  const albumIdsQuery = useQuery(["trendingAlbums", page], async () => {
    const { data } = await axios.get(
      `/api/index/getTrendingAlbums?page=${page}`
    );
    return data;
  });

  // Pull album data from Apple
  const albumDetailsQuery = useQuery(
    ["albumDetails", albumIdsQuery.data || []],
    () => getAlbumsByIds(albumIdsQuery.data || []),
    {
      enabled: !!albumIdsQuery.data?.length, // Only run the query if 'albumIds' is not an empty array
    }
  );

  return { albumIdsQuery, albumDetailsQuery };
};

export const useBloomingAlbumsDetails = (page: number) => {
  // Grab trending albums from redis
  const bloomingAlbumIdsQuery = useQuery(["bloomingAlbums", page], async () => {
    const { data } = await axios.get(
      `/api/index/getBloomingAlbums?page=${page}`
    );
    return data;
  });

  // Pull album data from Apple
  const bloomingAlbumDetailsQuery = useQuery(
    ["albumDetails", bloomingAlbumIdsQuery.data || []],
    () => getAlbumsByIds(bloomingAlbumIdsQuery.data || []),
    {
      enabled: !!bloomingAlbumIdsQuery.data?.length, // Only run the query if 'albumIds' is not an empty array
    }
  );

  return { bloomingAlbumIdsQuery, bloomingAlbumDetailsQuery };
};

export const useTrendingEntryDetails = (page: number) => {
  // Grab trending albums from redis
  const entryIdsQuery = useQuery(["trendingEntries", page], async () => {
    const { data } = await axios.get(
      `/api/index/getTrendingEntries?page=${page}`
    );
    return data;
  });

  // Pull review data from DB with ID
  const entryDetailsQuery = useQuery(
    ["entryDetails", entryIdsQuery.data || []],
    async () => {
      const { data } = await axios.post("/api/review/getByIds", {
        ids: entryIdsQuery.data,
      });
      return data;
    },
    {
      enabled: !!entryIdsQuery.data?.length, // Only run the query if 'entryId's' is not an empty array
    }
  );

  return { entryDetailsQuery, entryIdsQuery };
};

export const useBloomingEntryDetails = (page: number) => {
  // Grab trending albums from redis
  const bloomingEntryIdsQuery = useQuery(
    ["bloomingEntries", page],
    async () => {
      const { data } = await axios.get(
        `/api/index/getBloomingEntries?page=${page}`
      );
      return data;
    }
  );

  // Pull review data from DB with ID
  const bloomingEntryDetailsQuery = useQuery(
    ["entryDetails", bloomingEntryIdsQuery.data || []],
    async () => {
      const { data } = await axios.post("/api/review/getByIds", {
        ids: bloomingEntryIdsQuery.data,
      });
      return data;
    },
    {
      enabled: !!bloomingEntryIdsQuery.data?.length, // Only run the query if 'entryId's' is not an empty array
    }
  );

  return { bloomingEntryIdsQuery, bloomingEntryDetailsQuery };
};

export default function Index() {
  const { pages } = useCMDK();
  const [activeState, setActiveState] = useState({
    button: "",
    subButtons: { spotlight: "sound", bloom: "sound" },
  });

  const setButtonState = (button: string, subButton: string) => {
    setActiveState({
      button,
      subButtons: {
        ...activeState.subButtons,
        [button]: subButton,
      },
    });
  };

  const { scrollContainerRef, saveScrollPosition, restoreScrollPosition } =
    useScrollPosition();

  // useEffect(restoreScrollPosition, [pages, restoreScrollPosition]);
  // useEffect(saveScrollPosition, [pages, saveScrollPosition]);

  const { albumIdsQuery, albumDetailsQuery } = useTrendingAlbumsDetails(1);
  const { entryIdsQuery, entryDetailsQuery } = useTrendingEntryDetails(1);
  const { bloomingAlbumIdsQuery, bloomingAlbumDetailsQuery } =
    useBloomingAlbumsDetails(1);
  const { bloomingEntryIdsQuery, bloomingEntryDetailsQuery } =
    useBloomingEntryDetails(1);

  const isLoading =
    (albumIdsQuery.isLoading &&
      entryIdsQuery.isLoading &&
      bloomingAlbumIdsQuery.isLoading &&
      bloomingEntryIdsQuery) ||
    (albumDetailsQuery.isLoading &&
      entryDetailsQuery.isLoading &&
      bloomingAlbumDetailsQuery.isLoading &&
      bloomingEntryDetailsQuery.isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(
    albumDetailsQuery.data,
    entryDetailsQuery.data,
    bloomingAlbumDetailsQuery.data,
    bloomingEntryDetailsQuery.data
  );

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col bg-white w-full h-full rounded-[32px] border border-silver overflow-scroll items-end p-8 scrollbar-none gap-4"
    >
      <div className="absolute left-8 top-8 flex flex-col gap-4">
        <Button
          IconComponent={SpotlightIcon}
          defaultText="SPOTLIGHT"
          activeText={activeState.subButtons.spotlight}
          isActive={activeState.button === "spotlight"}
          onClick={() =>
            setButtonState("spotlight", activeState.subButtons.spotlight)
          }
          onSubButtonClick={(subButton) =>
            setButtonState("spotlight", subButton)
          }
        />

        <Button
          IconComponent={BloomIcon}
          defaultText="IN BLOOM"
          activeText={activeState.subButtons.bloom}
          isActive={activeState.button === "bloom"}
          onClick={() => setButtonState("bloom", activeState.subButtons.bloom)}
          onSubButtonClick={(subButton) => setButtonState("bloom", subButton)}
        />
      </div>
      {activeState.button === "spotlight" &&
        activeState.subButtons.spotlight === "sound" &&
        albumDetailsQuery.data.map((album: AlbumData, index: number) => (
          <SoundPreview key={album.id} album={album} index={index + 1} />
        ))}

      {activeState.button === "spotlight" &&
        activeState.subButtons.spotlight === "text" &&
        entryDetailsQuery.data.map((entry: ReviewData, index: number) => (
          <EntryPreview key={entry.id} entry={entry} index={index + 1} />
        ))}
      {/* 
      {activeState.button === "bloom" &&
        activeState.subButtons.bloom === "sound" &&
        bloomingAlbumDetailsQuery.data.map(
          (album: AlbumData, index: number) => (
            <SoundPreview key={album.id} album={album} index={index + 1} />
          )
        )} */}

      {/* {activeState.button === "bloom" &&
        activeState.subButtons.bloom === "entry" &&
        bloomingEntryDetailsQuery.data.map(
          (entry: EntryData, index: number) => (
            <EntryPreview key={entry.id} entry={entry} index={index + 1} />
          )
        )} */}
    </div>
  );
}
