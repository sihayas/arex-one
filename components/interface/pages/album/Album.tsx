import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import Image from "next/image";

import { useSound } from "@/context/Sound";
import { useScrollPosition } from "@/hooks/useInteractions/useScrollPosition";

import { useAlbumQuery } from "@/lib/api/albumAPI";
import { animated } from "@react-spring/web";
import Albums from "./sub/Albums";

import TabBar from "./sub/TabBar";
import Songs from "./sub/Songs";

const Album = () => {
  // Hooks
  const { data: session } = useSession();
  const { selectedSound } = useSound();
  const { scrollContainerRef } = useScrollPosition();

  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const artworkUrl = selectedSound?.artworkUrl;

  const boxShadow = useMemo(() => {
    if (selectedSound?.colors[0]) {
      return `0px 0px 0px 0px ${selectedSound.colors[0]}, 0.15),
        0px -6px 13px 0px ${selectedSound.colors[0]}, 0.15),
        0px -32px 23px 0px ${selectedSound.colors[0]}, 0.13),
        0px -52px 31px 0px ${selectedSound.colors[0]}, 0.08),
        0px -93px 37px 0px ${selectedSound.colors[0]}, 0.02),
        0px -145px 41px 0px ${selectedSound.colors[0]}, 0.00)`;
    }
    return undefined;
  }, [selectedSound?.colors]);

  const handleActiveTabChange = (newActiveTabId: string | null) => {
    setActiveTabId(newActiveTabId);
  };

  // Initializes album and loads full details into selectedSound
  const { isLoading, isError } = useAlbumQuery();

  // Load and error handling
  if (!selectedSound || isLoading) {
    return <div>loading...</div>; // Replace with your preferred loading state
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col items-center h-full w-full"
    >
      {/* Top Section */}
      <animated.div className="fixed z-10 top-0 w-full h-full">
        {/* Artwork */}
        <div
          className="overflow-hidden fixed top-1/2 transform -translate-y-1/2 rounded-[24px] w-full h-full"
          onDragStart={(e) => e.preventDefault()}
          draggable="false"
          // style={{
          //   boxShadow: boxShadow,
          // }}
        >
          <Image
            src={artworkUrl || "/public/images/default.png"}
            alt={`${selectedSound.sound.attributes.name} artwork`}
            width={576}
            height={576}
            quality={100}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>
        {/* Tab Bar */}
        <div className="flex items-center absolute top-12 left-1/2 -translate-x-1/2 transform z-20 ">
          {"relationships" in selectedSound.sound && (
            <TabBar
              songs={selectedSound.sound.relationships.tracks.data}
              onActiveTabChange={handleActiveTabChange}
            />
          )}
        </div>

        {/* Rating & Stats */}
        <div
          className="absolute top-[90px] left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border border-white flex items-center justify-center"
          style={{ borderWidth: "1px" }}
        >
          <span className="font-bold text-xl text-white"></span>
        </div>

        {/* Names */}
        <div className="absolute top-[146px] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="font-bold text-sm text-white">
            {selectedSound.sound.attributes.name}
          </div>
          <div className="font-medium text-sm text-white">
            {selectedSound.sound.attributes.artistName}
          </div>
        </div>
      </animated.div>
      {/* Section Two / Entries  */}
      <div className="w-full h-full">
        <div className="h-[400px]">&nbsp; </div>
        {!activeTabId ? (
          <Albums albumId={selectedSound.sound.id} user={session!.user} />
        ) : (
          <Songs songId={activeTabId} user={session!.user} />
        )}
      </div>
    </div>
  );
};

export default Album;
