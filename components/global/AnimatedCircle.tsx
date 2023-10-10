import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { PositiveIcon, NegativeIcon, HighlightsIcon } from "@/components/icons";

const AnimatedCircle = () => {
  const controls = useAnimation();
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const radius = 16 - 2.5 / 2; // Adjust radius to accommodate stroke width
  const strokeWidth = 1.5;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const targetOffset = isClicked ? circumference : circumference * 0.25;
    controls.start({ strokeDashoffset: targetOffset });
  }, [isClicked, controls, circumference]);

  return (
    <div className="relative h-8 w-8" style={{ transform: "scaleX(-1)" }}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ cursor: "pointer", transform: "rotate(-90deg)" }}
        onClick={() => setIsClicked((prev) => !prev)}
        className="relative"
      >
        <motion.circle
          initial={{ strokeDashoffset: circumference * 0.25 }}
          animate={controls}
          cx="16" // Center the circle at 16, 16
          cy="16"
          r={radius}
          stroke="#CCC"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      {/*<div className="absolute top-[6px] left-[2px]">*/}
      {/*  <NegativeIcon />*/}
      {/*</div>*/}
      {/*<div className="absolute top-[2px] left-[2px]">*/}
      {/*  <PositiveIcon />*/}
      {/*</div>*/}
      <div className="absolute top-[2px] left-[2px]">
        <HighlightsIcon />
      </div>
    </div>
  );
};

export default AnimatedCircle;
