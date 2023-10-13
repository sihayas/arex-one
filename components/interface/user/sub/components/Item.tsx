import { AlbumData } from "@/lib/global/interfaces";
import { useInterfaceContext } from "@/context/InterfaceContext";
import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import GenerateArtworkUrl from "@/components/global/GenerateArtworkUrl";
import format from "date-fns/format";
import Stars from "@/components/global/Stars";
import Image from "next/image";

type ItemProps = {
  albumData: AlbumData;
  rating: number;
  createdAt: string;
};

const Item = ({ albumData, rating, createdAt }: ItemProps) => {
  const ref = useRef(null);

  const url = GenerateArtworkUrl(albumData.attributes.artwork.url, "160");

  return (
    <div className="flex justify-between items-center px-8 w-full">
      {/* Names & Rating */}
      <div className="flex gap-2 items-center">
        <Stars
          className="bg-[#767680] bg-opacity-10 p-[6px] rounded-full flex items-center gap-1 border border-lightSilver"
          rating={rating}
        />
        <div className="flex flex-col items-end gap-[6px]">
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
          className="rounded-[8px] border border-silver"
          ref={ref}
          src={url}
          alt="artwork"
          width={64}
          height={64}
          quality={100}
        />
      </motion.div>
    </div>
  );
};

export default Item;
