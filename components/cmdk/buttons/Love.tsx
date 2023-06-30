import React, { useState } from "react";
import { motion } from "framer-motion";
import { LoveOutlinedIcon } from "../../icons";

const Love = ({ isLoggedIn, handleLovedChange }) => {
  // State for the love button
  const [loved, setLoved] = useState(false);
  // State for hover effect
  const [hovered, setHovered] = useState(false);

  // Handle love button click event
  const handleClick = () => {
    if (isLoggedIn) {
      setLoved(!loved);
      handleLovedChange();
    }
  };

  // Determine the color based on button state
  const getColor = () => (loved || hovered ? "#333333" : "#CCC");

  // Variants for the love button container
  const containerVariants = {
    initial: { scale: 1 },
    hovered: { scale: 1.01 },
    tapped: { scale: 0.95 },
  };

  // Variants for the 'd' text animation
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial="initial"
      whileHover={containerVariants["hovered"]}
      whileTap={containerVariants["tapped"]}
      transition={{ scale: { duration: 0.5 } }}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      {/* Icon container */}
      <div
        className="border rounded-full border-silver"
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoveOutlinedIcon
          width={24}
          height={24}
          fill={loved ? "#585858" : getColor()}
        />
      </div>
      {/* Text container */}
      <div
        style={{
          color: loved ? "#585858" : getColor(),
          fontSize: 12,
          marginLeft: 8,
        }}
      >
        <motion.span>love</motion.span>
        <motion.span
          initial="hidden"
          animate={loved ? "visible" : "hidden"}
          variants={textVariants}
          transition={{ duration: 0.3 }}
        >
          d
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Love;
