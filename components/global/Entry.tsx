import React, { useState } from "react";
import Image from "next/image";

import Heart from "@/components/global/Heart";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Interaction } from "@/components/global/Interaction";
import { getStarComponent } from "@/components/global/Star";
import { EntryExtended } from "@/types/global";

export const cardMask = {
  maskImage: "url('/images/mask_card_front.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card_front.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

export const cardBackMask = {
  maskImage: "url('/images/mask_card_back.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card_back.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

interface EntryProps {
  entry: EntryExtended;
  flip?: boolean;
}

export const Entry: React.FC<EntryProps> = ({ entry, flip }) => {
  const [isFlipped, setIsFlipped] = useState(flip ? flip : false);

  const appleData = entry.sound_data;

  const name = appleData.attributes.name;
  const artistName = appleData.attributes.artistName;
  const url = MusicKit.formatArtworkURL(
    appleData.attributes.artwork,
    304 * 2.5,
    304 * 2.5,
  );

  // IMPORTANT: drop-shadow breaks the backface-visibility of the card.
  return (
    <div className={`relative z-10`}>
      <Heart
        className="absolute bottom-[428px] -left-2 -z-10 -m-12 p-12"
        entry={entry}
      />
      <motion.div
        whileTap={{ scale: 0.95 }}
        animate={{ scale: isFlipped ? [0.8, 1] : [0.8, 1] }}
        initial="none"
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={() => {
          setIsFlipped(!isFlipped);
        }}
        className={`cloud-shadow z-20`}
      >
        <Tilt
          flipVertically={isFlipped}
          perspective={1000}
          tiltMaxAngleX={6}
          tiltMaxAngleY={6}
          tiltReverse={true}
          glareEnable={true}
          glareMaxOpacity={0.45}
          glareBorderRadius={"32px"}
          scale={1.05}
          transitionEasing={"cubic-bezier(0.1, 0.8, 0.2, 1)"}
          className={`transform-style-3d relative h-[432px] w-[304px]`}
        >
          {/* Front */}
          <div
            style={{ ...cardMask }}
            className="backface-hidden absolute left-0 top-0 flex h-full w-full flex-col bg-white"
          >
            <Image
              className={`-mt-6 mx-auto`}
              // onClick={handleSoundClick}
              src={url}
              alt={`${name} by ${artistName} - artwork`}
              quality={100}
              width={304}
              height={304}
              draggable={false}
              priority={true}
            />
            <div className="`text-base line-clamp-3 px-6 pt-[18px] text-black cursor-default">
              {entry.text}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 flex h-[72px] w-full items-center gap-3 p-6 flex-shrink-0">
              <div>{getStarComponent(entry.rating)}</div>

              <div className={`flex translate-y-[1px] flex-col`}>
                <p className={`text-gray2 line-clamp-1 text-sm font-medium`}>
                  {artistName}
                </p>
                <p
                  className={`line-clamp-1 text-base font-semibold text-black`}
                >
                  {name}
                </p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            style={{ ...cardBackMask, transform: "rotateX(180deg)" }}
            className="backface-hidden absolute left-0 top-0 flex h-full  w-full flex-col bg-white p-6 pb-0 "
          >
            <div className={`flex flex-shrink-0 justify-between`}>
              <div className={`flex-col flex`}>
                <div>{getStarComponent(entry.rating)}</div>

                <p
                  className={`text-gray2 mt-auto line-clamp-1 text-sm font-medium pt-6`}
                >
                  {artistName}
                </p>
                <p
                  className={`line-clamp-1 text-base font-semibold text-black`}
                >
                  {name}
                </p>
              </div>

              <Image
                className={`shadow-shadowKitHigh rounded-xl`}
                src={url}
                alt={`${name} by ${artistName} - artwork`}
                quality={100}
                width={88}
                height={88}
                draggable={false}
              />
            </div>

            <p className={`line-clamp-[12] pt-[18px] text-base cursor-default`}>
              {entry.text}
            </p>
          </div>
        </Tilt>
      </motion.div>
      <Interaction entry={entry} />
    </div>
  );
};
