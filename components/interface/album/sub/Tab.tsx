import { motion } from "framer-motion";
import { useState } from "react";

let tabs = [
  { id: "world", label: "World" },
  { id: "ny", label: "N.Y." },
  { id: "business", label: "Business" },
  { id: "arts", label: "Arts" },
  { id: "science", label: "Science" },
];

type Tab = {
  className?: string;
};
function Tab({ className }: Tab) {
  let [activeTab, setActiveTab] = useState("null");

  const readButtonVariants = {
    hover: {
      opacity: 1,
    },
  };

  return (
    <motion.div
      variants={readButtonVariants}
      className={`flex space-x-1 bg-silver ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${
            activeTab === tab.id ? "" : "hover:text-white/60"
          } relative rounded-full px-3 py-1.5 text-sm font-medium text-black outline-sky-400 focus-visible:outline-2`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              variants={readButtonVariants}
              layoutId="bubble"
              className="absolute inset-0 bg-white mix-blend-difference z-10"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </motion.div>
  );
}

export default Tab;
