import { AnimatePresence, motion } from "framer-motion";
import {
  ExpandCurveIcon,
  TinyCurveIcon,
  PlayIcon,
  AddIcon,
  DeleteIcon,
  ReportIcon,
  ExpandIcon,
} from "@/components/icons";
import React, { useCallback } from "react";
import { ArtifactExtended } from "@/types/globalTypes";
import { useSoundContext } from "@/context/SoundContext";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";
import { toast } from "sonner";
import { createFlag, deleteEntry } from "@/lib/helper/artifact";

import { FlagType } from "@prisma/client";
import { useArtifact } from "@/hooks/usePage";

const dotVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 49,
      stiffness: 400,
    },
  },
  hovered: {
    scale: 1.25,
    transition: {
      type: "spring",
      damping: 49,
      stiffness: 400,
    },
  },
};

const containerVariants = {
  hidden: { transition: { staggerChildren: 0.02 } },
  visible: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.02,
    },
  },
};

const Dot = () => {
  return (
    <motion.div
      className="bg-gray4 h-1 w-1 rounded-full"
      variants={dotVariants}
    />
  );
};

type InteractionProps = {
  artifact: ArtifactExtended;
};

export const Interaction = ({ artifact }: InteractionProps) => {
  const { playContent, setSelectedFormSound } = useSoundContext();
  const { setIsVisible, user } = useInterfaceContext();
  const { setExpandInput } = useNavContext();
  const { handleSelectArtifact } = useArtifact();

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isFlagging, setIsFlagging] = React.useState(false);

  const [isHovered, setIsHovered] = React.useState(false);
  const sound = artifact.appleData;

  const handleOpen = () => {
    handleSelectArtifact(artifact);
  };

  const handlePlayContent = async () => {
    playContent(sound.id, sound.type);
  };

  const handleCreate = () => {
    setSelectedFormSound(sound);
    setIsVisible(true);
    setExpandInput(true);
  };

  const handleDelete = useCallback(
    async (artifactId: string) => {
      if (!isDeleting) {
        setIsDeleting(true);
        setTimeout(() => setIsDeleting(false), 3000); // 3 seconds to confirm
        return;
      }

      toast.promise(
        deleteEntry(artifactId).then(() => {
          setIsDeleting(false);
          // For example, updating the UI or state to reflect the deletion
        }),
        {
          loading: "Deleting...",
          success: "Deletion successful!",
          error: "Error deleting artifact",
        },
      );
    },
    [isDeleting],
  );

  const handleFlag = async () => {
    if (!isFlagging) {
      setIsFlagging(true);
      setTimeout(() => setIsFlagging(false), 3000);
      return;
    }

    try {
      const response = await createFlag(
        artifact.id,
        FlagType.artifact,
        user!.id,
      );
      console.log("Content flagged successfully!", response);
      setIsFlagging(false);
    } catch (error) {
      console.error("Error flagging content", error);
      setIsFlagging(false);
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute -bottom-[38px] -right-[38px] z-10 flex cursor-pointer items-end mix-blend-multiply`}
    >
      <motion.div
        animate={{
          x: !isHovered ? -22 : -10,
          y: !isHovered ? -22 : -10,
          scale: !isHovered ? 1 : 0.5,
          opacity: !isHovered ? 1 : 0,
        }}
        className={`absolute bottom-0 right-0`}
      >
        <ExpandCurveIcon color={"#CCC"} />
      </motion.div>

      {/* System */}
      <motion.div
        layout
        className="flex origin-top-right flex-row-reverse items-center justify-center gap-2 pr-2"
        variants={containerVariants}
        animate={isHovered ? "visible" : "hidden"}
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <Dot key={index} />
        ))}

        {/* Delete button */}
        {user?.id === artifact.author.id && (
          <>
            <motion.div
              whileHover={{
                scale: 1.25,
              }}
              whileTap={{
                scale: 0.75,
              }}
            >
              <motion.div
                layout
                onClick={() => handleDelete(artifact.id)}
                variants={dotVariants}
                className={`flex items-center justify-center rounded-full bg-[#F20000] bg-opacity-25 p-2 text-xs font-medium uppercase leading-[8px] text-[#F20000]`}
              >
                <AnimatePresence>
                  {isDeleting ? (
                    <div>archive</div>
                  ) : (
                    <DeleteIcon color={"#F20000"} />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <motion.div
              className="bg-gray4 h-1 w-1 rounded-full"
              variants={dotVariants}
            />
          </>
        )}

        {/* Flag button */}
        <motion.div whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.75 }}>
          <motion.div
            onClick={handleFlag}
            variants={dotVariants}
            className={`flex items-center justify-center rounded-full bg-[#FF5200] bg-opacity-25 p-2 text-xs font-medium uppercase leading-[8px] text-[#F20000]`}
          >
            <AnimatePresence>
              {isFlagging ? <div>flag</div> : <ReportIcon color={"#F20000"} />}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Sound Actions */}
      <div className={`flex flex-col items-end`}>
        <motion.div
          className="flex flex-col-reverse items-center justify-center gap-2 pb-2"
          variants={containerVariants}
          animate={isHovered ? "visible" : "hidden"}
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <Dot key={index} />
          ))}

          {/* Create button */}
          <motion.div whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.75 }}>
            <motion.div
              onClick={handleCreate}
              variants={dotVariants}
              className={`bg-gray4 flex h-8 w-8 items-center justify-center rounded-full`}
            >
              <AddIcon />
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-gray4 h-1 w-1 rounded-full"
            variants={dotVariants}
          />

          {/* Play button */}
          <motion.div
            whileHover={{
              scale: 1.25,
            }}
            whileTap={{
              scale: 0.75,
            }}
          >
            <motion.button
              onClick={handlePlayContent}
              variants={dotVariants}
              className={`bg-gray4 flex h-8 w-8 items-center justify-center rounded-full`}
            >
              <PlayIcon />
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{
            x: !isHovered ? -12 : 0,
            y: !isHovered ? -12 : 0,
            scale: !isHovered ? 0 : 1,
            opacity: !isHovered ? 0 : 1,
          }}
          whileTap={{
            scale: 0.75,
          }}
          onClick={handleOpen}
          className={`relative h-8 w-8 origin-top-left`}
        >
          <motion.div
            whileHover={{
              scale: 1.25,
            }}
            className={`absolute -left-[11px] -top-[11px]`}
          >
            <ExpandIcon />
          </motion.div>
          <TinyCurveIcon color={"#F4F4F4"} />
        </motion.div>
      </div>
    </motion.div>
  );
};
