import React, { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useTransform,
  motion,
  MotionConfig,
  PanInfo,
  AnimatePresence,
} from "framer-motion";
import useMeasure from "react-use-measure";
import Artwork = MusicKit.Artwork;
import Image from "next/image";

export const Slider = () => {
  const music = MusicKit.getInstance();
  const mediaItem = music.nowPlayingItem;

  let artwork = useRef("");

  const initialHeight = 6;
  const height = 12;
  const buffer = 12;
  const [ref, bounds] = useMeasure();

  const [hovered, setHovered] = useState(false);
  const [panning, setPanning] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const state = panning ? "panning" : hovered ? "hovered" : "idle";

  const [currentTime, setCurrentTime] = useState("");
  const [remainingTime, setRemainingTime] = useState("");

  const totalDuration = music.currentPlaybackDuration;
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => (v / totalDuration) * 100 + "%");

  const handlePan = (event: PointerEvent, info: PanInfo) => {
    setPanning(true);

    // Calculate the delta in seconds
    let delta = (info.delta.x / bounds.width) * totalDuration;
    let newTime = clamp(progress.get() + delta, 0, totalDuration);
    progress.set(newTime);

    // Format and update the current time
    setCurrentTime(MusicKit.formatMediaTime(newTime, ":"));

    // Format and update the remaining time
    const remainingTime = totalDuration - newTime;
    setRemainingTime(MusicKit.formatMediaTime(remainingTime, ":"));
  };

  const handlePanEnd = () => {
    setSeeking(true);
    setPanning(false);
    const newTimeInSeconds = progress.get();
    music.seekToTime(newTimeInSeconds);
  };

  // Update the progress bar when the playback time changes
  useEffect(() => {
    const handlePlaybackTimeDidChange = () => {
      const isSeeking = music.playbackState === MusicKit.PlaybackStates.seeking;
      const isPlaying = music.playbackState === MusicKit.PlaybackStates.playing;

      // Prevent the progress bar from updating while seeking + rubber-banding
      if (isSeeking) {
        setSeeking(true);
      } else if (isPlaying) {
        setSeeking(false);
      }
      if (panning || seeking) return;

      // Continue updating the progress bar
      progress.set(music.currentPlaybackTime);

      // Update remaining times
      const currentTime = MusicKit.formatMediaTime(
        music.currentPlaybackTime,
        ":",
      );
      setCurrentTime(currentTime);

      const remainingTime =
        music.currentPlaybackDuration - music.currentPlaybackTime;
      setRemainingTime(MusicKit.formatMediaTime(remainingTime, ":"));
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
  }, [progress, panning, seeking, music]);

  useEffect(() => {
    if (mediaItem) {
      console.log(mediaItem);
      artwork.current = MusicKit.formatArtworkURL(
        mediaItem.attributes.artwork,
        80,
        80,
      );
    }
  }, [mediaItem]);

  return (
    <MotionConfig transition={transition}>
      <div className="absolute bottom-16 bg-[#E5E5E5] rounded-2xl z-10 shadow-shadowKitHigh">
        <div className="w-[356px] h-12 rounded-2xl flex p-2">
          <AnimatePresence>
            <motion.div
              className={`min-w-[32px] min-h-[32px]`}
              initial={{ opacity: 0, scale: 0.25 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.25 }}
              key={artwork.current}
            >
              <Image
                className={`rounded-max outline outline-1 outline-silver`}
                src={artwork.current}
                alt={`artwork`}
                width={32}
                height={32}
                quality={100}
              />
            </motion.div>
          </AnimatePresence>
          {/* Main Container */}
          <div className="flex items-center justify-center w-full cursor-pointer p-2">
            {/*  Left Text */}
            <motion.div
              initial={false}
              animate={{
                color: hovered || panning ? "#000" : "#999",
              }}
              className="flex justify-start shrink-0 w-[34px] text-sm font-semibold "
            >
              {currentTime}
            </motion.div>
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
                idle: { width: "calc(95% - 64px)" },
                hovered: { width: "calc(100% - 64px)" },
                panning: { width: "calc(100% - 64px)" },
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
                className="relative rounded-lg overflow-hidden w-full"
              >
                <div className="h-full bg-silver" />
                <motion.div
                  style={{ width }}
                  className="bg-gray3 absolute w-[20%] inset-0"
                />
              </motion.div>
            </motion.div>
            {/*  Right Text */}
            <motion.div
              initial={false}
              animate={{
                color: hovered || panning ? "#000" : "#999",
              }}
              className="flex justify-end shrink-0 w-[34px] text-sm font-semibold "
            >
              {remainingTime}
            </motion.div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};

let transition = { type: "spring", bounce: 0, duration: 0.4 };

let clamp = (num: number, min: number, max: number) =>
  Math.max(Math.min(num, max), min);

// <motion.div
//     initial={false}
//     animate={{
//       color: hovered || panning ? "#000" : "#999",
//     }}
//     className="flex justify-start shrink-0 w-[34px] text-sm font-semibold "
// >
//   {currentTime}
// </motion.div>

// <motion.div
//     initial={false}
//     animate={{
//       color: hovered || panning ? "#000" : "#999",
//     }}
//     className="flex justify-end shrink-0 w-[34px] text-sm font-semibold "
// >
//   {remainingTime}
// </motion.div>
