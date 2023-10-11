import React from "react";
import { motion } from "framer-motion";
import styles from "@/styles/gradient.module.css";

interface GradientBlurProps {
  expand?: boolean;
}

const GradientBlur: React.FC<GradientBlurProps> = ({ expand }) => {
  return (
    <motion.div
      animate={{ height: expand ? "50%" : "10%" }}
      className={styles.gradientBlur}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </motion.div>
  );
};

export default GradientBlur;
