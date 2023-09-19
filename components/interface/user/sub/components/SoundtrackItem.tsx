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

  const url = GenerateArtworkUrl(albumData.attributes.artwork.url, "160");

  console.log(containerRef);
  return (
    <div className="flex justify-between items-start px-8 w-full">
      {/* Names & Rating */}
      <div className="flex gap-2 items-center">
        <Stars
          className="bg-[#767680] bg-opacity-10 p-[6px] rounded-full flex items-center gap-1"
          rating={rating}
          color={"rgba(60, 60, 67, 0.6)"}
        />
        <div className="flex flex-col gap-[2px]">
          <div className="text-gray2 leading-none text-xs w-[192px] line-clamp-1">
            {albumData.attributes.artistName}
          </div>
          <div className="text-gray2 leading-none text-sm w-[192px] line-clamp-1 font-medium">
            {albumData.attributes.name}
          </div>
        </div>
      </div>
      {/* Artwork */}
      <motion.div>
        <Image
          className="rounded-md"
          ref={ref}
          src={url || "/images/default.webp"}
          alt="artwork"
          width={65}
          height={64}
          quality={100}
        />
      </motion.div>
    </div>
  );
};

export default SoundtrackItem;
