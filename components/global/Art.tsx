import { useSound } from "@/hooks/usePage";
import { SongData, AlbumData } from "@/types/appleTypes";
import Image from "next/image";
import { PlayIcon } from "@/components/icons";
import { motion } from "framer-motion";
import { useSoundContext } from "@/context/SoundContext";
import { useState } from "react";

type Props = {
  sound: SongData | AlbumData;
  size: number;
  imageClass?: string;
  containerClass?: string;
};

const artConfig = {
  type: "spring",
  damping: 10,
  stiffness: 120,
  mass: 1,
  restDelta: 0.01,
  restSpeed: 0.01,
};

const buttonConfig = {
  type: "spring",
  damping: 10,
  stiffness: 100,
  mass: 0.1,
  restDelta: 0.01,
  restSpeed: 0.01,
};

export const Art = ({ sound, size, imageClass, containerClass }: Props) => {
  const { handleSelectSound } = useSound();
  const { playContent } = useSoundContext();
  const [hovered, setHovered] = useState(false);

  const name = sound.attributes.name;
  const artistName = sound.attributes.artistName;
  const url = MusicKit.formatArtworkURL(
    sound.attributes.artwork,
    size * 2.5,
    size * 2.5,
  );

  const handleSoundClick = async () => {
    handleSelectSound(sound);
  };

  const handlePlayContent = async () => {
    playContent(sound.id, sound.type);
  };

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative cursor-pointer ${containerClass}`}
    >
      <motion.div
        className={`${imageClass}`}
        whileHover={{ scale: 1.1 }}
        transition={artConfig}
      >
        <Image
          onClick={handleSoundClick}
          src={url}
          alt={`${name} by ${artistName} - artwork`}
          quality={100}
          width={size}
          height={size}
        />
      </motion.div>

      <motion.button
        whileHover={{
          scale: 1.1,
        }}
        whileTap={{ scale: 0.9 }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0 }}
        transition={buttonConfig}
        className="item-center absolute bottom-0 left-0 flex justify-center rounded-full bg-[#E5E5E5] p-3"
        onClick={handlePlayContent}
        aria-label="Play"
      >
        <PlayIcon />
      </motion.button>
    </motion.div>
  );
};
