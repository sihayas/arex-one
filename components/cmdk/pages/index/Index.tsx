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

export const useFetchSpotlightAlbums = (page: number) => {
  // Grab trending albums from redis
  const spotlightAlbumsQuery = useQuery(["spotlightAlbums", page], async () => {
    const { data } = await axios.get(
      `/api/index/getSpotlightAlbums?page=${page}`
    );
    return data;
  });

  // Pull album data from Apple
  const spotlightAlbumsDataQuery = useQuery(
    ["albumDetails", spotlightAlbumsQuery.data || []],
    () => getAlbumsByIds(spotlightAlbumsQuery.data || []),
    {
      enabled: !!spotlightAlbumsQuery.data?.length, // Only run the query if 'albumIds' is not an empty array
    }
  );

  return { spotlightAlbumsQuery, spotlightAlbumsDataQuery };
};

export const useFetchSpotlightEntries = (page: number) => {
  // Grab trending entries from redis
  const spotlightEntriesQuery = useQuery(
    ["spotlightEntries", page],
    async () => {
      const { data } = await axios.get(
        `/api/index/getSpotlightEntries?page=${page}`
      );
      return data;
    }
  );

  // Pull review data from DB with ID
  const spotlightEntriesDataQuery = useQuery(
    ["entryDetails", spotlightEntriesQuery.data || []],
    async () => {
      const { data } = await axios.post("/api/review/getByIds", {
        ids: spotlightEntriesQuery.data,
      });
      return data;
    },
    {
      enabled: !!spotlightEntriesQuery.data?.length, // Only run the query if 'entryId's' is not an empty array
    }
  );

  return { spotlightEntriesDataQuery, spotlightEntriesQuery };
};

export const useFetchBloomingAlbums = (page: number) => {
  // Grab blooming albums from redis
  const bloomingAlbumsQuery = useQuery(["bloomingAlbums", page], async () => {
    const { data } = await axios.get(
      `/api/index/getBloomingAlbums?page=${page}`
    );
    return data;
  });

  // Pull album data from Apple
  const bloomingAlbumsDataQuery = useQuery(
    ["albumDetails", bloomingAlbumsQuery.data || []],
    () => getAlbumsByIds(bloomingAlbumsQuery.data || []),
    {
      enabled: !!bloomingAlbumsQuery.data?.length, // Only run the query if 'albumIds' is not an empty array
    }
  );

  return { bloomingAlbumsQuery, bloomingAlbumsDataQuery };
};

export const useFetchBloomingEntries = (page: number) => {
  // Grab blooming entries from redis
  const bloomingEntriesQuery = useQuery(["bloomingEntries", page], async () => {
    const { data } = await axios.get(
      `/api/index/getBloomingEntries?page=${page}`
    );
    return data;
  });

  // Pull review data from DB with ID
  const bloomingEntriesDataQuery = useQuery(
    ["entryDetails", bloomingEntriesQuery.data || []],
    async () => {
      const { data } = await axios.post("/api/review/getByIds", {
        ids: bloomingEntriesQuery.data,
      });
      return data;
    },
    {
      enabled: !!bloomingEntriesQuery.data?.length, // Only run the query if 'entryId's' is not an empty array
    }
  );

  return { bloomingEntriesQuery, bloomingEntriesDataQuery };
};

export default function Index() {
  const { pages } = useCMDK();
  const { scrollContainerRef, saveScrollPosition, restoreScrollPosition } =
    useScrollPosition();

  const [activeState, setActiveState] = useState({
    button: "spotlight",
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

  // useEffect(restoreScrollPosition, [pages, restoreScrollPosition]);
  // useEffect(saveScrollPosition, [pages, saveScrollPosition]);

  const { spotlightAlbumsQuery, spotlightAlbumsDataQuery } =
    useFetchSpotlightAlbums(1);
  const { spotlightEntriesQuery, spotlightEntriesDataQuery } =
    useFetchSpotlightEntries(1);
  const { bloomingAlbumsQuery, bloomingAlbumsDataQuery } =
    useFetchBloomingAlbums(1);
  const { bloomingEntriesQuery, bloomingEntriesDataQuery } =
    useFetchBloomingEntries(1);

  const isLoading =
    (spotlightAlbumsQuery.isLoading &&
      spotlightEntriesQuery.isLoading &&
      bloomingAlbumsQuery.isLoading &&
      bloomingEntriesQuery) ||
    (spotlightAlbumsDataQuery.isLoading &&
      spotlightEntriesDataQuery.isLoading &&
      bloomingAlbumsDataQuery.isLoading &&
      bloomingEntriesDataQuery.isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col bg-white w-full h-full rounded-[32px] border border-silver overflow-scroll items-end p-8 scrollbar-none"
    >
      <div className="absolute right-8 top-8 flex flex-col items-end gap-4">
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
        spotlightAlbumsDataQuery.data.map((album: AlbumData, index: number) => (
          <SoundPreview key={album.id} album={album} index={index + 1} />
        ))}

      {activeState.button === "spotlight" &&
        activeState.subButtons.spotlight === "text" &&
        spotlightEntriesDataQuery.data.map(
          (entry: ReviewData, index: number) => (
            <EntryPreview key={entry.id} entry={entry} index={index + 1} />
          )
        )}

      {activeState.button === "bloom" &&
        activeState.subButtons.bloom === "sound" &&
        bloomingAlbumsDataQuery.data.map((album: AlbumData, index: number) => (
          <SoundPreview key={album.id} album={album} index={index + 1} />
        ))}

      {activeState.button === "bloom" &&
        activeState.subButtons.bloom === "text" &&
        bloomingEntriesDataQuery.data.map(
          (entry: ReviewData, index: number) => (
            <EntryPreview key={entry.id} entry={entry} index={index + 1} />
          )
        )}
    </div>
  );
}
