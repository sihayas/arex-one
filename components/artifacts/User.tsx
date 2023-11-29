import React, { useRef } from "react";
import ArtworkURL from "@/components/global/ArtworkURL";
import Stars from "@/components/global/Stars";
import Image from "next/image";
import { Artifact } from "@/types/dbTypes";

type UserProps = {
  artifact: Artifact;
};

const User = ({ artifact }: UserProps) => {
  const ref = useRef(null);
  const isAlbum = artifact.sound.type === "albums";
  const soundData = isAlbum ? artifact.appleData : artifact.appleData;
  if (!soundData) return null;

  return (
    <div className="flex justify-between items-center px-8 w-full">
      {/* Names & Rating */}
      <div className="flex gap-2 items-center">
        <Stars
          className="bg-[#767680] bg-opacity-10 p-[6px] rounded-full flex items-center gap-1 border border-lightSilver"
          rating={artifact.content?.rating}
        />
        <div className="flex flex-col items-end gap-[6px]">
          <div className="text-gray2 leading-none text-xs w-[192px] line-clamp-1">
            {soundData.attributes.artistName}
          </div>
          <div className="text-gray2 leading-none text-sm w-[192px] line-clamp-1 font-medium">
            {soundData.attributes.name}
          </div>
        </div>
      </div>
      {/* Artwork */}
      <Image
        className="rounded-[8px] border border-silver"
        ref={ref}
        src={
          isAlbum
            ? ArtworkURL(artifact.appleData.attributes.artwork.url, "160")
            : ArtworkURL(artifact.appleData.attributes.artwork.url, "160")
        }
        alt="artwork"
        width={64}
        height={64}
        quality={100}
      />
    </div>
  );
};

export default User;
