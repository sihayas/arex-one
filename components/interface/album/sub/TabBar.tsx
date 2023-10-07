import { useState } from "react";
import PropTypes from "prop-types";
import { TrackData } from "@/lib/global/interfaces";
import { motion } from "framer-motion";
import React from "react";
import Line from "@/components/interface/entry/sub/icons/Line";

interface TabBarProps {
  songs: TrackData[];
  onActiveSongChange: (newActiveSong: TrackData | null) => void;
  albumName: string;
}

const TabBar = ({ songs, onActiveSongChange, albumName }: TabBarProps) => {
  const [activeSong, setActiveSong] = useState<TrackData | null>(null);
  const [expand, setExpand] = useState<boolean>(false);

  const handleTabChange = (newSong: TrackData | null) => {
    if (!expand) return;
    setActiveSong(newSong);
    onActiveSongChange(newSong);
  };

  return (
    <motion.div
      tabIndex={0}
      onFocus={() => setExpand((prev) => !prev)}
      onBlur={() => setExpand((prev) => !prev)}
      initial={{ height: "36px" }}
      animate={{ height: expand ? "352px" : "36px" }}
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      className={`flex absolute right-8 bottom-8 w-[176px] scrollbar-none overflow-scroll`}
    >
      <div className="flex flex-col w-full">
        {/* Tracks */}
        <button
          key="album"
          onClick={() => handleTabChange(null)}
          className={`${
            !activeSong ? "!text-gray2" : "hover:text-black"
          } relative text-xs text-gray3 transition w-full flex items-center justify-between p-2 pr-0 font-semibold mb-6`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <p className="w-[148px] text-start line-clamp-2">
            {activeSong ? `${albumName}` : "TRACKS"}
          </p>
          {!activeSong && (
            <motion.span
              layoutId="bubble"
              className="bg-gray2 z-10 w-2 h-2 -right-1 top-1/2 -translate-y-1/2 transform outline outline-4 outline-white"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
        {songs.map((track, index) => (
          <button
            key={track.id}
            onClick={() =>
              handleTabChange(
                activeSong && track.id === activeSong.id ? null : track,
              )
            }
            className={`${
              activeSong && activeSong.id === track.id
                ? "!text-gray2"
                : "hover:text-black"
            } relative text-xs text-gray3 transition w-full flex items-center justify-between p-2 pr-0`}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <p className="w-[148px] text-start line-clamp-2">
              {track.attributes.name}
            </p>
            {activeSong && activeSong.id === track.id && (
              <motion.span
                layoutId="bubble"
                className="bg-gray2 z-10 w-2 h-2 -right-1 top-1/2 -translate-y-1/2 transform outline outline-4 outline-white"
                style={{ borderRadius: 9999 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
      <Line
        width={"4px"}
        color={"#E5E5E5"}
        className={`sticky top-0 right-[6px] flex flex-grow rounded -z-10`}
        height={"100%"}
      />
    </motion.div>
  );
};

export default TabBar;

TabBar.propTypes = {
  songs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
  onActiveSongChange: PropTypes.func.isRequired,
};
