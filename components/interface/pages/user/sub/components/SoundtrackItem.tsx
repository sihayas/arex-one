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
    offset: ["0 1.7", "0 1"],
    // Bug, offset considers container at the top of the screen always So we
    // need to offset the offset
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

  const url = GenerateArtworkUrl(albumData.attributes.artwork.url, "720");

  return (
    <div className="flex justify-between items-center snap-center gap-4 px-8 py-0 w-full">
      {/* Names */}
      <motion.div
        style={{
          opacity,
        }}
        className="flex flex-col gap-[6px] items-end w-fill"
      >
        {/* Date and Rating */}
        <div className="flex items-center gap-2 text-sm text-gray2">
          {format(new Date(createdAt), "MM.yy")}
          <Stars
            className="bg-[#767680] bg-opacity-10 p-[6px] rounded-full flex items-center gap-1"
            rating={rating}
            color={"rgba(60, 60, 67, 0.6)"}
          />
        </div>

        <div className="text-black leading-3 text-sm pt-2 pr-[30px]">
          {albumData.attributes.name}
        </div>
        <div className="text-gray2 leading-3 text-xs  pr-[30px]">
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
    </div>
  );
};

export default SoundtrackItem;
