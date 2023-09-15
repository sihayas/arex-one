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
    offset: ["0 2.1", "0 1.2"], // Fine-tuned. Bug, offset considers container at the top of the screen always. So we need to offset the offset
    container: containerRef,
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
    stiffness: 400,
  });

  // Control the shadow using modifiedProgress, adjust the values as needed.
  const shadow = useTransform(
    modifiedProgress,
    [0, 1],
    ["0px 0px 0px 0px rgba(0,0,0,0)", "0px 1px 24px 0px rgba(0, 0, 0, 0.25)"],
  );

  const url = GenerateArtworkUrl(albumData.attributes.artwork.url, "555");

  return (
    <motion.div className="flex justify-between snap-center gap-4">
      {/* Names */}
      <motion.div
        style={{
          translateY: translateYSpring,
        }}
        className="flex flex-col gap-[6px] items-end w-fill"
      >
        <div className="text-black leading-3 text-sm">
          {albumData.attributes.name}
        </div>
        <div className="text-gray2 leading-3 text-xs">
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
          width={224}
          height={224}
          quality={100}
        />
      </motion.div>
    </motion.div>
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
      className="flex flex-col w-full overflow-scroll h-full pt-[81px] px-8 pb-8 snap-mandatory snap-y"
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
