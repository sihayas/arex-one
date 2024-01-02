import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { UserType } from "@/types/dbTypes";

const lineConfig = {
  stiffness: 280,
  damping: 20,
};

const scaleConfig = {
  stiffness: 200,
  damping: 14,
};

interface StatlineProps {
  userData: any;
}

const Statline = ({ userData }: StatlineProps) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollContainer });

  const opacitySoundsOut = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const blurSoundsOut = useTransform(scrollYProgress, (value) => {
    const maxBlur = 4;
    const blur = Math.min(value / 0.25, 1) * maxBlur;
    return `blur(${blur}px)`;
  });

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

  const opacityWispsIn = useTransform(
    scrollYProgress,
    [0.75, 1, 1.25],
    [0, 1, 0],
  );

  // Line transitions
  const topLineHeightOutput = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [16, 56, 88],
  );
  const dotYPositionOutput = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [24, 64, 96],
  );
  const bottomLineHeightOutput = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [336, 296, 264],
  );

  const topLineHeight = useSpring(topLineHeightOutput, lineConfig);
  const dotYPosition = useSpring(dotYPositionOutput, lineConfig);
  const bottomLineHeight = useSpring(bottomLineHeightOutput, lineConfig);

  return (
    <motion.div
      ref={scrollContainer}
      className="flex flex-col w-full h-full overflow-y-scroll snap-y snap-mandatory relative scrollbar-none"
    >
      {/* Statline */}
      <div className={`fixed pointer-events-none w-[80px] h-[376px]`}>
        {/* Data */}
        <div
          className={`absolute top-6 right-12 flex flex-col gap-[29px] text-base leading-[11px] items-end font-medium tracking-tighter`}
        >
          <motion.div>{userData.soundCount}</motion.div>
          <motion.div>{userData._count.artifact}</motion.div>
        </div>

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
            width: "8px",
            height: "8px",
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
            className={`absolute text-sm leading-[9px] left-[13px] tracking-tighter center-y`}
          >
            <motion.p
              style={{
                filter: blurSoundsOut,
                opacity: opacitySoundsOut,
                transformOrigin: "bottom",
                position: "absolute",
                top: "50%",
                translateY: "-50%",
              }}
            >
              sounds
            </motion.p>
            <motion.p
              style={{
                filter: blurEntriesOut,
                opacity: opacityEntriesIn,
                transformOrigin: "bottom",
                position: "absolute",
                top: "50%",
                translateY: "-50%",
              }}
            >
              entries
            </motion.p>
            <motion.p
              style={{
                opacity: opacityWispsIn,
                transformOrigin: "bottom",
                position: "absolute",
                top: "50%",
                translateY: "-50%",
              }}
            >
              wisps
            </motion.p>
          </div>
        </motion.div>
        {/* Bottom Line */}
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

      {/* Stats  */}

      <section className={`snap-center min-w-full min-h-full `}></section>
      <section className={`snap-center min-w-full min-h-full`}></section>
      <section className={`snap-center min-w-full min-h-full`}></section>
    </motion.div>
  );
};

export default Statline;
