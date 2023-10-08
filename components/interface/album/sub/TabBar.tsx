import React, { useState, useCallback } from "react";
import { TrackData } from "@/lib/global/interfaces";
import { motion } from "framer-motion";
import Line from "@/components/interface/entry/sub/icons/Line";
import { StarOneIcon } from "@/components/icons";

interface TabBarProps {
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

type StatlineProps = {
  rating: number;
  entries: number;
};
const Statline = ({ rating, entries }: StatlineProps) => (
  <motion.div
    className="flex flex-row-reverse gap-2"
    layoutId="statline"
    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
  >
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      className="flex-grow bg-[#E5E5E5] h-[1.5px] w-16 my-auto rounded origin-right"
    />
  </motion.div>
);

const TabBar = ({ songs, onActiveSongChange, albumName }: TabBarProps) => {
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
        <button
          key="album"
          onClick={() => handleTabChange(null)}
          className={`relative text-xs transition grid items-center justify-end grid-cols-tab-cols gap-2 p-2 pr-0 font-semibold mb-6 ${
            !activeSong ? "!text-gray2" : "text-gray3 hover:text-black"
          }`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <div className="flex w-full items-center">
            &nbsp;
            {!activeSong && <Statline />}
          </div>
          <p className="max-w-[138px] text-end line-clamp-2">
            {!activeSong ? albumName : "TRACKS"}
          </p>
          {!activeSong && <Bubble />}
        </button>

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
            <div className="flex w-full items-center">
              &nbsp;
              {activeSong && activeSong.id === track.id && <Statline />}
            </div>
            <p className="max-w-[138px] text-end line-clamp-2">
              {track.attributes.name}
            </p>
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

export default TabBar;

{
  /* Album Button */
}
// <button
//     key="album"
//     onClick={() => handleTabChange(null)}
//     className={`relative text-xs transition w-full flex items-center justify-between p-2 pr-0 font-semibold mb-6 ${
//         !activeSong ? "!text-gray2" : "text-gray3 hover:text-black"
//     }`}
//     style={{
//       WebkitTapHighlightColor: "transparent",
//     }}
// >
//   <p className="max-w-[148px] text-end line-clamp-2">
//     {activeSong ? albumName : "TRACKS"}
//   </p>
//   {!activeSong && <Bubble />}
// </button>
