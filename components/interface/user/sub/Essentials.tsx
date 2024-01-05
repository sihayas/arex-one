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
    <div className={`ml-auto w-max flex flex-col items-center -space-y-14`}>
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
          borderRadius: "50%",
        };
        if (i === 0) {
          //@ts-ignore
          style = { ...style, top: "88px", right: "32px" };
        } else if (i === 1) {
          //@ts-ignore
          style = { ...style, top: "176px", right: "136px" };
        } else if (i === 2) {
          //@ts-ignore
          style = { ...style, bottom: "264px", right: "32px" };
        }
        const rotationClass = i % 2 === 0 ? "rotate-2" : "-rotate-2";

        return (
          <Fragment key={`essential-${i}`}>
            <Image
              className={`rounded-3xl shadow-shadowKitHigh ${rotationClass} ${
                i === 1 ? "-translate-x-[104px]" : ""
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
