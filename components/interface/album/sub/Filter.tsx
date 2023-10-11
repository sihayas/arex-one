import React, { useState, useCallback } from "react";
import { TrackData } from "@/lib/global/interfaces";
import { motion } from "framer-motion";
import Line from "@/components/interface/entry/sub/icons/Line";
import Statline from "@/components/interface/album/sub/Statline";
import AnimatedCircle from "@/components/global/AnimatedCircle";

type sortOrder = "newest" | "positive" | "negative";

interface FilterProps {
  albumName: string;
  songs: TrackData[];
  onActiveSongChange: (newActiveSong: TrackData | null) => void;
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
  const [activeSong, setActiveSong] = useState<TrackData | null>(null);

  const handleTabChange = useCallback(
    (newSong: TrackData | null) => {
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
      className="flex scrollbar-none overflow-y-auto will-change-transform w-full"
    >
      <div className="flex flex-col flex-col-reverse w-full overflow-y-scroll scrollbar-none">
        {/* Album Button */}
        <Button
          key="album"
          onClick={() => handleTabChange(null)}
          active={!activeSong}
        >
          {/* Line and Name*/}
          <div className="flex w-full items-center max-w-[376px] gap-8">
            {!activeSong && (
              <Statline ratings={[440, 890, 244, 5000, 5000]} average={2.4} />
            )}
            <div className="min-w-[56px] transition text-end line-clamp-1">
              {albumName}
            </div>
          </div>
          {/* Bubble and Circle */}
          <div className="w-8 h-8 flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.05 }} className="absolute">
              <AnimatedCircle
                onSortOrderChange={handleSortOrderChange}
                expanded={expand}
              />
            </motion.div>
            {!activeSong && <Bubble />}
          </div>
        </Button>

        {/* Track Buttons */}
        {songs.map((track, index) => (
          <Button
            key={track.id}
            onClick={() => handleTabChange(track)}
            active={activeSong && activeSong.id === track.id}
          >
            {/* Line and Name*/}
            <div className="flex w-full items-center justify-end max-w-[376px] gap-8">
              {activeSong && activeSong.id === track.id && (
                <Statline ratings={[440, 890, 244, 5000, 5000]} average={2.4} />
              )}
              <div className="min-w-[56px] transition text-end line-clamp-1 will-change-transform">
                {track.attributes.name}
              </div>
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
          className="fixed bottom-4 right-[15.25px] flex flex-grow rounded z-0"
          height={"77%"}
        />
      )}
    </motion.div>
  );
};

export default Filter;
