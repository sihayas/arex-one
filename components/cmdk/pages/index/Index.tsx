import { AlbumData } from "@/lib/global/interfaces";
import { SoundPreview } from "./subcomponents/SoundPreview";
import { useScrollPosition } from "@/hooks/handleInteractions/useScrollPosition";
import Button from "./subcomponents/Button";
import { useState } from "react";
import {
  useFetchSpotlightAlbums,
  useFetchBloomingAlbums,
} from "@/lib/api/indexAPI";

const Album = () => {
  const { scrollContainerRef, saveScrollPosition, restoreScrollPosition } =
    useScrollPosition();

  const [activeState, setActiveState] = useState({ button: "spotlight" });

  // useEffect(restoreScrollPosition, [pages, restoreScrollPosition]);
  // useEffect(saveScrollPosition, [pages, saveScrollPosition]);

  const { spotlightAlbumsQuery, spotlightAlbumsDataQuery } =
    useFetchSpotlightAlbums(1);
  const { bloomingAlbumsQuery, bloomingAlbumsDataQuery } =
    useFetchBloomingAlbums(1);

  const isLoading =
    (spotlightAlbumsQuery.isLoading && bloomingAlbumsQuery.isLoading) ||
    (spotlightAlbumsDataQuery.isLoading && bloomingAlbumsDataQuery.isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col w-full h-full items-center justify-center rounded-[20px] pb-8"
    >
      {/* <div className="absolute right-8 top-8 flex flex-col items-end gap-4">
        <Button
          defaultText="SPOTLIGHT"
          type="album"
          isActive={activeState.button === "spotlight"}
          onClick={() => setActiveState({ button: "spotlight" })}
        />
        <Button
          defaultText="IN BLOOM"
          type="album"
          isActive={activeState.button === "bloom"}
          onClick={() => setActiveState({ button: "bloom" })}
        />
      </div> */}
      {activeState.button === "spotlight" &&
        spotlightAlbumsDataQuery.data.map((album: AlbumData, index: number) => (
          <SoundPreview key={album.id} album={album} index={index + 1} />
        ))}
      {activeState.button === "bloom" &&
        bloomingAlbumsDataQuery.data.map((album: AlbumData, index: number) => (
          <SoundPreview key={album.id} album={album} index={index + 1} />
        ))}
    </div>
  );
};

export default Album;
