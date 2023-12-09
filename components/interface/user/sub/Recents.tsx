import React from "react";
import { Artwork } from "@/components/global/Artwork";
import { Artifact } from "@/types/dbTypes";
import { motion } from "framer-motion";
import Stars from "@/components/global/Stars";
import ArtworkURL from "@/components/global/ArtworkURL";
import Image from "next/image";

interface RecentsProps {
  artifacts: Artifact[];
}

const Recents: React.FC<RecentsProps> = ({ artifacts }) => {
  return (
    <motion.div
      className={`flex items-center mt-[23px] px-8 gap-6 w-full scrollbar-none `}
    >
      {artifacts.map((artifact, i) => {
        const sound = artifact.appleData;
        const url = ArtworkURL(sound.attributes.artwork.url, "1200");
        const name = sound.attributes.name;

        return (
          <div
            key={artifact.id}
            className="min-w-[64px] relative overflow-visible"
          >
            <Image
              className={`rounded-xl`}
              src={url}
              alt={`${name}'s artwork`}
              width={512}
              height={512}
              quality={100}
            />

            {/* Stars */}
            <div className="absolute bg-white -top-1 -left-1 flex items-center p-2 rounded-full w-max z-10 gap-2 shadow-shadowKitMedium">
              <Stars rating={artifact.content?.rating} />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default Recents;
