import React from "react";
import { Artwork } from "@/components/global/Artwork";
import { Artifact } from "@/types/dbTypes";
import { motion } from "framer-motion";

interface RecentsProps {
  artifacts: Artifact[];
}

const Recents: React.FC<RecentsProps> = ({ artifacts }) => {
  return (
    <motion.div className={`flex items-center mt-8`}>
      {artifacts.map((artifact, i) => (
        <Artwork
          className={`outline outline-1 outline-silver`}
          sound={artifact.appleData}
          width={160}
          height={160}
          key={artifact.id}
        />
      ))}
    </motion.div>
  );
};

export default Recents;
