import React from "react";
import { Artwork } from "@/components/global/Artwork";
import { Essential } from "@/types/dbTypes";
import { motion } from "framer-motion";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  return (
    <motion.div className={`w-max flex items-center pt-8 z-20`}>
      {essentials.map((essential, i) => (
        <Artwork
          className={`outline outline-1 outline-silver`}
          sound={essential.appleData}
          width={160}
          height={160}
          key={essential.id}
        />
      ))}
    </motion.div>
  );
};

export default Essentials;
