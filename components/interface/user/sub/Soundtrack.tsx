// Fetches user sound history.
import React, { Fragment, useRef } from "react";

import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/global/musicKit";
import { AlbumData } from "@/lib/global/interfaces";
import { getSoundtrack } from "@/lib/api/userAPI";

import Item from "./components/Item";
import format from "date-fns/format";

type SoundtrackData = {
  albumId: string;
  createdAt: string;
  rating: number;
};
type ExtendedSoundtrackData = SoundtrackData & {
  albumDetails: AlbumData;
};

const Soundtrack = ({ userId }: { userId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  let lastMonth = "";
  return (
    <div
      ref={containerRef}
      className="flex flex-col w-1/2 overflow-scroll h-full pt-8 gap-4"
    >
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>An error occurred</p>
      ) : (
        mergedData.map((item: ExtendedSoundtrackData, index: number) => {
          const createdAt = new Date(item.createdAt);
          const currentMonth = format(createdAt, "MMMM"); // Using date-fns to format

          const isNewMonth = lastMonth !== currentMonth;

          if (isNewMonth) {
            lastMonth = currentMonth;
          }

          return (
            <Fragment key={item.albumId}>
              {isNewMonth && (
                <h2 className="px-8 text-xs uppercase font-medium text-gray2 -mb-4">
                  {currentMonth}
                </h2>
              )}
              <Item
                rating={item.rating}
                createdAt={item.createdAt}
                albumData={item.albumDetails}
              />
            </Fragment>
          );
        })
      )}
    </div>
  );
};

export default Soundtrack;
