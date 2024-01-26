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
import Image from "next/image";
import { NextTrackIcon, PauseIcon, PlayIcon } from "@/components/icons";

export const Player = () => {
  const music = MusicKit.getInstance();
  const mediaItem = music.nowPlayingItem;
  const [ref, bounds] = useMeasure();

  const artwork = useRef("");
  const name = useRef("");
  const artist = useRef("");

  const initialHeight = 6;
  const height = 12;
  const buffer = 12;

  const [currentTime, setCurrentTime] = useState("");
  const [remainingTime, setRemainingTime] = useState("");

  const [lockPlayback, setLockPlayback] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [panning, setPanning] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [playbackState, setPlaybackState] = useState(music.playbackState);

  const state = panning ? "panning" : hovered ? "hovered" : "idle";

  // Progress bar
  const totalDuration = music.currentPlaybackDuration;
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => (v / totalDuration) * 100 + "%");
  const color = hovered || panning ? "#777" : "#999";

  const handlePlayButton = () => {
    music.playbackState === MusicKit.PlaybackStates.playing
      ? music.pause()
      : music.play();
  };

  const handleNextButton = () => {
    setLockPlayback(true);
    progress.set(0);
    music
      .skipToNextItem()
      .then(() => {
        console.log("Skipped to next item successfully.");
      })
      .catch((error) => {
        console.error("Error skipping to next item:", error);
      });
  };

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
    music
      .seekToTime(newTimeInSeconds)
      .then(() => {
        setSeeking(false);
      })
      .catch((error) => {
        console.error("Error seeking to time:", error);
      });
  };

  // Update the playback state
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
      setCurrentTime(MusicKit.formatMediaTime(music.currentPlaybackTime, ":"));
      setRemainingTime(
        MusicKit.formatMediaTime(
          music.currentPlaybackDuration - music.currentPlaybackTime,
          ":",
        ),
      );
    };

    const handlePlaybackStateChange = () => {
      if (lockPlayback || panning || seeking) {
        return;
      }
      setPlaybackState(music.playbackState);
    };

    // Prevent playback state from changing until next track is ready
    const handleMediaCanPlay = () => {
      setLockPlayback(false);
    };

    music.addEventListener(
      MusicKit.Events.playbackStateDidChange,
      handlePlaybackStateChange,
    );

    music.addEventListener(MusicKit.Events.mediaCanPlay, handleMediaCanPlay);

    music.addEventListener(
      MusicKit.Events.playbackTimeDidChange,
      handlePlaybackTimeDidChange,
    );

    return () => {
      music.removeEventListener(
        MusicKit.Events.playbackStateDidChange,
        handlePlaybackStateChange,
      );
      music.removeEventListener(
        MusicKit.Events.mediaCanPlay,
        handleMediaCanPlay,
      );
      music.removeEventListener(
        MusicKit.Events.playbackTimeDidChange,
        handlePlaybackTimeDidChange,
      );
    };
  }, [music, lockPlayback, panning, seeking, progress]);

  // Update the current media item
  useEffect(() => {
    if (mediaItem) {
      artwork.current = MusicKit.formatArtworkURL(
        mediaItem.attributes.artwork,
        120,
        120,
      );
      name.current = mediaItem.attributes.name;
      artist.current = mediaItem.attributes.artistName;
    }
  }, [mediaItem]);

  return (
    <MotionConfig transition={transition}>
      <div className="absolute center-x bottom-8 bg-[#E5E5E5] rounded-2xl z-10 shadow-shadowKitHigh">
        <motion.div className="flex w-[402px] h-14 rounded-2xl p-3">
          {/* Artwork */}
          <AnimatePresence>
            <motion.div
              className={`min-w-[32px] min-h-[32px] cursor-pointer border border-silver overflow-hidden`}
              initial={{ opacity: 0, scale: 0.25 }}
              animate={{ opacity: 1, scale: 1, borderRadius: 32 }}
              exit={{ opacity: 0, scale: 0.25 }}
              whileHover={{
                scale: 1.5,
                borderRadius: 8,
              }}
              key={artwork.current}
            >
              <Image
                src={artwork.current}
                alt={`artwork`}
                width={32}
                height={32}
                quality={100}
              />
            </motion.div>
          </AnimatePresence>
          {/* Slider Container */}
          <motion.div
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            className="flex flex-col items-center justify-center w-full cursor-pointer p-2 ml-1"
          >
            {/*  Right Text */}
            <motion.div
              initial={false}
              animate={{
                color: hovered || panning ? "#777" : "#999",
              }}
              className="flex justify-start shrink-0 text-xs font-semibold ml-auto mb-1.5 leading-[8px]"
            >
              {hovered ? currentTime : artist.current}
            </motion.div>
            {/* Slider */}
            <motion.div
              animate={state}
              onPanStart={() => setPanning(true)}
              onPan={handlePan}
              onPanEnd={handlePanEnd}
              style={{ height: height + buffer }}
              className="flex items-center justify-center relative touch-none grow-0 w-full"
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
                <div className="h-full bg-[#CCC]" />
                <motion.div
                  style={{ width, backgroundColor: color }}
                  className="absolute w-[20%] inset-0"
                />
              </motion.div>
            </motion.div>
            {/*  Left Text */}
            <AnimatePresence>
              <motion.div
                initial={false}
                animate={{
                  color: hovered || panning ? "#777" : "#999",
                }}
                className="flex justify-end shrink-0 mr-auto text-xs font-semibold leading-[8px] mt-1.5"
              >
                {hovered ? remainingTime : name.current}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          {/* Play Button */}
          <motion.button
            key={playbackState}
            onClick={handlePlayButton}
            className="flex items-center justify-center p-2 rounded-max min-w-[32px]"
            whileHover={{
              color: "#666",
              scale: 1.1,
            }}
            whileTap={{
              color: "#666",
              scale: 0.9,
            }}
            initial={{
              color: "#999",
              scale: 0.75,
              opacity: 0,
            }}
            animate={{
              color: "#999",
              scale: 1,
              opacity: 1,
            }}
            exit={{
              color: "#999",
              scale: 0.75,
              opacity: 0,
            }}
          >
            {playbackState !== MusicKit.PlaybackStates.paused && <PauseIcon />}
            {playbackState === MusicKit.PlaybackStates.paused && <PlayIcon />}
          </motion.button>

          {/* Play Button */}
          <motion.button
            onClick={handleNextButton}
            className="flex items-center justify-center p-2 rounded-max min-w-[32px]"
            whileHover={{
              color: "#666",
              scale: 1.1,
            }}
            whileTap={{
              color: "#666",
              scale: 0.9,
            }}
            initial={{
              color: "#999",
              scale: 0.75,
              opacity: 0,
            }}
            animate={{
              color: "#999",
              scale: 1,
              opacity: 1,
            }}
            exit={{
              color: "#999",
              scale: 0.75,
              opacity: 0,
            }}
          >
            <NextTrackIcon />
          </motion.button>
        </motion.div>
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
