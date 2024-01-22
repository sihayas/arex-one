import { useEffect, useState } from "react";
import {
  useMotionValue,
  useTransform,
  motion,
  MotionConfig,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import useMeasure from "react-use-measure";

export const Slider = () => {
  let currentPlaybackTime;
  const initialHeight = 4;
  const height = 12;
  const buffer = 12;
  const [ref, bounds] = useMeasure();
  const [hovered, setHovered] = useState(false);
  const [panning, setPanning] = useState(false);
  const [seeking, setSeeking] = useState(false);

  const music = MusicKit.getInstance();

  const totalDuration = music.currentPlaybackDuration;
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => (v / totalDuration) * 100 + "%");

  // For the current progress/time label
  const [progressText, setProgressText] = useState("");
  const state = panning ? "panning" : hovered ? "hovered" : "idle";

  //@ts-ignore
  const handlePan = (event, info) => {
    setPanning(true);

    // Calculate the delta in seconds instead of a percentage
    let deltaInSeconds = (info.delta.x / bounds.width) * totalDuration;
    let newTimeInSeconds = clamp(
      progress.get() + deltaInSeconds,
      0,
      totalDuration,
    );
    progress.set(newTimeInSeconds);

    // Format and update the current time
    const formattedTime = MusicKit.formatMediaTime(newTimeInSeconds, ":");
    setProgressText(formattedTime);
  };

  const handlePanEnd = () => {
    setSeeking(true);
    setPanning(false);
    const newTimeInSeconds = progress.get();
    music.seekToTime(newTimeInSeconds);
  };

  useEffect(() => {
    const music = MusicKit.getInstance();

    const handlePlaybackTimeDidChange = () => {
      const isSeeking = music.playbackState === MusicKit.PlaybackStates.seeking;
      const isPlaying = music.playbackState === MusicKit.PlaybackStates.playing;

      if (isSeeking) {
        setSeeking(true);
      } else if (isPlaying) {
        setSeeking(false);
      }

      // Don't update progress if we're panning
      if (panning || seeking) return;

      // Update progress slider
      progress.set(music.currentPlaybackTime);

      // Update progress text
      const currentPlaybackTime = MusicKit.formatMediaTime(
        music.currentPlaybackTime,
        ":",
      );
      setProgressText(currentPlaybackTime);
    };

    music.addEventListener(
      MusicKit.Events.playbackTimeDidChange,
      handlePlaybackTimeDidChange,
    );

    return () => {
      music.removeEventListener(
        MusicKit.Events.playbackTimeDidChange,
        handlePlaybackTimeDidChange,
      );
    };
  }, [progress, panning, seeking]);

  return (
    <MotionConfig transition={transition}>
      <div className="absolute flex items-center justify-center p-8 bg-gray2 z-10">
        <div className="w-[375px] h-full bg-gray-800 rounded-2xl flex flex-col justify-center">
          {/* Main Container */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex items-center justify-center w-full cursor-pointer">
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
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                onPanStart={() => setPanning(true)}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
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
              >
                {currentPlaybackTime}
              </motion.div>
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
              {progressText}
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
