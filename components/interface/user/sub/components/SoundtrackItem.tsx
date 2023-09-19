import { AlbumData } from "@/lib/global/interfaces";
import { useInterfaceContext } from "@/context/InterfaceContext";
import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import format from "date-fns/format";
import Stars from "@/components/global/Stars";
import Image from "next/image";

type SoundtrackItemProps = {
  albumData: AlbumData;
  rating: number;
  createdAt: string;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
};

const SoundtrackItem = ({
  albumData,
  rating,
  createdAt,
  containerRef,
}: SoundtrackItemProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1.2", "0 1"],
    // Bug, offset considers container at the top of the screen always So we
    // need to offset the offset
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
  const scaleSpring = useSpring(scale, { damping: 40, stiffness: 400 });

  const opacity = useTransform(modifiedProgress, [0, 1], [0, 1]);

  // Control the shadow using modifiedProgress, adjust the values as needed.
  const shadow = useTransform(
    modifiedProgress,
    [0, 1],
    [
      "0px 0px 0px 0px rgba(0,0,0,0)",
      "0px 8px 16px 0px rgba(0, 0, 0, 0.08),0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
    ],
  );

  const url = GenerateArtworkUrl(albumData.attributes.artwork.url, "800");

  console.log(containerRef);
  return (
    <div className="flex flex-col justify-between items-center snap-center gap-[30px] px-8 w-full relative">
      {/* Names */}
      <motion.div
        style={{
          opacity,
        }}
        className="flex gap-2 items-center w-fill"
      >
        <Stars
          className="bg-[#767680] bg-opacity-10 p-[6px] rounded-full flex items-center gap-1"
          rating={rating}
          color={"rgba(60, 60, 67, 0.6)"}
        />
        <div className="flex flex-col gap-[10px]">
          <div className="text-gray2 leading-none text-xs">
            {albumData.attributes.artistName}
          </div>
          <div className="text-gray2 leading-none text-sm">
            {albumData.attributes.name}
          </div>
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
          width={320}
          height={320}
          quality={100}
        />
      </motion.div>
    </div>
  );
};

export default SoundtrackItem;
