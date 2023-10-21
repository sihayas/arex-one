import Image from "next/image";
import { useMemo, useState } from "react";

import { useSound } from "@/context/SoundContext";

import { useAlbumQuery } from "@/lib/apiHandlers/albumAPI";
import RenderRecords from "./sub/RenderRecords";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Filter from "@/components/interface/album/sub/Filter";

import { TrackData } from "@/types/appleTypes";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { JellyComponent } from "@/components/global/Loading";

import GradientBlur from "@/components/interface/album/sub/GradientBlur";

const Album = () => {
  // Hooks
  const { selectedSound } = useSound();

  const { scrollContainerRef } = useInterfaceContext();

  // Filter expansion
  const [expand, setExpand] = useState<boolean>(false);

  // Filter state
  const [activeSong, setActiveSong] = useState<TrackData | null>(null);
  const [sortOrder, setSortOrder] = useState<
    "newest" | "positive" | "negative"
  >("newest");

  const handleActiveSongChange = (newActiveSong: TrackData | null) => {
    setActiveSong(newActiveSong);
  };

  const handleSortOrderChange = (newSortOrder: typeof sortOrder) => {
    setSortOrder(newSortOrder);
  };

  const { scrollY } = useScroll({
    container: scrollContainerRef,
  });

  // Album artwork parallax
  let y = useTransform(scrollY, [0, 24], [0, -416]);
  let springY = useSpring(y, { damping: 80, stiffness: 800 });

  // Album artwork border radius
  const borderRadius = useTransform(scrollY, [0, 120], ["24px", "16px"]);
  const scale = useTransform(scrollY, [0, 48], [1, 0.867]);

  // Rating footer opacity
  const opacity = useTransform(scrollY, [0, 160], [0, 1]);

  // Initializes album. If the album doesnt have detailed data it gets it.
  const { isLoading, error } = useAlbumQuery();

  return (
    <div id={"interfaceAlbum"} className="w-full h-full">
      {!selectedSound || isLoading ? (
        <JellyComponent
          className={
            "absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2"
          }
          key="jelly"
          isVisible={true}
        />
      ) : (
        <>
          <motion.div
            style={{
              y: springY,
              borderRadius: borderRadius,
              scale: scale,
            }}
            className="pointer-events-none overflow-hidden sticky -top-0 z-50 -mb-72"
          >
            <Image
              className="outline outline-1 outline-silver"
              src={selectedSound.artworkUrl || "/public/images/default.png"}
              alt={`${selectedSound.sound.attributes.name} artwork`}
              width={480}
              height={480}
              quality={100}
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
            />
          </motion.div>

          {/* Entries */}
          <AnimatePresence>
            <RenderRecords
              soundId={`${
                !activeSong ? selectedSound.sound.id : activeSong.id
              }`}
              sortOrder={sortOrder}
            />
          </AnimatePresence>

          <GradientBlur expand={expand} />

          {/* Rating & Sort */}
          <motion.div
            style={{ opacity }}
            className={`w-full z-10 p-8 absolute bottom-0`}
          >
            {"relationships" in selectedSound.sound &&
              "tracks" in selectedSound.sound.relationships && (
                <Filter
                  albumName={selectedSound.sound.attributes.name}
                  songs={selectedSound.sound.relationships.tracks.data}
                  onActiveSongChange={handleActiveSongChange}
                  handleSortOrderChange={handleSortOrderChange}
                  expand={expand}
                  setExpand={setExpand}
                />
              )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Album;
