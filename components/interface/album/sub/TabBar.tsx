import { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import PropTypes from "prop-types";

interface TabBarProps {
  songs: TrackData[];
  onActiveTabChange: (newActiveTabId: string | null) => void;
}

export default function TabBar({ songs, onActiveTabChange }: TabBarProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const containerRef = useRef(null);

  const handleTabChange = (newTabId: string | null) => {
    setActiveTab(newTabId);
    onActiveTabChange(newTabId);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col overflow-y-scroll rounded-full max-h-[calc(3*1.5rem)] scrollbar-none bg-white gap-4"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {songs.map((track, index) => {
        const ref = useRef(null);
        const { scrollYProgress } = useScroll({
          target: ref,
          offset: ["center center", "center center"],
        });

        return (
          <motion.button
            key={track.id}
            ref={ref}
            onClick={() => handleTabChange(track.id)}
            className={`${
              activeTab === track.id ? "" : "hover:text-black"
            } whitespace-nowrap relative text-sm text-gray3 transition leading-none`}
            style={{
              WebkitTapHighlightColor: "transparent",
              scrollSnapAlign: "start",
              filter: `blur(${(1 - scrollYProgress) * 5}px)`, // 5 is the maximum blur
            }}
          >
            {activeTab === track.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 z-10 mix-blend-difference"
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              />
            )}
            {track.attributes.name}
          </motion.button>
        );
      })}
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
