import React, { useState, useCallback } from "react";
import { TrackData } from "@/lib/global/interfaces";
import { motion } from "framer-motion";
import Line from "@/components/interface/entry/sub/icons/Line";
import Statline from "@/components/interface/album/sub/Statline";

interface FilterProps {
  songs: TrackData[];
  onActiveSongChange: (newActiveSong: TrackData | null) => void;
  albumName: string;
}

const Bubble = () => (
  <motion.span
    layoutId="bubble"
    className="bg-gray2 z-10 w-2 h-2 outline outline-4 outline-white"
    style={{ borderRadius: 9999 }}
    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
  />
);

const Filter = ({ songs, onActiveSongChange, albumName }: FilterProps) => {
  const [activeSong, setActiveSong] = useState<TrackData | null>(null);
  const [expand, setExpand] = useState<boolean>(false);

  const handleTabChange = useCallback(
    (newSong: TrackData | null) => {
      if (!expand) return;
      setActiveSong(newSong);
      onActiveSongChange(newSong);
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
      initial={{ height: "36px" }}
      animate={{ height: expand ? "352px" : "36px" }}
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      className="flex absolute right-8 bottom-8 scrollbar-none overflow-scroll w-full"
    >
      <div className="flex flex-col w-full items-end">
        {/* Track Buttons */}
        {songs.map((track, index) => (
          <button
            key={track.id}
            onClick={() =>
              handleTabChange(
                activeSong && track.id === activeSong.id ? null : track,
              )
            }
            className={`relative text-xs transition grid items-center justify-end grid-cols-tab-cols gap-2 p-2 pr-0 ${
              activeSong && activeSong.id === track.id
                ? "!text-gray2"
                : "text-gray3 hover:text-black"
            }`}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <div className="flex w-full items-center max-w-[400px] gap-8">
              {activeSong && activeSong.id === track.id && (
                <Statline ratings={[440, 890, 244, 5000, 5000]} />
              )}
              <p className="min-w-[71px] transition text-end line-clamp-1">
                {track.attributes.name}
              </p>
            </div>
            {activeSong && activeSong.id === track.id && <Bubble />}
          </button>
        ))}
      </div>
      <Line
        width={"4px"}
        color={"#E5E5E5"}
        className="sticky top-0 right-[6px] flex flex-grow rounded -z-10"
        height={"100%"}
      />
    </motion.div>
  );
};

export default Filter;

// <button
//     key="album"
//     onClick={() => handleTabChange(null)}
//     className={`relative text-xs transition grid items-center justify-end grid-cols-tab-cols gap-2 p-2 pr-0 font-semibold mb-6 ${
//         !activeSong ? "!text-gray2" : "text-gray3 hover:text-black"
//     }`}
//     style={{
//       WebkitTapHighlightColor: "transparent",
//     }}
// >
//   <div className="flex w-full items-center">
//     &nbsp;
//     {!activeSong && <Statline />}
//   </div>
//   <p className="max-w-[138px] text-end line-clamp-2">
//     {!activeSong ? albumName : "TRACKS"}
//   </p>
//   {!activeSong && <Bubble />}
// </button>
