import { motion } from "framer-motion";
import { BubbleIcon, LoveIcon } from "@/components/icons/index";
import React from "react";

type HeartIconProps = {
  className: string;
};

export const HeartIcon = ({ className }: HeartIconProps) => {
  return (
    <div className={`flex flex-col w-7 h-8 will-change-transform ${className}`}>
      <div className={`relative w-7 h-7`}>
        <motion.div>
          <BubbleIcon color={`#FF4DC9`} />
        </motion.div>

        <motion.div className={`absolute center-x center-y`}>
          <LoveIcon color={`#FFF`} />
        </motion.div>
      </div>

      <motion.div
        style={{
          backgroundColor: `#FF4DC9`,
          x: 7,
          width: 4,
          height: 4,
          borderRadius: 4,
        }}
      />
    </div>
  );
};
