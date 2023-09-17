import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/global/musicKit";
import { AlbumData } from "@/lib/global/interfaces";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import Image from "next/image";
import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { getSoundtrack } from "@/lib/api/userAPI";
import Stars from "@/components/global/Stars";
import format from "date-fns/format";
import { useInterfaceContext } from "@/context/InterfaceContext";

type SoundtrackData = {
  albumId: string;
  createdAt: string;
  rating: number;
};
type ExtendedSoundtrackData = SoundtrackData & {
  albumDetails: AlbumData;
};

type SoundtrackItemProps = {
  albumData: AlbumData; // existing album data
  rating: number; // new field for rating
  createdAt: string; // new field for created date
};

const SoundtrackItem = ({
  albumData,
  rating,
  createdAt,
}: SoundtrackItemProps) => {
  const { scrollContainerRef } = useInterfaceContext();

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 2.3", "0 1.2"],
    // Bug, offset considers container at the top of the screen always. So we need to offset the offset
    container: scrollContainerRef,
  });

  // Plays the animation in reverse when exiting the offset
  const modifiedProgress = useTransform(scrollYProgress, (latest) => {
    if (latest <= 0.5) {
      return 2 * latest;
    } else {
      return 2 * (1 - latest);
    }
  });

  // Use modifiedProgress to control the scale
  const scale = useTransform(modifiedProgress, [0, 1], [0.857, 1]);
  const scaleSpring = useSpring(scale, { damping: 45, stiffness: 400 });

  // Use modifiedProgress to control the translateY
  const translateY = useTransform(modifiedProgress, [0, 1], [0, 100]);
  const translateYSpring = useSpring(translateY, {
    damping: 55,
    stiffness: 600,
  });

  // Control the shadow using modifiedProgress, adjust the values as needed.
  const shadow = useTransform(
    modifiedProgress,
    [0, 1],
    [
      "0px 0px 0px 0px rgba(0,0,0,0)",
      "0px 8px 16px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
    ],
  );

  const url = GenerateArtworkUrl(albumData.attributes.artwork.url, "720");

  return (
    <motion.div className="flex justify-between snap-center gap-4 p-8 py-0">
      {/* Names */}
      <motion.div
        style={{
          translateY: translateYSpring,
        }}
        className="flex flex-col gap-[6px] items-end w-fill"
      >
        <div className="flex items-center gap-2 text-sm text-gray2">
          {format(new Date(createdAt), "MM.yy")}
          <Stars
            className="bg-[#767680] bg-opacity-10 p-[6px] rounded-full flex items-center gap-1"
            rating={rating}
            color={"rgba(60, 60, 67, 0.6)"}
          />
        </div>

        <div className="text-black leading-3 text-sm pt-2 pr-[38px]">
          {albumData.attributes.name}
        </div>
        <div className="text-gray2 leading-3 text-xs  pr-[38px]">
          {albumData.attributes.artistName}
        </div>
      </motion.div>
      {/* Artwork */}
      <motion.div
        style={{
          display: "flex",
          scale: scaleSpring,
          flexShrink: 0,
          boxShadow: shadow,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Image
          ref={ref}
          src={url || "/images/default.webp"}
          alt="artwork"
          width={280}
          height={280}
          quality={100}
        />
      </motion.div>
    </motion.div>
  );
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
