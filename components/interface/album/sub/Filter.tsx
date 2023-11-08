import React, { useState, useCallback } from "react";
import { SongData } from "@/types/appleTypes";
import { motion } from "framer-motion";
import Line from "@/components/interface/record/sub/icons/Line";
import Statline from "@/components/interface/album/sub/CircleStatline";
import AnimatedCircle from "@/components/global/AnimatedCircle";

type sortOrder = "newest" | "positive" | "negative";

interface FilterProps {
  albumName: string;
  songs: SongData[];
  onActiveSongChange: (newActiveSong: SongData | null) => void;
  handleSortOrderChange: (newSortOrder: sortOrder) => void;
  expand: boolean;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ButtonProps {
  onClick: () => void;
  active: boolean | null;
  children: React.ReactNode;
  className?: string;
}

const Button = ({ onClick, active, children, className }: ButtonProps) => (
  <button
    onClick={onClick}
    className={` ${className} relative transition flex items-center will-change-transform ${
      active ? "!text-black" : "text-gray2 hover:text-black"
    }`}
    style={{ WebkitTapHighlightColor: "transparent" }}
  >
    {children}
  </button>
);

const Filter = ({
  songs,
  onActiveSongChange,
  expand,
  setExpand,
}: FilterProps) => {
  // Expand is passed as a prop due to BlurGradient not working outside of Album
  const [activeSong, setActiveSong] = useState<SongData | null>(null);

  const handleTabChange = useCallback(
    (newSong: SongData | null) => {
      if (expand) {
        setActiveSong(newSong);
        onActiveSongChange(newSong);
      }
    },
    [expand, onActiveSongChange],
  );

  const toggleExpand = useCallback(() => {
    setExpand((prev) => !prev);
  }, []);

  return (
    <motion.div
      tabIndex={0}
      onFocus={toggleExpand}
      onBlur={toggleExpand}
      initial={{ height: "14" }}
      animate={{ height: expand ? "288px" : "14px" }}
      transition={{ type: "spring", damping: 40, stiffness: 400 }}
      className="flex scrollbar-none overflow-y-auto will-change-transform w-full"
    >
      <div className="flex flex-col gap-4 w-full overflow-y-scroll scrollbar-none">
        {/* Track Buttons */}
        {songs.map((track, index) => (
          <Button
            key={track.id}
            onClick={() => handleTabChange(track)}
            active={activeSong && activeSong.id === track.id}
          >
            {/* Line and Name */}
            <div className="w-full  text-end transition line-clamp-1 will-change-transform text-sm font-semibold leading-[14px]">
              {track.attributes.name}
            </div>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default Filter;
