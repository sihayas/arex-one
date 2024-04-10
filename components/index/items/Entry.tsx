import React, { useState } from "react";

import Avatar from "@/components/global/Avatar";
import Heart from "@/components/global/Heart";
import { EntryExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";
import { useInterfaceContext } from "@/context/Interface";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import { Interaction } from "@/components/global/Interaction";
import useHandleHeartClick from "@/hooks/useHeart";
import { getStarComponent } from "@/components/global/Star";

interface EntryProps {
  entry: EntryExtended;
}

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

export const Entry: React.FC<EntryProps> = ({ entry }) => {
  const { user } = useInterfaceContext();
  const [isFlipped, setIsFlipped] = useState(false);

  const appleData = entry.sound.appleData;

  const name = appleData.attributes.name;
  const artistName = appleData.attributes.artistName;
  const color = appleData.attributes.artwork.bgColor;
  const url = MusicKit.formatArtworkURL(
    appleData.attributes.artwork,
    304 * 2.5,
    304 * 2.5,
  );

  const apiUrl = entry.heartedByUser
    ? "/api/entry/delete/heart"
    : "/api/entry/post/heart";

  const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
    entry.heartedByUser,
    entry._count.hearts,
    apiUrl,
    "entryId",
    entry.id,
    entry.author.id,
    user?.id,
  );

  return (
    <motion.div className={`-ml-12 relative flex w-[352px] items-end gap-2`}>
      <Avatar
        className={`border-silver z-10 border`}
        imageSrc={entry.author.image}
        altText={`${entry.author.username}'s avatar`}
        width={40}
        height={40}
        user={entry.author}
      />

      {/* Applying drop-shadow directly to Tilt breaks the flip effect! */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        animate={{ scale: isFlipped ? [0.8, 1] : [0.8, 1] }}
        initial={{
          scale: 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={() => {
          setIsFlipped(!isFlipped);
        }}
        className={`cloud-shadow z-20`}
      >
        {/* Scene */}
        <Tilt
          flipVertically={isFlipped}
          perspective={1000}
          tiltMaxAngleX={6}
          tiltMaxAngleY={6}
          tiltReverse={true}
          // reset={false}
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
              {entry.content?.text}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 flex h-[72px] w-full items-center gap-3 p-6 flex-shrink-0">
              <div>{getStarComponent(entry.content?.rating)}</div>

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
                <div>{getStarComponent(entry.content!.rating)}</div>

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
              {entry.content?.text}
            </p>
          </div>
        </Tilt>
      </motion.div>

      {/* Interactions */}
      <Interaction entry={entry} />

      <Heart
        handleHeartClick={handleHeartClick}
        hearted={hearted}
        className="absolute bottom-[432px] left-[46px] z-10 -m-12 p-12 mix-blend-multiply"
        heartCount={heartCount}
        replyCount={entry._count.replies}
      />

      <p
        className={`text-gray2 absolute -bottom-7 left-[68px] font-medium mix-blend-darken`}
      >
        {entry.author.username}
      </p>

      {/* Ambien */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute left-[48px] -z-50 h-[432px] w-[304px]`}
      />
    </motion.div>
  );
};
