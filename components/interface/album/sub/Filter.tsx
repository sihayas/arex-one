import React, { useState, useCallback } from "react";
import { SongData } from "@/types/appleTypes";
import { motion, useScroll, useTransform } from "framer-motion";

interface FilterProps {
  albumName: string;
  songs: SongData[];
  onActiveSongChange: (newActiveSong: SongData | null) => void;
}

interface ButtonProps {
  onClick: () => void;
  active: boolean | null;
  children: React.ReactNode;
  scrollContainerRef: React.RefObject<HTMLElement>;
}

const Filter = ({ songs, onActiveSongChange, albumName }: FilterProps) => {
  const [activeSong, setActiveSong] = useState<SongData | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleTabChange = useCallback(
    (newSong: SongData | null) => {
      setActiveSong(newSong);
      onActiveSongChange(newSong);
    },
    [onActiveSongChange],
  );

  return (
    <motion.div
      ref={scrollContainerRef}
      className="flex flex-col gap-2 scrollbar-none overflow-y-auto will-change-transform w-full h-[112px] pt-[52px] pb-[36px] snap-mandatory snap-y"
    >
      {/* Album Button */}
      <Button
        key="album"
        onClick={() => handleTabChange(null)}
        active={!activeSong}
        scrollContainerRef={scrollContainerRef}
      >
        <div className="w-[calculate(100%-32px)] text-end transition line-clamp-1 will-change-transform text-xs font-medium">
          {albumName}
        </div>
      </Button>
      {/* Track Buttons */}
      {songs.map((track, index) => (
        <Button
          key={track.id}
          onClick={() => handleTabChange(track)}
          active={activeSong && activeSong.id === track.id}
          scrollContainerRef={scrollContainerRef}
        >
          {/* Name */}
          <div className="w-full text-end transition line-clamp-1 will-change-transform text-xs">
            {track.attributes.name}
          </div>
        </Button>
      ))}
    </motion.div>
  );
};

const Button = ({
  onClick,
  active,
  children,
  scrollContainerRef,
}: ButtonProps) => {
  const ref = React.useRef<HTMLButtonElement>(null);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: ref,
    offset: ["center end", "center start"], // Track the element from end-start
  });

  // Range of scroll progress (0 at end, 0.5 at center, 1 at start)
  const scrollRange = [0, 0.5, 1];
  // Map the range of scroll progress to
  const opacityValues = [0, 1, 0];
  // const scaleValues = [0.8, 1, 0.8];
  const opacity = useTransform(scrollYProgress, scrollRange, opacityValues);
  // const scale = useTransform(scrollYProgress, scrollRange, scaleValues);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className={`snap-center ${
        active ? "!text-black" : "text-gray2" + " hover:text-gray3"
      }`}
      style={{
        WebkitTapHighlightColor: "transparent",
        opacity,
        // scale,
        transformOrigin: "right center",
      }}
    >
      {children}
    </motion.button>
  );
};

export default Filter;
