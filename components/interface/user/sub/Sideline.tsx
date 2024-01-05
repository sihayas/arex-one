import React, { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Section } from "@/components/interface/user/User";

const lineConfig = {
  stiffness: 280,
  damping: 20,
};

interface StatlineProps {
  userData: any;
  activeSection: Section;
  setActiveSection: React.Dispatch<React.SetStateAction<Section>>;
}

const Section: React.FC<{
  containerRef: React.RefObject<HTMLElement>;
  title: Section;
  setActiveSection: React.Dispatch<React.SetStateAction<Section>>;
}> = ({ containerRef, title, setActiveSection }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
    offset: ["start end", "start start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest === 1) {
      setActiveSection(title);
    }
  });

  return (
    <section
      ref={ref}
      className={`snap-center min-w-full min-h-full`}
    ></section>
  );
};

const Sideline = ({ userData, setActiveSection }: StatlineProps) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollContainer });

  const topLineHeightOutput = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 0.99],
    [16, 56, 96, 136],
  );
  const dotYPositionOutput = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 0.99],
    [24, 64, 104, 144],
  );
  const bottomLineHeightOutput = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 0.99],
    [280, 240, 200, 160],
  );

  const topLineHeight = useSpring(topLineHeightOutput, lineConfig);
  const dotYPosition = useSpring(dotYPositionOutput, lineConfig);
  const bottomLineHeight = useSpring(bottomLineHeightOutput, lineConfig);

  return (
    <motion.div
      ref={scrollContainer}
      className="flex flex-col w-[8px] h-[320px] overflow-y-auto snap-y snap-mandatory relative scrollbar-none"
    >
      <Section
        title={"essentials"}
        containerRef={scrollContainer}
        setActiveSection={setActiveSection}
      />
      <Section
        title={"sounds"}
        containerRef={scrollContainer}
        setActiveSection={setActiveSection}
      />
      <Section
        title={"entries"}
        containerRef={scrollContainer}
        setActiveSection={setActiveSection}
      />
      <Section
        title={"wisps"}
        containerRef={scrollContainer}
        setActiveSection={setActiveSection}
      />

      {/* Sideline */}
      <div className={`fixed pointer-events-none w-[8px] h-[320px]`}>
        {/* Data */}
        <div
          className={`absolute top-[22.5px] left-4 flex flex-col gap-[29px] text-base font-medium tracking-tighter`}
        >
          <motion.div className={`relative flex justify-start gap-1`}>
            <motion.p className={`leading-[11px]`}>RX</motion.p>
            <motion.p className={`text-xs leading-[8px]`}>essentials</motion.p>
          </motion.div>

          <motion.div className={`relative flex justify-start gap-1`}>
            <motion.p className={`leading-[11px]`}>
              {userData.soundCount}
            </motion.p>
            <motion.p className={`text-xs leading-[8px]`}>sounds</motion.p>
          </motion.div>

          <motion.div className={`relative flex justify-start gap-1`}>
            <motion.p className={`leading-[11px]`}>
              {userData._count.artifact}
            </motion.p>
            <motion.p className={`text-xs leading-[8px]`}>entries</motion.p>
          </motion.div>

          <motion.div className={`relative flex justify-start gap-1`}>
            <motion.p className={`leading-[11px]`}>
              {userData._count.artifact}
            </motion.p>
            <motion.p className={`text-xs leading-[8px]`}>wisps</motion.p>
          </motion.div>
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
    </motion.div>
  );
};

export default Sideline;

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
