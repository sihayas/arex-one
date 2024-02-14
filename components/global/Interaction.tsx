import { motion } from "framer-motion";
import {
  ExpandCurveIcon,
  TinyCurveIcon,
  PlayIcon,
  AddIcon,
  DeleteIcon,
  ReportIcon,
} from "@/components/icons";
import React, { useCallback } from "react";
import { ArtifactExtended } from "@/types/globalTypes";
import { useSoundContext } from "@/context/SoundContext";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useNavContext } from "@/context/NavContext";
import { toast } from "sonner";
import { deleteEntry } from "@/lib/helper/artifact";

// Define the animation variants
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

// Create a styled dot component
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
  const { setIsVisible } = useInterfaceContext();
  const { setExpandInput } = useNavContext();

  const [isHovered, setIsHovered] = React.useState(false);
  const sound = artifact.appleData;

  const handlePlayContent = async () => {
    playContent(sound.id, sound.type);
  };

  const handleCreate = () => {
    setSelectedFormSound(sound);
    setIsVisible(true);
    setExpandInput(true);
  };

  const handleDelete = useCallback(async (artifactId: string) => {
    // Wrap the deleteEntry call inside toast.promise to manage toast notifications
    toast.promise(
      deleteEntry(artifactId).then(() => {
        // For example, updating the UI or state to reflect the deletion
      }),
      {
        loading: "Deleting...",
        success: "Deletion successful!",
        error: "Error deleting artifact",
      },
    );
  }, []);

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
        className="flex origin-top-right flex-row-reverse items-center justify-center gap-2 pr-2"
        variants={containerVariants}
        animate={isHovered ? "visible" : "hidden"}
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <Dot key={index} />
        ))}
        <motion.div
          onClick={() => handleDelete(artifact.id)}
          variants={dotVariants}
          className={`bg-gray4 flex h-8 w-8 items-center justify-center rounded-full`}
        >
          <DeleteIcon />
        </motion.div>
        <motion.div
          className="bg-gray4 h-1 w-1 rounded-full"
          variants={dotVariants}
        />
        <motion.div
          variants={dotVariants}
          className={`bg-gray4 flex h-8 w-8 items-center justify-center rounded-full`}
        >
          <ReportIcon />
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
          <motion.div
            onClick={handleCreate}
            variants={dotVariants}
            className={`bg-gray4 flex h-8 w-8 items-center justify-center rounded-full`}
          >
            <AddIcon />
          </motion.div>
          <motion.div
            className="bg-gray4 h-1 w-1 rounded-full"
            variants={dotVariants}
          />
          <motion.button
            onClick={handlePlayContent}
            variants={dotVariants}
            className={`bg-gray4 flex h-8 w-8 items-center justify-center rounded-full`}
          >
            <PlayIcon />
          </motion.button>
        </motion.div>
        <motion.div
          animate={{
            x: !isHovered ? -12 : 0,
            y: !isHovered ? -12 : 0,
            scale: !isHovered ? 0 : 1,
            opacity: !isHovered ? 0 : 1,
          }}
          className={`h-8 w-8 origin-top-left`}
        >
          <TinyCurveIcon color={"#F4F4F4"} />
        </motion.div>
      </div>
    </motion.div>
  );
};
