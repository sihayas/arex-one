import { useMemo, useRef, useState } from "react";
import Image from "next/image";

import { useSound } from "@/context/Sound";

import { useAlbumQuery } from "@/lib/api/albumAPI";
import Albums from "./sub/Albums";

import TabBar from "./sub/TabBar";
import Songs from "./sub/Songs";
import { motion } from "framer-motion";

const Album = () => {
  // Hooks
  const { selectedSound } = useSound();

  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState(480); // Set initial height
  const scrollContainerRef = useRef(null);

  const artworkUrl = selectedSound?.artworkUrl;

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

  const handleActiveTabChange = (newActiveTabId: string | null) => {
    setActiveTabId(newActiveTabId);
  };

  const handleScroll = () => {
    const currentScrollTop = scrollContainerRef.current.scrollTop;
    setContainerHeight(480 + currentScrollTop); // Change this formula as needed
  };

  // Initializes album and loads full details into selectedSound
  const { isLoading, isError } = useAlbumQuery();

  // Load and error handling
  if (!selectedSound || isLoading) {
    return <div>loading...</div>; // Replace with your preferred loading state
  }

  console.log("rerender");

  return (
    <motion.div
      layoutScroll
      style={{ height: containerHeight, overflow: "scroll" }}
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex flex-col items-center justify-center  w-[480px] p-8"
    >
      {/* Top Section */}
      <motion.div layout="position" className="w-full h-full relative">
        <Image
          className="rounded-2xl "
          src={artworkUrl || "/public/images/default.png"}
          alt={`${selectedSound.sound.attributes.name} artwork`}
          width={416}
          height={416}
          quality={100}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          style={{
            boxShadow: boxShadow,
          }}
        />

        {/* Tab Bar */}
        <div className="flex items-center absolute bottom-4 left-1/2 -translate-x-1/2 transform z-20 ">
          {"relationships" in selectedSound.sound && (
            <TabBar
              songs={selectedSound.sound.relationships.tracks.data}
              onActiveTabChange={handleActiveTabChange}
            />
          )}
        </div>

        {/* Rating & Stats */}
        <div
          className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border border-white flex items-center justify-center"
          style={{ borderWidth: "1px" }}
        >
          <span className="font-bold text-xl text-white"></span>
        </div>

        {/* Names */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="font-bold text-sm text-white">
            {selectedSound.sound.attributes.name}
          </div>
          <div className="font-medium text-sm text-white">
            {selectedSound.sound.attributes.artistName}
          </div>
        </div>
      </motion.div>
      <motion.div layout="position" className="w-full h-full relative">
        <Image
          className="rounded-2xl "
          src={artworkUrl || "/public/images/default.png"}
          alt={`${selectedSound.sound.attributes.name} artwork`}
          width={416}
          height={416}
          quality={100}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          style={{
            boxShadow: boxShadow,
          }}
        />
      </motion.div>
      <motion.div layout="position" className="w-full h-full relative">
        <Image
          className="rounded-2xl "
          src={artworkUrl || "/public/images/default.png"}
          alt={`${selectedSound.sound.attributes.name} artwork`}
          width={416}
          height={416}
          quality={100}
          draggable="false"
          onDragStart={(e) => e.preventDefault()}
          style={{
            boxShadow: boxShadow,
          }}
        />
      </motion.div>

      {/* Section Two / Entries  */}
      {/* <div className="w-full h-full">
        {!activeTabId ? (
          <Albums albumId={selectedSound.sound.id} user={session!.user} />
        ) : (
          <Songs songId={activeTabId} user={session!.user} />
        )}
      </div> */}
    </motion.div>
  );
};

export default Album;
