import React, { useState, useCallback } from "react";
import { TrackData } from "@/lib/global/interfaces";
import { motion } from "framer-motion";
import Line from "@/components/interface/entry/sub/icons/Line";
import Statline from "@/components/interface/album/sub/Statline";
import AnimatedCircle from "@/components/global/AnimatedCircle";

type sortOrder = "newest" | "positive" | "negative";

interface FilterProps {
  songs: TrackData[];
  onActiveSongChange: (newActiveSong: TrackData | null) => void;
  onSortOrderChange: (newSortOrder: sortOrder) => void;
  albumName: string;
}

const Bubble = () => (
  <motion.span
    layoutId="bubble"
    className="bg-gray2 z-10 w-2 h-2 outline outline-4 outline-white rounded-full"
    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
  />
);

const Button = ({ onClick, active, children, className }: any) => (
  <button
    onClick={onClick}
    className={` ${className} relative text-xs transition grid items-center justify-end grid-cols-tab-cols gap-2 -scale-y-100 ${
      active ? "!text-gray2" : "text-gray3 hover:text-black"
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
  onSortOrderChange,
}: FilterProps) => {
  const [activeSong, setActiveSong] = useState<TrackData | null>(null);
  const [expand, setExpand] = useState<boolean>(false);

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
      animate={{ height: expand ? "352px" : "32px" }}
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      className="flex bottom-0 right-0 scrollbar-none overflow-y-auto"
    >
      <div className="flex flex-col gap-4 w-full overflow-y-scroll scrollbar-none -scale-y-100">
        {/* Album Button */}
        <Button
          onClick={() => handleTabChange(null)}
          active={!activeSong}
          className={"!pt-0"}
        >
          <div className="flex w-full items-center max-w-[376px] gap-8">
            {!activeSong && (
              <Statline ratings={[440, 890, 244, 5000, 5000]} average={2.4} />
            )}
            <motion.div className="min-w-[56px] transition text-end line-clamp-1 font-bold">
              {!activeSong ? albumName : "TRACKS"}
            </motion.div>
          </div>
          {!activeSong && <AnimatedCircle />}
        </Button>

        {/* Track Buttons */}
        {songs.map((track, index) => (
          <Button
            key={track.id}
            onClick={() => handleTabChange(track)}
            active={activeSong && activeSong.id === track.id}
          >
            <div className="flex w-full items-center justify-end max-w-[376px] gap-8">
              {activeSong && activeSong.id === track.id && (
                <Statline ratings={[440, 890, 244, 5000, 5000]} average={2.4} />
              )}
              <motion.div className="min-w-[56px] transition text-end line-clamp-1">
                {track.attributes.name}
              </motion.div>
            </div>
            {activeSong && activeSong.id === track.id && <Bubble />}
          </Button>
        ))}
      </div>
      {/*<Line*/}
      {/*  width={"4px"}*/}
      {/*  color={"#E5E5E5"}*/}
      {/*  className="sticky top-0 right-[6px] flex flex-grow rounded -z-10"*/}
      {/*  height={"100%"}*/}
      {/*/>*/}
    </motion.div>
  );
};

export default Filter;
