import { motion } from "framer-motion";
import { CurveIcon, ExpandCurveIcon, TinyCurveIcon } from "@/components/icons";
import React from "react";

// Define the animation variants
const dotVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 49,
      stiffness: 400,
    },
  },
};

const containerVariants = {
  hidden: { transition: { staggerChildren: 0.02 } },
  visible: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.02,
    },
  },
};

// Create a styled dot component
const Dot = () => {
  return (
    <motion.div
      className="w-1 h-1 bg-gray4 rounded-full"
      variants={dotVariants}
    />
  );
};

export const Interaction = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute -bottom-[38px] -right-[38px] flex items-end cursor-pointer mix-blend-multiply z-10`}
    >
      <motion.div
        animate={{
          x: !isHovered ? -22 : -10,
          y: !isHovered ? -22 : -10,
          scale: !isHovered ? 1 : 0.5,
          opacity: !isHovered ? 1 : 0,
        }}
        className={`absolute bottom-0 right-0`}
      >
        <ExpandCurveIcon color={"#CCC"} />
      </motion.div>

      {/* System */}
      <motion.div
        className="flex flex-row-reverse gap-2 justify-center items-center pr-2 origin-top-right"
        variants={containerVariants}
        animate={isHovered ? "visible" : "hidden"}
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <Dot key={index} />
        ))}
        <motion.div
          variants={dotVariants}
          className={`w-8 h-8 bg-gray4 rounded-full`}
        />
        <motion.div
          className="w-1 h-1 bg-gray4 rounded-full"
          variants={dotVariants}
        />
        <motion.div
          variants={dotVariants}
          className={`w-8 h-8 bg-gray4 rounded-full`}
        />
      </motion.div>

      {/* Sound Actions */}
      <div className={`flex flex-col items-end`}>
        <motion.div
          className="flex flex-col-reverse gap-2 justify-center items-center pb-2"
          variants={containerVariants}
          animate={isHovered ? "visible" : "hidden"}
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <Dot key={index} />
          ))}
          <motion.div
            variants={dotVariants}
            className={`w-8 h-8 bg-gray4 rounded-full`}
          />
          <motion.div
            className="w-1 h-1 bg-gray4 rounded-full"
            variants={dotVariants}
          />
          <motion.div
            variants={dotVariants}
            className={`w-8 h-8 bg-gray4 rounded-full`}
          />
        </motion.div>
        <motion.div
          animate={{
            x: !isHovered ? -12 : 0,
            y: !isHovered ? -12 : 0,
            scale: !isHovered ? 0 : 1,
            opacity: !isHovered ? 0 : 1,
          }}
          className={`w-8 h-8 origin-top-left`}
        >
          <TinyCurveIcon color={"#F4F4F4"} />
        </motion.div>
      </div>
    </motion.div>
  );
};
