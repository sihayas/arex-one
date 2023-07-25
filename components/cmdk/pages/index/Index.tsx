import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAlbumsByIds } from "@/lib/musicKit";
import { AlbumData } from "@/lib/interfaces";
import { SoundPreview } from "./sound/SoundPreview";
import { useCMDK } from "@/context/CMDKContext";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { SpotlightIcon, BloomIcon } from "@/components/icons";
import Button from "./sound/Button";
import { useState } from "react";

type TransformFn = (data: any[]) => any;

const useData = (
  keyPrefix: string,
  endpoint: string,
  page: number,
  transformFn: TransformFn
) => {
  // Grab data from server
  const idsQuery = useQuery([`${keyPrefix}Ids`, page], async () => {
    const { data } = await axios.get(`/api/index/${endpoint}?page=${page}`);
    return data;
  });

  // Pull detailed data based on IDs
  const detailsQuery = useQuery(
    [`${keyPrefix}Details`, idsQuery.data || []],
    () => transformFn(idsQuery.data || []),
    {
      enabled: !!idsQuery.data?.length,
    }
  );

  return { idsQuery, detailsQuery };
};

export default function Index() {
  const { pages } = useCMDK();

  // Button state handlers
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

  const { scrollContainerRef, saveScrollPosition, restoreScrollPosition } =
    useScrollPosition();

  // useEffect(restoreScrollPosition, [pages, restoreScrollPosition]);
  // useEffect(saveScrollPosition, [pages, saveScrollPosition]);

  const {
    idsQuery: trendingAlbumIdsQuery,
    detailsQuery: trendingAlbumDetailsQuery,
  } = useData("trendingAlbums", "getTrendingAlbums", 1, getAlbumsByIds);

  const {
    idsQuery: trendingEntryIdsQuery,
    detailsQuery: trendingEntryDetailsQuery,
  } = useData("trendingEntries", "getTrendingEntries", 1, (ids: String[]) =>
    axios.post("/api/review/getByIds", {
      ids: ids,
    })
  );

  const {
    idsQuery: bloomingAlbumIdsQuery,
    detailsQuery: bloomingAlbumDetailsQuery,
  } = useData("bloomingAlbums", "getBloomingAlbums", 1, getAlbumsByIds);

  const {
    idsQuery: bloomingEntryIdsQuery,
    detailsQuery: bloomingEntryDetailsQuery,
  } = useData("bloomingEntries", "getBloomingEntries", 1, (ids: String[]) =>
    axios.post("/api/review/getByIds", {
      ids: ids,
    })
  );

  const isLoading =
    trendingAlbumIdsQuery.isLoading ||
    trendingEntryIdsQuery.isLoading ||
    bloomingAlbumIdsQuery.isLoading ||
    bloomingEntryIdsQuery.isLoading ||
    trendingAlbumDetailsQuery.isLoading ||
    trendingEntryDetailsQuery.isLoading ||
    bloomingAlbumDetailsQuery.isLoading ||
    bloomingEntryDetailsQuery.isLoading;

  const isError =
    trendingAlbumIdsQuery.isError ||
    trendingAlbumIdsQuery.isError ||
    bloomingAlbumIdsQuery.isError ||
    bloomingEntryIdsQuery.isError ||
    trendingAlbumDetailsQuery.isError ||
    trendingEntryDetailsQuery.isError ||
    bloomingAlbumDetailsQuery.isError ||
    bloomingEntryDetailsQuery.isError;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong: </div>;
  }

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
        trendingAlbumDetailsQuery.data.map(
          (album: AlbumData, index: number) => (
            <SoundPreview key={album.id} album={album} index={index + 1} />
          )
        )}

      {activeState.button === "spotlight" &&
        activeState.subButtons.spotlight === "text" &&
        trendingEntryDetailsQuery.data.map(/* ... */)}

      {activeState.button === "bloom" &&
        activeState.subButtons.bloom === "sound" &&
        bloomingAlbumDetailsQuery.data.map(/* ... */)}

      {activeState.button === "bloom" &&
        activeState.subButtons.bloom === "text" &&
        bloomingEntryDetailsQuery.data.map(/* ... */)}
    </div>
  );
}
