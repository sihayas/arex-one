import { motion } from "framer-motion";
import { useState } from "react";

let tabs = [
  { id: "world", label: "HIGHLIGHTS" },
  { id: "ny", label: "LOWLIGHTS" },
  { id: "business", label: "RECENT" },
];

export default function TabBar() {
  let [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex space-x-1 border rounded-full border-silver">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${
            activeTab === tab.id ? "" : "hover:text-gray3"
          } relative rounded-full px-3 py-1 text-xs font-medium text-black outline-sky-400 transition focus-visible:outline-2 hoverable-small`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 z-10 bg-white mix-blend-difference"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
