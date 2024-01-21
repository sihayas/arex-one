import { useEffect, useState } from "react";
import {
  useMotionValue,
  useTransform,
  motion,
  MotionConfig,
  useMotionValueEvent,
} from "framer-motion";
import useMeasure from "react-use-measure";
import { useSoundContext } from "@/context/SoundContext";

export const Slider = () => {
  // const { musicKit } = useSoundContext();
  // let music = MusicKit.getInstance();

  let initialHeight = 4;
  let height = 12;
  let buffer = 12;
  let [ref, bounds] = useMeasure();
  let [hovered, setHovered] = useState(false);
  let [panning, setPanning] = useState(false);
  let progress = useMotionValue(0.5);
  let width = useTransform(progress, (v) => `${v * 100}%`);
  let roundedProgress = useTransform(
    progress,
    (v) => `${roundTo(v * 100, 0)}%`,
  );
  let [progressState, setProgressState] = useState(roundedProgress.get());
  let state = panning ? "panning" : hovered ? "hovered" : "idle";

  useMotionValueEvent(roundedProgress, "change", (latest) => {
    setProgressState(latest);
  });

  // Update progress to match current playback progress
  useEffect(() => {
    if (MusicKit) {
      const music = MusicKit.getInstance();

      // Directly define the event handler inside the useEffect hook.
      const handleProgressChange = () => {
        console.log(MusicKit);
        console.log("Player state:", MusicKit.Events);
        console.log("Player state:", music.currentPlaybackProgress);
        console.log("Player state:", music.isPlaying);
        console.log("Player state:", music.currentPlaybackDuration);
        console.log("Player state:", music.currentPlaybackTime);
        console.log("Player state:", music.currentPlaybackTimeRemaining);
      };

      music.addEventListener(
        MusicKit.Events.playbackProgressDidChange,
        handleProgressChange,
      );

      // Cleanup function to remove the event listener
      return () => {
        music.removeEventListener(
          MusicKit.Events.playbackProgressDidChange,
          handleProgressChange,
        );
      };
    }
  }, []); // Removed progress from dependencies since it's not used here.

  return (
    <MotionConfig transition={transition}>
      <div className="absolute flex items-center justify-center p-8 bg-gray2 z-10">
        <div className="w-[375px] h-full bg-gray-800 rounded-2xl flex flex-col justify-center">
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex items-center justify-center w-full">
              {/*  Icon here */}
              <motion.div
                initial={false}
                animate={{
                  color:
                    hovered || panning
                      ? "rgb(255,255,255)"
                      : "rgb(120,113,108)",
                }}
                className="flex justify-start shrink-0 w-6"
              ></motion.div>
              {/* Slider */}
              <motion.div
                animate={state}
                onPanStart={() => setPanning(true)}
                onPanEnd={() => setPanning(false)}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                onPan={(event, info) => {
                  let deltaInPercent = info.delta.x / bounds.width;
                  let newPercent = clamp(progress.get() + deltaInPercent, 0, 1);
                  progress.set(newPercent);
                }}
                style={{ height: height + buffer }}
                className="flex items-center justify-center relative touch-none grow-0"
                variants={{
                  idle: { width: "calc(95% - 48px)" },
                  hovered: { width: "calc(100% - 48px)" },
                  panning: { width: "calc(100% - 48px)" },
                }}
                initial={false}
                ref={ref}
              >
                <motion.div
                  initial={false}
                  variants={{
                    idle: { height: initialHeight },
                    hovered: { height },
                    panning: { height },
                  }}
                  className="relative rounded-full overflow-hidden w-full"
                >
                  <div className="h-full bg-white/20" />
                  <motion.div
                    style={{ width }}
                    className="bg-white absolute w-[20%] inset-0"
                  />
                </motion.div>
              </motion.div>
              {/*  Icon Here */}
              <motion.div
                initial={false}
                animate={{
                  color:
                    hovered || panning
                      ? "rgb(255,255,255)"
                      : "rgb(120,113,108)",
                }}
                className="flex justify-end shrink-0 w-6"
              ></motion.div>
            </div>
            {/* Label */}
            <motion.div
              initial={false}
              animate={{
                color:
                  hovered || panning ? "rgb(255,255,255)" : "rgb(120,113,108)",
              }}
              className={`select-none mt-4 text-center text-sm font-semibold tabular-nums`}
            >
              {progressState}
            </motion.div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};

let transition = { type: "spring", bounce: 0, duration: 0.3 };

let clamp = (num: number, min: number, max: number) =>
  Math.max(Math.min(num, max), min);

function roundTo(number: number, decimals: number): number {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
