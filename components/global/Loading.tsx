import React from "react";
import styles from "@/styles/jelly.module.css";
import { motion } from "framer-motion";

interface Props {
  isVisible: boolean;
  className: string;
}

export const JellyComponent: React.FC<Props> = ({ isVisible, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: isVisible ? 5 : 0 }} // Added delay here
      className={className}
    >
      <div className={styles.jelly}></div>
      <svg width="0" height="0" className={styles.jellyMaker}>
        <defs>
          <filter id={styles.uibJellyOoze}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="6.25"
              result="blur"
            ></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="ooze"
            ></feColorMatrix>
            <feBlend in="SourceGraphic" in2="ooze"></feBlend>
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
};
