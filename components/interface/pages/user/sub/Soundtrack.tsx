import { useQuery } from "@tanstack/react-query";
import { getAlbumsByIds } from "@/lib/global/musicKit";
import { AlbumData } from "@/lib/global/interfaces";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

type SoundData = {
  albumId: string;
  createdAt: string;
};

type SoundtrackProps = {
  sounds: SoundData[];
};

type SoundtrackItemProps = {
  albumData: AlbumData;
  containerRef: React.MutableRefObject<null>;
};

const SoundtrackItem = ({ albumData, containerRef }: SoundtrackItemProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 2.1", "0 1.61"],
    container: containerRef,
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.29, 1]);
  const scaleSpring = useSpring(scale);

  const url = GenerateArtworkUrl(albumData.attributes.artwork.url, "555");

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("Page scroll: ", latest);
  });

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-[6px]">
        <div className="text-black leading-3 text-sm">
          {albumData.attributes.name}
        </div>
        <div className="text-gray2 leading-3 text-xs">
          {albumData.attributes.artistName}
        </div>
      </div>
      <motion.div
        style={{
          display: "flex",
          scale: scaleSpring,
        }}
      >
        <Image
          ref={ref}
          className="rounded-[8px] shadow-md"
          src={url || "/images/default.webp"}
          alt="artwork"
          width={222}
          height={222}
          quality={100}
        />
      </motion.div>
    </div>
  );
};

const Soundtrack = ({ sounds }: SoundtrackProps) => {
  const containerRef = useRef(null);

  // Flatten the array of objects into an array of albumIds
  const albumIds = sounds.map((sound) => sound.albumId);
  const { data, isLoading } = useQuery(["albums", albumIds], () =>
    getAlbumsByIds(albumIds),
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full overflow-scroll h-full pt-[81px] px-8 pb-8 gap-8"
    >
      {data?.map((albumData: AlbumData, index: number) => (
        <SoundtrackItem
          key={albumData.id}
          albumData={albumData}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
};

export default Soundtrack;
