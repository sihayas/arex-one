import React from "react";

// import useHandleHeartClick from "@/hooks/useHeart";

import Avatar from "@/components/global/Avatar";

import { ArtifactExtended } from "@/types/globalTypes";
import { motion } from "framer-motion";

import { MaskCardBottomOutlined } from "@/components/icons";
import { Art } from "@/components/global/Art";
import { useArtifact } from "@/hooks/usePage";

interface WispProps {
  artifact: ArtifactExtended;
}

const maskStyle = {
  maskImage: "url('/images/mask_card.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_card.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

const wispStyle = {
  maskImage: "url('/images/mask_wisp.svg')",
  maskSize: "cover",
  maskRepeat: "no-repeat",
  WebkitMaskImage: "url('/images/mask_wisp.svg')",
  WebkitMaskSize: "cover",
  WebkitMaskRepeat: "no-repeat",
};

export const Wisp: React.FC<WispProps> = ({ artifact }) => {
  // const { user } = useInterfaceContext();
  const { handleSelectArtifact } = useArtifact();

  const sound = artifact.appleData;
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
          onClick={() => handleSelectArtifact(artifact)}
          className={`relative z-10 flex cursor-pointer flex-col justify-between bg-white p-6 will-change-transform`}
        >
          {/* Metadata */}
          <div className={`flex w-full flex-col items-end`}>
            <motion.div
              style={{
                width: 128,
                height: 128,
                ...wispStyle,
              }}
            >
              <Art size={128} sound={sound} />
            </motion.div>

            <div className={`line-clamp-1 pt-4 text-end text-sm text-black`}>
              {sound.attributes.artistName}
            </div>
            <div
              className={`line-clamp-1 text-end text-base font-medium text-black`}
            >
              {sound.attributes.name}
            </div>
          </div>

          <motion.div
            className={`relative w-fit overflow-visible rounded-[18px] bg-[#F4F4F4] px-3 py-1.5`}
          >
            {/* Content  */}
            <div className="`text-base text-gray line-clamp-[7]">
              {artifact.content?.text}
            </div>

            {/* Bubbles */}
            <div className={`absolute -bottom-1 -left-1 -z-10 h-3 w-3`}>
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
