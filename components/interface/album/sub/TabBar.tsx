import { motion } from "framer-motion";
import { use, useState } from "react";
import PropTypes from "prop-types";
import { SongData, TrackData } from "@/lib/global/interfaces";

interface TabBarProps {
  songs: TrackData[];
  onActiveTabChange: (newActiveTabId: string | null) => void;
}

export default function TabBar({ songs, onActiveTabChange }: TabBarProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabChange = (newTabId: string | null) => {
    setActiveTab(newTabId);
    onActiveTabChange(newTabId);
  };

  return (
    <div className="flex overflow-scroll rounded-full backdrop-blur-xl max-w-[448px] scrollbar-none bg-silver2">
      {/* Default button */}
      <button
        onClick={() => handleTabChange(null)}
        className={`${
          activeTab === null ? "" : "hover:text-gray3"
        } whitespace-nowrap relative rounded-full px-1 py-1 text-xs font-semibold text-white outline-sky-400 transition focus-visible:outline-2 `}
        style={{
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {activeTab === null && (
          <motion.span
            layoutId="bubble"
            className="absolute inset-0 z-10 mix-blend-difference bg-blurWhite"
            style={{ borderRadius: 9999 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
          />
        )}
        <svg height="18" width="18">
          <circle
            cx="9"
            cy="9"
            r="8.5"
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </button>

      {/* Existing song tabs */}
      {songs.map((track: TrackData) => (
        <button
          key={track.id}
          onClick={() => handleTabChange(track.id)}
          className={`${
            activeTab === track.id ? "" : "hover:text-gray3"
          } whitespace-nowrap relative rounded-full px-3 py-1 text-xs font-semibold text-white outline-sky-400 transition focus-visible:outline-2 `}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === track.id && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 z-10 mix-blend-difference bg-blurWhite"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            />
          )}
          {track.attributes.name}
        </button>
      ))}
    </div>
  );
}

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
//h
