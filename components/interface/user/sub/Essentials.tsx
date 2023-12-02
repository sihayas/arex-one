import React from "react";
import { Artwork } from "@/components/global/Artwork";
import { Essential } from "@/types/dbTypes";
import { motion } from "framer-motion";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  return (
    <motion.div
      className={`flex flex-col items-center rounded-b-2xl shadow-shadowKitLow h-fit absolute right-8 top-0 z-20`}
    >
      {essentials.map((essential, i) => (
        <Artwork
          className={`outline outline-1 outline-silver  ${
            i === 2 && "rounded-b-2xl"
          }`}
          sound={essential.appleAlbumData}
          width={192}
          height={192}
          key={essential.id}
        />
      ))}
    </motion.div>
  );
};

export default Essentials;
