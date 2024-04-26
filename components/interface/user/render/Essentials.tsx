import Image from "next/image";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { LaurelIcon } from "@/components/icons";
import { EssentialExtended } from "@/types/global";

interface EssentialsProps {
  essentials: EssentialExtended[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  const [essential_one, setEssentialOne] =
    React.useState<EssentialExtended | null>(null);
  const [essential_two, setEssentialTwo] =
    React.useState<EssentialExtended | null>(null);
  const [essential_three, setEssentialThree] =
    React.useState<EssentialExtended | null>(null);

  // Use useEffect to update state based on changes to the 'essentials' prop
  useEffect(() => {
    essentials.forEach((essential: EssentialExtended) => {
      if (essential.rank === 0) {
        setEssentialOne(essential);
      } else if (essential.rank === 1) {
        setEssentialTwo(essential);
      } else if (essential.rank === 2) {
        setEssentialThree(essential);
      }
    });
  }, [essentials]);

  return (
    <>
      <LaurelIcon className="mt-[60px] -rotate-[24deg] -translate-x-4" />
      <div className="w-28 h-28 rounded-[20px] shadow-shadowKitHigh -rotate-12 mt-4">
        {essential_one && (
          <motion.div
            key={essential_one.id}
            className="w-28 h-28 rounded-[20px] shadow-shadowKitHigh"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src={essential_one.sound_data.artwork_url
                .replace("{w}", "280")
                .replace("{h}", "280")}
              alt={essential_one.sound_data.name}
              width={112}
              height={112}
              className="rounded-[20px]"
            />
          </motion.div>
        )}
      </div>
      <div className="w-28 h-28 rounded-[20px] shadow-shadowKitHigh z-10">
        {essential_two && (
          <motion.div
            key={essential_two.id}
            className="w-28 h-28 rounded-[20px] shadow-shadowKitHigh"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src={essential_two.sound_data.artwork_url
                .replace("{w}", "280")
                .replace("{h}", "280")}
              alt={essential_two.sound_data.name}
              width={112}
              height={112}
              className="rounded-[20px]"
            />
          </motion.div>
        )}
      </div>
      <div className="w-28 h-28 rounded-[20px] shadow-shadowKitHigh rotate-12 mt-4">
        {essential_three && (
          <motion.div
            key={essential_three.id}
            className="w-28 h-28 rounded-[20px] shadow-shadowKitHigh"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src={essential_three.sound_data.artwork_url
                .replace("{w}", "280")
                .replace("{h}", "280")}
              alt={essential_three.sound_data.name}
              width={112}
              height={112}
              className="rounded-[20px]"
            />
          </motion.div>
        )}
      </div>
      <LaurelIcon className="-scale-x-[1] mt-[60px] rotate-[24deg] translate-x-4" />
    </>
  );
};

export default Essentials;
