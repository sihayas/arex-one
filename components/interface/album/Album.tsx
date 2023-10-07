import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { useSound } from "@/context/Sound";

import { useAlbumQuery } from "@/lib/api/albumAPI";
import RenderEntries from "./sub/RenderEntries";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import TabBar from "@/components/interface/album/sub/TabBar";

import { TrackData } from "@/lib/global/interfaces";
import { StarOneIcon } from "@/components/icons";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { JellyComponent } from "@/components/global/Loading";

const Album = () => {
  // Hooks
  const { selectedSound } = useSound();
  const { data: session } = useSession();

  const { scrollContainerRef } = useInterfaceContext();

  const [activeSong, setActiveSong] = useState<TrackData | null>(null);
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "highest" | "lowest" | "most" | "least"
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

  let y = useTransform(scrollY, [0, 24], [0, -416]);
  let springY = useSpring(y, { damping: 80, stiffness: 800 });

  const borderRadius = useTransform(scrollY, [0, 120], ["24px", "8px"]);

  // Rating footer opacity
  const opacity = useTransform(scrollY, [0, 160], [0, 1]);
  const blurOpacity = useTransform(scrollY, [0, 160], [0, 1]);

  // Initializes album and loads full details into selectedSound context
  const { isLoading } = useAlbumQuery();

  const boxShadow = useMemo(() => {
    if (selectedSound?.colors[0]) {
      return `0px 3px 6px 0px ${selectedSound.colors[0]}, 0.15),
        0px 11px 11px 0px ${selectedSound.colors[0]}, 0.13),
        0px 26px 16px 0px ${selectedSound.colors[0]}, 0.08),
        0px 46px 18px 0px ${selectedSound.colors[0]}, 0.02),
        0px 72px 20px 0px ${selectedSound.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedSound?.colors]);

  return (
    <div className="w-full h-full">
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
              boxShadow: boxShadow,
              borderRadius: borderRadius,
            }}
            className="pointer-events-none overflow-hidden sticky -top-0 z-50"
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
            {/*  Circle with Number Inside */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="flex items-center justify-center w-[96px] h-[96px] rounded-full outline outline-white">
                <div className="text-4xl font-medium text-white/90">4.2</div>
              </div>
            </div>
          </motion.div>
          {/* Section Two / Entries */}
          <RenderEntries
            soundId={`${!activeSong ? selectedSound.sound.id : activeSong.id}`}
            user={session!.user}
            sortOrder={sortOrder}
          />

          <motion.div
            style={{ opacity: blurOpacity }}
            className="gradient-blur"
          >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </motion.div>

          {/* Rating & Sort */}
          <motion.div
            style={{ opacity }}
            className="fixed flex bottom-0 left-1/2 transform -translate-x-1/2 w-full p-8 z-10"
          >
            {"relationships" in selectedSound.sound && (
              <TabBar
                songs={selectedSound.sound.relationships.tracks.data}
                onActiveSongChange={handleActiveSongChange}
              />
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Album;
