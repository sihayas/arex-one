import React, { Fragment } from "react";
import { Essential } from "@/types/dbTypes";
import Image from "next/image";
import { useSound } from "@/hooks/usePage";

interface EssentialsProps {
  essentials: Essential[];
}

const Essentials: React.FC<EssentialsProps> = ({ essentials }) => {
  const { handleSelectSound } = useSound();
  return (
    <div
      className={`w-max flex flex-col items-center m-8 rounded-[16px] mt-auto shadow-shadowKitLow overflow-hidden outline outline-silver outline-1`}
    >
      {essentials.map((essential, i) => {
        const sound = essential.appleData;
        const color = sound.attributes.artwork.bgColor;
        const artwork = sound.attributes.artwork.url
          .replace("{w}", "320")
          .replace("{h}", "320");
        let style = {
          backgroundColor: `#${color}`,
          width: `192px`,
          height: `192px`,
          position: "absolute",
          borderRadius: "50%",
        };
        if (i === 0) {
          style = { ...style, top: "128px", left: "32px" };
        } else if (i === 1) {
          style = { ...style, bottom: "120px", right: "32px" };
        } else if (i === 2) {
          style = { ...style, bottom: "32px", left: "32px" };
        }
        return (
          <Fragment key={`essential-${i}`}>
            <Image
              onClick={() => handleSelectSound(sound)}
              src={artwork}
              alt={`artwork`}
              loading="lazy"
              quality={100}
              width={128}
              height={128}
            />
            {/*<div style={style} className="-z-20" />*/}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Essentials;
