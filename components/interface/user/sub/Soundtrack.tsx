// Fetches user sound history.
import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/global/musicKit";
import { AlbumData } from "@/lib/global/interfaces";
import { getSoundtrack } from "@/lib/api/userAPI";

import SoundtrackItem from "./components/SoundtrackItem";

type SoundtrackData = {
  albumId: string;
  createdAt: string;
  rating: number;
};
type ExtendedSoundtrackData = SoundtrackData & {
  albumDetails: AlbumData;
};

const Soundtrack = ({ userId }: { userId: string }) => {
  const {
    data: mergedData,
    isLoading,
    isError,
  } = useQuery(["mergedData", userId], async () => {
    // Fetch soundtrack data
    const soundtrackData = await getSoundtrack(userId);

    // Extract albumIds
    const albumIds = soundtrackData.map((item: SoundtrackData) => item.albumId);

    // Fetch albums by ids
    const albumData = await getAlbumsByIds(albumIds);

    // Create a lookup table for quick access
    const albumLookup = Object.fromEntries(
      albumData.map((album: AlbumData) => [album.id, album]),
    );

    // Merge soundtrackData and albumData
    return soundtrackData.map((item: SoundtrackData) => {
      return {
        ...item,
        albumDetails: albumLookup[item.albumId],
      };
    });
  });

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>An error occurred</p>
      ) : (
        mergedData.map((item: ExtendedSoundtrackData) => (
          <SoundtrackItem
            key={item.albumId}
            rating={item.rating}
            createdAt={item.createdAt}
            albumData={item.albumDetails}
          />
        ))
      )}
    </>
  );
};

export default Soundtrack;
