import { useState } from "react";
import PropTypes from "prop-types";
import { TrackData } from "@/lib/global/interfaces";
import { motion } from "framer-motion";
import { Command } from "cmdk";
import React from "react";

interface TabBarProps {
  songs: TrackData[];
  albumName: string;
  onActiveTabChange: (newActiveTabId: string | null) => void;
}

const TabBar = ({ songs, onActiveTabChange, albumName }: TabBarProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [expand, setExpand] = useState<boolean>(false);

  const handleTabChange = (newTabId: string | null) => {
    setActiveTab(newTabId);
    onActiveTabChange(newTabId);
  };

  return (
    <motion.div
      style={{ overflow: "scroll" }}
      tabIndex={0}
      onFocus={() => setExpand((prev) => !prev)}
      onBlur={() => setExpand((prev) => !prev)}
      initial={{ height: "40px" }}
      animate={{ height: expand ? "352px" : "40px" }}
      transition={{ type: "spring", damping: 50, stiffness: 500 }}
      className={`flex flex-col absolute right-0 bottom-8 bg-silver rounded w-[128px] scrollbar-none`}
    >
      <div className="flex flex-col space-y-1">
        {songs.map((track, index) => (
          <button
            key={track.id}
            onClick={() =>
              handleTabChange(track.id === activeTab ? null : track.id)
            }
            className={`${
              activeTab === track.id ? "" : "hover:text-white/60"
            } relative rounded-full px-3 py-1.5 text-sm font-medium text-black outline-sky-400 transition focus-visible:outline-2`}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {activeTab === track.id && (
              <motion.span
                layoutId="track"
                className="absolute inset-0 bg-white mix-blend-difference z-10"
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
