import React from "react";
import { Artwork } from "@/components/global/Artwork";
import { Artifact } from "@/types/dbTypes";
import { motion } from "framer-motion";
import Stars from "@/components/global/Stars";

interface RecentsProps {
  artifacts: Artifact[];
}

const Recents: React.FC<RecentsProps> = ({ artifacts }) => {
  return (
    <motion.div
      className={`flex items-center mt-[23px] px-8 overflow-scroll gap-6 w-full scrollbar-none `}
    >
      {artifacts.map((artifact, i) => (
        <div className={`min-w-[64px] relative overflow-visible`}>
          <Artwork
            className={`border border-silver rounded-xl`}
            sound={artifact.appleData}
            width={64}
            height={64}
            key={artifact.id}
          />
          <Stars
            className={`bg-[#F4F4F4] absolute top-0 left-0 rounded-full w-max text-[#808084] z-20 p-[6px] shadow-shadowKitLow`}
            rating={artifact.content?.rating}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default Recents;
