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
      className={`flex flex-col px-2 pb-8 bg-[#E4E4E4] items-center rounded-b-2xl shadow-shadowKitMedium h-fit`}
    >
      {essentials.map((essential, i) => (
        <div
          className={`w-fit h-fit overflow-hidden ${
            i === 2 && "rounded-b-2xl"
          }`}
          key={essential.id}
        >
          <Artwork sound={essential.appleAlbumData} width={176} height={176} />
        </div>
      ))}
      {/*<div className={`relative`}>*/}
      {/*  <p*/}
      {/*    className={`absolute leading-[9px] text-xs text-gray5 uppercase left-1/2 -translate-x-1/2 top-3`}*/}
      {/*  >*/}
      {/*    essentials*/}
      {/*  </p>*/}
      {/*</div>*/}
    </motion.div>
  );
};

export default Essentials;
