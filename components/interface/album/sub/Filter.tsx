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

const Bubble = () => (
  <motion.span
    layoutId="bubble"
    className="bg-gray2 z-10 w-2 h-2 outline outline-4 outline-white rounded-full flex"
    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
  />
);

const Button = ({ onClick, active, children, className }: ButtonProps) => (
  <button
    onClick={onClick}
    className={` ${className} relative text-xs transition grid items-center justify-end grid-cols-tab-cols gap-2 will-change-transform ${
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
  albumName,
  handleSortOrderChange,
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
      initial={{ height: "32px" }}
      animate={{ height: expand ? "288px" : "32px" }}
      transition={{ type: "spring", damping: 40, stiffness: 400 }}
      className="flex scrollbar-none overflow-y-auto will-change-transform w-full drop-shadow-2xl"
    >
      <div className="flex flex-col-reverse w-full overflow-y-scroll scrollbar-none">
        {/* Track Buttons */}
        {songs.map((track, index) => (
          <Button
            key={track.id}
            onClick={() => handleTabChange(track)}
            active={activeSong && activeSong.id === track.id}
          >
            {/* Line and Name*/}
            <div className="min-w-[56px] transition text-end line-clamp-1 will-change-transform">
              {track.attributes.name}
            </div>

            {/* Bubble */}
            <div className="w-8 h-8 flex items-center justify-center">
              {activeSong && activeSong.id === track.id && <Bubble />}
            </div>
          </Button>
        ))}
      </div>

      {/* Line */}
      {expand && (
        <Line
          width={"1.5px"}
          color={"#CCC"}
          className="fixed bottom-4 right-[15.25px] flex flex-grow rounded -z-10"
          height={"100%"}
        />
      )}
    </motion.div>
  );
};

export default Filter;
