import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

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

  // const blurSoundsOut = useTransform(scrollYProgress, (value) => {
  //   const maxBlur = 4;
  //   const blur = Math.min(value / 0.25, 1) * maxBlur;
  //   return `blur(${blur}px)`;
  // });
  //
  //
  //
  // const blurEntriesOut = useTransform(scrollYProgress, (value) => {
  //   const maxBlur = 4;
  //   let normalizedValue = (value - 0.5) * 4;
  //   const blur = Math.max(0, Math.min(1, normalizedValue)) * maxBlur;
  //   return `blur(${blur}px)`;
  // });

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
    [280, 240, 208],
  );

  const topLineHeight = useSpring(topLineHeightOutput, lineConfig);
  const dotYPosition = useSpring(dotYPositionOutput, lineConfig);
  const bottomLineHeight = useSpring(bottomLineHeightOutput, lineConfig);

  return (
    <motion.div
      ref={scrollContainer}
      className="flex flex-col w-[8px] h-[384px] overflow-y-scroll snap-y snap-mandatory relative scrollbar-none justify-center"
    >
      {/* Statline */}
      <div className={`fixed pointer-events-none w-[8px] h-[320px]`}>
        {/* Data */}
        <div
          className={`absolute top-6 left-4 flex flex-col gap-[29px] text-base font-medium tracking-tighter`}
        >
          <motion.div className={`relative flex justify-start gap-1`}>
            <motion.p className={`leading-[11px]`}>
              {userData.soundCount}
            </motion.p>
            <motion.p className={`text-xs leading-[8px]`}>sounds</motion.p>
          </motion.div>
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
        ></motion.div>
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
