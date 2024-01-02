import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const springConfig = {
  stiffness: 200,
  damping: 20,
};

interface StatlineProps {}

const Statline = ({}: StatlineProps) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollContainer });

  const scaleSoundsOut = useTransform(scrollYProgress, [0, 0.25], [1, 0.75]);
  const opacitySoundsOut = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const blurSoundsOut = useTransform(scrollYProgress, (value) => {
    const maxBlur = 4;
    const blur = Math.min(value / 0.25, 1) * maxBlur;
    return `blur(${blur}px)`;
  });

  const scaleEntriesIn = useTransform(
    scrollYProgress,
    [0.25, 0.5, 0.75],
    [0.75, 1, 0.75],
  );
  const opacityEntriesIn = useTransform(
    scrollYProgress,
    [0.25, 0.5, 0.75],
    [0, 1, 0],
  );
  const blurEntriesOut = useTransform(scrollYProgress, (value) => {
    const maxBlur = 4;
    let normalizedValue = (value - 0.5) * 4;
    const blur = Math.max(0, Math.min(1, normalizedValue)) * maxBlur;
    return `blur(${blur}px)`;
  });

  const scaleWispsIn = useTransform(
    scrollYProgress,
    [0.75, 1, 1.25],
    [0.75, 1, 0.75],
  );

  const opacityWispsIn = useTransform(
    scrollYProgress,
    [0.75, 1, 1.25],
    [0, 1, 0],
  );

  // Line transitions
  const topLineHeightOutput = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [16, 57, 98],
  );
  const dotYPositionOutput = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [24, 64, 106],
  );
  const bottomLineHeightOutput = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [335, 294, 253],
  );

  const topLineHeight = useSpring(topLineHeightOutput, springConfig);
  const dotYPosition = useSpring(dotYPositionOutput, springConfig);
  const bottomLineHeight = useSpring(bottomLineHeightOutput, springConfig);

  return (
    <motion.div
      ref={scrollContainer}
      className="flex flex-col w-full h-full overflow-y-scroll snap-y snap-mandatory relative scrollbar-none"
    >
      {/* Statline */}
      <div className={`fixed pointer-events-none w-[80px] h-[376px]`}>
        {/*  Top Line */}
        <motion.div
          className={`center-x`}
          style={{
            background: "rgba(0,0,0,0.1)",
            width: "4px",
            height: topLineHeight,
            borderRadius: "4px",
            position: "absolute",
            top: 0,
          }}
        />
        {/*  Dot  */}
        <motion.div
          style={{
            background: "#000",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            translateY: dotYPosition,
            translateX: "-50%",
            position: "absolute",
            top: 0,
            left: "50%",
          }}
        >
          {/* Indicator Text */}
          <div
            className={`absolute text-sm leading-[9px] left-[17px] tracking-tight`}
          >
            <motion.p
              style={{
                scale: scaleSoundsOut,
                filter: blurSoundsOut,
                opacity: opacitySoundsOut,
                transformOrigin: "bottom",
                position: "absolute",
              }}
            >
              sounds
            </motion.p>
            <motion.p
              style={{
                scale: scaleEntriesIn,
                filter: blurEntriesOut,
                opacity: opacityEntriesIn,
                transformOrigin: "bottom",
                position: "absolute",
              }}
            >
              entries
            </motion.p>
            <motion.p
              style={{
                scale: scaleWispsIn,
                opacity: opacityWispsIn,
                transformOrigin: "bottom",
                position: "absolute",
              }}
            >
              wisps
            </motion.p>
          </div>
        </motion.div>
        <motion.div
          className={`center-x`}
          style={{
            background: "rgba(0,0,0,0.1)",
            width: "4px",
            height: bottomLineHeight,
            position: "absolute",
            borderRadius: "4px",
            bottom: 0,
          }}
        />
      </div>
      <section className={`snap-center min-w-full min-h-full `}></section>
      <section className={`snap-center min-w-full min-h-full`}></section>
      <section className={`snap-center min-w-full min-h-full`}></section>
    </motion.div>
  );
};

export default Statline;
