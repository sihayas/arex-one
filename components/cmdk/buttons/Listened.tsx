import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "../../../public/lottie/played.json";

const Listened = ({ isLoggedIn, handleListenedChange }) => {
  const [listened, setListened] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // Calculate the halfway frame for the Lottie animation
  const halfwayFrame = useRef(0);
  useEffect(() => {
    halfwayFrame.current = Math.floor(
      (lottieRef.current?.getDuration(true) ?? 0) / 2
    );
  }, [lottieRef]);

  const handleClick = () => {
    if (isLoggedIn) {
      setListened(!listened);
      handleListenedChange();

      // Toggle animation direction and play appropriate segment
      const animationDirection = listened ? -1 : 1;
      const startFrame = listened ? halfwayFrame.current : 0;
      const duration = (halfwayFrame.current * 1000) / animationData.fr;

      lottieRef.current?.setDirection(animationDirection);
      lottieRef.current?.goToAndPlay(startFrame, true);
      setTimeout(() => lottieRef.current?.pause(), duration);
    }
  };

  // Get styling properties based on component state
  const getOpacity = () => (listened ? 0.84 : hovered ? 1 : 0.53);
  const getColor = () => (listened || hovered ? "#333333" : "#CCC");

  const containerVariants = {
    initial: { scale: 1 },
    hovered: { scale: 1.05 },
  };

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
      transition={{ scale: { duration: 0.5 } }}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      {/* Lottie animation container */}
      <div
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: getOpacity(),
        }}
      >
        <Lottie
          animationData={animationData}
          loop={false}
          autoplay={false}
          initialSegment={[0, animationData.op]}
          lottieRef={lottieRef}
          style={{ width: "40px", height: "40px" }}
        />
      </div>
      {/* Text container */}
      <div
        style={{
          marginLeft: 2,
          color: getColor(),
          fontSize: 12,
        }}
      >
        {/* Static text */}
        <motion.span>listen</motion.span>
        {/* Conditional text */}
        <motion.span
          initial="hidden"
          animate={listened ? "visible" : "hidden"}
          variants={textVariants}
          transition={{ duration: 0.3 }}
        >
          ed
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Listened;
