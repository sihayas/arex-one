import { useState } from "react";
import PropTypes from "prop-types";
import { TrackData, SongData } from "@/lib/global/interfaces";
import { motion } from "framer-motion";
import { Command } from "cmdk";
import React from "react";

interface TabBarProps {
  songs: TrackData[];
  onActiveSongChange: (newActiveSong: TrackData | null) => void;
}

const TabBar = ({ songs, onActiveSongChange }: TabBarProps) => {
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
      initial={{ height: "32px" }}
      animate={{ height: expand ? "352px" : "32px" }}
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      className={`flex flex-col absolute right-8 bottom-8 bg-silver rounded-2xl w-[128px] scrollbar-none overflow-scroll`}
    >
      <div className="flex flex-col space-y-1 p-2">
        {/* Album / Disable Filter Button */}
        <button
          onClick={() => handleTabChange(null)}
          className={`${
            activeSong !== null ? "" : "hover:text-white/60"
          } relative rounded-full px-[6px] py-1 text-xs text-black outline-sky-400 transition focus-visible:outline-2`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeSong === null && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 bg-white mix-blend-difference z-10"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {activeSong === null ? "TRACKS" : `${activeSong.attributes.name}`}
        </button>
        {/* Tracks */}
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
                ? "scale-105"
                : "hover:text-black"
            } relative rounded-full px-[6px] py-1 text-xs text-gray4 outline-sky-400 transition focus-visible:outline-2`}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {activeSong && activeSong.id === track.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 bg-white mix-blend-darken z-10"
                style={{ borderRadius: 9999 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {track.attributes.name}
          </button>
        ))}
      </div>
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
  onActiveTabChange: PropTypes.func.isRequired,
};
