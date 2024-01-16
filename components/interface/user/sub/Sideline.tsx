import React, { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Section } from "@/components/interface/user/User";
import Image from "next/image";
import Avatar from "@/components/global/Avatar";

const lineConfig = {
  stiffness: 400,
  damping: 20,
  mass: 0.1,
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
    [20, 100, 169, 236],
  );
  const dotYPositionOutput = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 0.99],
    [28, 108, 177, 244],
  );
  const bottomLineHeightOutput = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 0.99],
    [276, 196, 127, 60],
  );

  const topLineHeight = useSpring(topLineHeightOutput, lineConfig);
  const dotYPosition = useSpring(dotYPositionOutput, lineConfig);
  const bottomLineHeight = useSpring(bottomLineHeightOutput, lineConfig);

  return (
    <motion.div
      ref={scrollContainer}
      className="flex flex-col w-full h-[320px] overflow-y-auto snap-y snap-mandatory relative scrollbar-none z-50"
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
        <div className={`absolute left-4 flex flex-col gap-8`}>
          <Avatar
            className="rounded-max shadow-shadowKitHigh"
            imageSrc={userData.image}
            altText={`avatar`}
            width={64}
            height={64}
            user={userData}
          />

          {/* Sounds */}
          <div className={`flex items-center gap-4`}>
            <div
              className={`bg-white rounded-[6px] shadow-shadowKitLow w-8 h-8 z-10 outline outline-silver outline-1 `}
            />
            <div
              className={`bg-white rounded w-6 h-6 -ml-9 outline outline-1 outline-silver`}
            />
            <motion.div className={`flex items-center gap-1`}>
              <motion.p
                className={`text-base font-medium leading-[11px] text-black`}
              >
                {userData.soundCount}
              </motion.p>
              <motion.p className={`text-base leading-[11px] text-black`}>
                sounds
              </motion.p>
            </motion.div>
          </div>

          {/* Entries */}
          <div className={`flex items-center gap-4`}>
            <div
              className={`bg-white rounded-lg shadow-shadowKitLow w-8 h-[42px] z-10 outline outline-silver outline-1 `}
            />
            <div
              className={`bg-white rounded-lg w-8 h-[42px] -ml-[44px] -translate-y-1 outline outline-silver outline-1 rotate-[4deg]`}
            />
            <motion.div className={`flex items-center gap-1`}>
              <motion.p
                className={`text-base font-medium leading-[11px] text-black`}
              >
                {userData._count.artifact}
              </motion.p>
              <motion.p className={`text-base leading-[11px] text-black`}>
                entries
              </motion.p>
            </motion.div>
          </div>

          {/* Wisps */}
          <div className={`flex items-center gap-4`}>
            <div
              className={`bg-white rounded-[6px] shadow-shadowKitLow w-[38px] h-[24px] z-10 outline outline-silver outline-1 `}
            />
            <div
              className={`bg-white rounded-[6px] w-[30px] h-[24px] -ml-[50px] -translate-y-1 outline outline-silver outline-1 `}
            />
            <motion.div className={`ml-[2px] flex items-center gap-1`}>
              <motion.p
                className={`text-base leading-[11px] text-black font-medium`}
              >
                {userData._count.artifact}
              </motion.p>
              <motion.p className={`text-base leading-[11px] text-black`}>
                wisps
              </motion.p>
            </motion.div>
          </div>
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
