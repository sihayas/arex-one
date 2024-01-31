import React, { Fragment } from "react";
import { Essential } from "@/types/dbTypes";
import { motion } from "framer-motion";
import { Art } from "@/components/global/Art";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  return (
    <div className={`flex w-max items-center -space-x-8 p-8`}>
      {essentials.map((essential, i) => {
        const sound = essential.appleData;
        const color = sound.attributes.artwork.bgColor;

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
            <Art
              size={144}
              containerClass={`rounded-3xl shadow-shadowKitHigh outline outline-silver outline-1 ${rotationClass} ${
                i === 1 ? "translate-y-[88px] z-10" : ""
              }`}
              sound={sound}
            />

            {/* @ts-ignore */}
            {/* <motion.div style={style} className="-z-20" /> */}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Essentials;
