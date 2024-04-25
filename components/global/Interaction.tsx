import { AnimatePresence, motion } from "framer-motion";
import {
  ExpandCurveIcon,
  TinyCurveIcon,
  AddIcon,
  DeleteIcon,
  ReportIcon,
  ExpandIcon,
  TargetExpandIcon,
} from "@/components/icons";
import React, { useCallback } from "react";
import { EntryExtended } from "@/types/global";
import { PageSound, useInterfaceContext } from "@/context/Interface";
import { useNavContext } from "@/context/Nav";

import { useEntry, useSound } from "@/hooks/usePage";
import { AlbumData, SongData } from "@/types/apple";

const dotVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
    },
  },
  hovered: {
    scale: 1.25,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
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

type InteractionProps = {
  entry: EntryExtended;
  isMirrored?: boolean;
};

export const Interaction = ({ entry, isMirrored }: InteractionProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isFlagging, setIsFlagging] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const { setIsVisible, user } = useInterfaceContext();
  const { setExpandInput, setFormSound } = useNavContext();
  const { openEntryPage } = useEntry();
  const { openSoundPage } = useSound();

  const handleOpenEntry = () => {
    openEntryPage(entry);
  };

  const handleOpenSound = () => {
    openSoundPage(pageSound);
  };

  const handleCreate = () => {
    setFormSound(pageSound);
    setIsVisible(true);
    setExpandInput(true);
  };

  const handleDelete = useCallback(
    async (entryId: string) => {
      if (!isDeleting) {
        setIsDeleting(true);
        setTimeout(() => setIsDeleting(false), 3000); // 3 seconds to confirm
        return;
      }
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
      setIsFlagging(false);
    } catch (error) {
      console.error("Error flagging content", error);
      setIsFlagging(false);
    }
  };

  const pageSound: PageSound = {
    id: entry.sound_id,
    apple_id: entry.sound_apple_id,
    type: entry.sound_type,
    name: entry.sound_data.name,
    artist_name: entry.sound_data.artist_name,
    release_date: entry.sound_data.release_date,
    artwork: entry.sound_data.artwork_url
      .replace("{w}", "800")
      .replace("{h}", "800"),
    identifier: entry.sound_data.identifier,
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute -bottom-10 flex cursor-pointer items-end mix-blend-darken -z-10 ${
        isMirrored ? "-scale-x-[1] -left-10" : " -right-10"
      }`}
    >
      <motion.div
        animate={{
          x: !isHovered ? -22 : -10,
          y: !isHovered ? -22 : -10,
          scale: !isHovered ? 1 : 0.5,
          opacity: !isHovered ? 1 : 0,
        }}
        initial={false}
        className={`absolute bottom-0 right-0`}
      >
        <ExpandCurveIcon color={"#CCC"} />
      </motion.div>

      {/* System */}
      <motion.div
        className={`flex origin-top-right flex-row-reverse items-center justify-center gap-2 pr-2`}
        variants={containerVariants}
        animate={isHovered ? "visible" : "hidden"}
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <motion.div
            key={index}
            initial={false}
            className="bg-[#E5E5E5] h-1 w-1 rounded-full"
            variants={dotVariants}
          />
        ))}

        {/* Delete button */}
        {user?.id === entry.author.id && (
          <>
            <motion.div
              className={`rounded-full overflow-hidden`}
              whileHover={{
                scale: 1.25,
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.75 }}
            >
              <motion.div
                onClick={() => handleDelete(entry.id)}
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
              className="bg-[#E5E5E5] h-1 w-1 rounded-full"
              variants={dotVariants}
            />
          </>
        )}

        {/* Flag button */}
        <motion.div
          className={`rounded-full overflow-hidden`}
          whileHover={{
            scale: 1.25,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
          }}
          whileTap={{ scale: 0.75 }}
        >
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
            <motion.div
              key={index}
              initial={false}
              className="bg-[#E5E5E5] h-1 w-1 rounded-full"
              variants={dotVariants}
            />
          ))}

          <motion.div
            className={`rounded-full overflow-hidden`}
            whileHover={{
              scale: 1.25,
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.75 }}
          >
            <motion.button
              onClick={handleOpenSound}
              variants={dotVariants}
              className={`bg-[#E5E5E5] flex h-8 w-8 items-center justify-center ${
                isMirrored && "-scale-x-[1]"
              }`}
            >
              <TargetExpandIcon color={"#999"} />
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gray4 h-1 w-1 rounded-full"
            variants={dotVariants}
          />

          {/* Play button */}
          {/*<motion.div whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.75 }}>*/}
          {/*  <motion.button*/}
          {/*    onClick={handlePlayContent}*/}
          {/*    variants={dotVariants}*/}
          {/*    className={`bg-[#E5E5E5] flex h-8 w-8 items-center justify-center rounded-full ${*/}
          {/*      isMirrored && "-scale-x-[1]"*/}
          {/*    }`}*/}
          {/*  >*/}
          {/*    <PlayIcon />*/}
          {/*  </motion.button>*/}
          {/*</motion.div>*/}

          {/* Create button */}
          <motion.div
            className={`rounded-full overflow-hidden`}
            whileHover={{
              scale: 1.25,
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.75 }}
          >
            <motion.div
              onClick={handleCreate}
              variants={dotVariants}
              className={`bg-[#E5E5E5] flex h-8 w-8 items-center justify-center rounded-full ${
                isMirrored && "-scale-x-[1]"
              }`}
            >
              <AddIcon />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{
            x: !isHovered ? -12 : 0,
            y: !isHovered ? -12 : 0,
            scale: !isHovered ? 0 : 1,
            opacity: !isHovered ? 0 : 1,
          }}
          whileTap={{ scale: 0.75 }}
          onClick={handleOpenEntry}
          className={`relative h-8 w-8 origin-top-left`}
        >
          <motion.div
            whileHover={{ scale: 1.25 }}
            className={`absolute -left-[11px] -top-[11px]`}
          >
            <ExpandIcon />
          </motion.div>
          <TinyCurveIcon color={"#E5E5E5"} />
        </motion.div>
      </div>
    </motion.div>
  );
};
