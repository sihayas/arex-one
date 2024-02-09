import React from "react";

// import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";

import { MaskCardBottomOutlined } from "@/components/icons";
import { Art } from "@/components/global/Art";

interface WispProps {
  artifact: ArtifactExtended;
}

const maskStyle = {
  maskImage: "url('/images/mask_card_bottom_outlined.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card_bottom_outlined.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

export const Wisp: React.FC<WispProps> = ({ artifact }) => {
  // const { user } = useInterfaceContext();

  const sound = artifact.appleData;
  const artwork = sound.attributes.artwork.url
    .replace("{w}", "120")
    .replace("{h}", "120");
  const color = sound.attributes.artwork.bgColor;

  return (
    <div className={`relative flex h-fit w-[356px] items-end gap-2.5`}>
      <Avatar
        className={`border-silver z-10 h-[42px] border`}
        imageSrc={artifact.author.image}
        altText={`${artifact.author.username}'s avatar`}
        width={42}
        height={42}
        user={artifact.author}
      />

      <motion.div className={`relative `}>
        <motion.div
          style={{
            width: 304,
            height: 432,
            ...maskStyle,
          }}
          className={`relative z-10 flex flex-col justify-between bg-white will-change-transform p-6`}
        >
          {/* Metadata */}
          <div className={`flex w-full flex-col items-end`}>
            <Art
              size={128}
              containerClass="shadow-shadowKitHigh rounded-[17px] overflow-hidden outline outline-1 outline-silver"
              sound={sound}
            />

            <div className={`text-gray2 line-clamp-1 pt-4 text-end text-sm`}>
              {sound.attributes.artistName}
            </div>
            <div
              className={`line-clamp-1 text-end text-base font-medium text-black`}
            >
              {sound.attributes.name}
            </div>
          </div>

          <motion.div
            className={`relative w-fit max-w-[252px] overflow-visible rounded-[18px] bg-[#F4F4F4] px-3 py-1.5 mb-3`}
          >
            {/* Content  */}
            <div className="`text-base line-clamp-[7] text-black">
              {artifact.content?.text}
            </div>

            {/* Bubbles */}
            <div className={`absolute -z-10 h-3 w-3 -bottom-1 -left-1`}>
              <div
                className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-[#F4F4F4]`}
              />
              <div
                className={`absolute bottom-0 left-0 h-1 w-1 rounded-full bg-[#F4F4F4]`}
              />
            </div>
          </motion.div>
        </motion.div>

        <div
          className={`cloud-shadow absolute bottom-0 right-0 h-[432px] w-[304px]`}
        >
          <MaskCardBottomOutlined />
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: `#${color}`,
          backgroundRepeat: "repeat, no-repeat",
        }}
        className={`absolute left-[52px] -z-10 h-[400px] w-[304px]`}
      />
    </div>
  );
};

// const apiUrl = artifact.heartedByUser
//   ? "/api/heart/delete/artifact"
//   : "/api/heart/post/artifact";

// const { hearted, handleHeartClick, heartCount } = useHandleHeartClick(
//   artifact.heartedByUser,
//   artifact._count.hearts,
//   apiUrl,
//   "artifactId",
//   artifact.id,
//   artifact.author.id,
//   user?.id,
// );
