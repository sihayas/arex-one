// Fetches user sound history.
import React, { Fragment, useRef } from "react";

import { useQuery } from "@tanstack/react-query";
import { fetchSoundsByTypes } from "@/lib/global/musicKit";
import { AlbumData, SongData } from "@/types/appleTypes";
import { getSoundtrack } from "@/lib/api/userAPI";

import SoundtrackRecord from "./components/SoundtrackRecord";
import format from "date-fns/format";
import { Record } from "@/types/dbTypes";
import { JellyComponent } from "@/components/global/Loading";

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

    // Extract albumIds and trackIds
    const albumIds = soundtrackData
      .filter((record: Record): boolean => Boolean(record.album))
      .map((record: Record): string => record.album!.appleId);

    const trackIds = soundtrackData
      .filter((record: Record): boolean => Boolean(record.track))
      .map((record: Record): string => record.track!.appleId);

    // Fetch albums and tracks by ids
    const idTypes = { albums: albumIds, songs: trackIds };
    const anyData = await fetchSoundsByTypes(idTypes);

    // Create lookup tables for quick access
    const albumLookup = Object.fromEntries(
      anyData
        .filter((item: AlbumData | SongData) => item.type === "albums")
        .map((album: AlbumData) => [album.id, album])
    );

    const trackLookup = Object.fromEntries(
      anyData
        .filter((item: AlbumData | SongData) => item.type === "songs")
        .map((track: SongData) => [track.id, track])
    );

    // Merge soundtrackData, albumData, and trackData
    const finalMergedData = soundtrackData.map((item: Record) => {
      return {
        ...item,
        appleAlbumData: item.album ? albumLookup[item.album.appleId] : null,
        appleTrackData: item.track ? trackLookup[item.track.appleId] : null,
      };
    });
    return finalMergedData;
  });

  let lastMonth = "";
  return (
    <div
      ref={containerRef}
      className="flex flex-col w-1/2 overflow-scroll h-full pt-8 gap-4"
    >
      {isLoading ? (
        <JellyComponent
          className={
            "absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2"
          }
          key="jelly"
          isVisible={true}
        />
      ) : isError ? (
        <p>An error occurred</p>
      ) : (
        mergedData.map((record: Record, index: number) => {
          const createdAt = new Date(record.createdAt);
          const currentMonth = format(createdAt, "MMMM"); // Using date-fns to format

          const isNewMonth = lastMonth !== currentMonth;

          if (isNewMonth) {
            lastMonth = currentMonth;
          }

          return (
            <Fragment key={record.albumId}>
              {isNewMonth && (
                <h2 className="px-8 text-xs uppercase font-medium text-gray3 -mb-4 tracking-widest">
                  {currentMonth}
                </h2>
              )}
              <SoundtrackRecord
                record={record}
                associatedType={record.album ? "album" : "song"}
              />
            </Fragment>
          );
        })
      )}
    </div>
  );
};

export default Soundtrack;
