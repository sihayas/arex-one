import React, { Fragment } from "react";
import { Essential } from "@/types/dbTypes";
import Image from "next/image";
import { useSound } from "@/hooks/usePage";
import { motion } from "framer-motion";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  const { handleSelectSound } = useSound();
  return (
    <div className={`w-max flex items-center p-8 -space-x-8`}>
      {essentials.map((essential, i) => {
        const sound = essential.appleData;
        const color = sound.attributes.artwork.bgColor;
        const artwork = sound.attributes.artwork.url
          .replace("{w}", "320")
          .replace("{h}", "320");

        let style = {
          backgroundColor: `#${color}`,
          width: `144px`,
          height: `144px`,
          position: "absolute",
        };
        if (i === 0) {
          //@ts-ignore
          style = { ...style, top: "88px", left: "32px" };
        } else if (i === 1) {
          //@ts-ignore
          style = { ...style, top: "128px", right: "140px" };
        } else if (i === 2) {
          //@ts-ignore
          style = { ...style, top: "32px", right: "32px", rotate: "2deg" };
        }
        const rotationClass = i === 0 ? "-rotate-3" : i === 2 ? "rotate-3" : "";

        return (
          <Fragment key={`essential-${i}`}>
            <Image
              className={`rounded-3xl shadow-shadowKitHigh outline outline-silver outline-1 ${rotationClass} ${
                i === 1 ? "translate-y-[88px] z-10" : ""
              }`}
              onClick={() => handleSelectSound(sound)}
              src={artwork}
              alt={`artwork`}
              loading="lazy"
              quality={100}
              width={144}
              height={144}
            />
            {/* @ts-ignore */}
            <motion.div style={style} className="-z-20" />
          </Fragment>
        );
      })}
    </div>
  );
};

export default Essentials;
